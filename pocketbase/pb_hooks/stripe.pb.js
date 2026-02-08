/// <reference path="../pb_data/types.d.ts" />

// Stripe webhook endpoint
routerAdd("POST", "/api/stripe/webhook", (c) => {
    // Constants
    const STRIPE_API_VERSION = '2023-10-16';
    const STRIPE_BASE_URL = 'https://api.stripe.com/v1';
    
    // Helper function to verify Stripe webhook signature
    function verifyStripeSignature(signature, body, secret) {
        if (!signature || !secret) {
            throw new Error('Missing signature or webhook secret');
        }
        
        const [timestampPart, signaturePart] = signature.split(',');
        if (!timestampPart?.startsWith('t=') || !signaturePart?.startsWith('v1=')) {
            throw new Error("Invalid Stripe signature format");
        }
        
        const timestamp = timestampPart.substring(2);
        const stripeSignature = signaturePart.substring(3);
        const rawBody = toString(body);
        
        if ($security.hs256(`${timestamp}.${rawBody}`, secret) !== stripeSignature) {
            throw new Error("Stripe webhook signature verification failed");
        }
    }
    
    // Helper function to find subscription by Stripe subscription ID
    function findSubscriptionByStripeId(subscriptionId) {
        return $app.findRecordsByFilter(
            'subscriptions',
            `stripe_subscription_id="${subscriptionId}"`,
            null,
            1
        )[0] || null;
    }
    
    // Helper function to create or update subscription record
    function createOrUpdateSubscriptionRecord(subscriptionId, status, userId = null, customerId = null) {
        let record = findSubscriptionByStripeId(subscriptionId);
        
        // If not found by subscriptionId and we have userId, try finding by userId
        if (!record && userId) {
            record = $app.findRecordsByFilter('subscriptions', `user.id = "${userId}"`, null, 1)[0];
        }
        
        if (record) {
            // Update existing record
            if (customerId) record.set("stripe_customer_id", customerId);
            if (subscriptionId) record.set("stripe_subscription_id", subscriptionId);
            if (status) record.set("subscription_status", status);
            $app.save(record);
        } else if (userId) {
            // Create new record (only if we have userId)
            record = new Record($app.findCollectionByNameOrId('subscriptions'), {
                user: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: status
            });
            $app.save(record);
        }
        
        return record;
    }
    
    // Main webhook processing logic
    try {
        // Verify webhook signature
        const signature = c.request.header.get('stripe-signature');
        verifyStripeSignature(signature, c.request.body, process.env.STRIPE_WEBHOOK_SECRET);
        
        // Parse and validate event
        const event = c.requestInfo().body;
        if (!event?.type || !event?.data?.object) {
            throw new Error("Invalid event format");
        }
        
        // Process different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                (function() {
                    const session = event.data.object;
                    const userId = session.metadata ? session.metadata.userId : null;
                    
                    if (!userId) return;
                    
                    if (session.mode === "subscription" && session.subscription) {
                        const subscriptionId = session.subscription;
                        
                        // Get subscription details from Stripe API
                        const response = $http.send({
                            url: `${STRIPE_BASE_URL}/subscriptions/${subscriptionId}`,
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Stripe-Version': STRIPE_API_VERSION
                            }
                        });
                        
                        if (response.statusCode !== 200) return;
                        
                        const subscription = JSON.parse(response.raw);
                        const customerId = session.customer || null;
                        
                        createOrUpdateSubscriptionRecord(subscriptionId, subscription.status, userId, customerId);
                    } else if (session.mode === "payment") {
                        // For one-time payments, create a subscription record with active status
                        const customerId = session.customer || null;
                        const paymentIntentId = session.payment_intent || null;
                        
                        // Use payment_intent as a temporary subscription ID for one-time payments
                        if (paymentIntentId) {
                            createOrUpdateSubscriptionRecord(paymentIntentId, "active", userId, customerId);
                        }
                    }
                })();
                break;
            }
            
            case 'invoice.paid': {
                (function() {
                    const invoice = event.data.object;
                    if (!invoice.subscription) return;
                    createOrUpdateSubscriptionRecord(invoice.subscription, "active");
                })();
                break;
            }
            
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                (function() {
                    const subscription = event.data.object;
                    
                    try {
                        const status = event.type === 'customer.subscription.deleted' ? "canceled" : subscription.status;
                        createOrUpdateSubscriptionRecord(subscription.id, status);
                    } catch {}
                })();
                break;
            }
        }
        
        return c.json(200, { received: true });
        
    } catch (err) {
        console.error('Webhook processing error:', err);
        return c.json(400, { error: 'Invalid payload or signature' });
    }
});

// Portal session creation endpoint
routerAdd("POST", "/api/stripe/portal", (c) => {
    // Helper function to authenticate user
    function authenticateUser(authHeader) {
        if (!authHeader) {
            throw new Error("Authentication required");
        }
        
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        const userRecord = $app.findAuthRecordByToken(token, "auth");
        
        if (!userRecord) {
            throw new Error("Invalid authentication token");
        }
        
        return userRecord;
    }
    
    // Helper function to find user subscription
    function findUserSubscription(userId) {
        const subscription = $app.findRecordsByFilter(
            'subscriptions',
            `user.id = "${userId}"`,
            null,
            1
        )[0];
        
        if (!subscription) {
            throw new Error("No subscription found for this account");
        }
        
        const customerId = subscription.get("stripe_customer_id");
        if (!customerId) {
            throw new Error("No Stripe customer found for this subscription");
        }
        
        return customerId;
    }
    
    // Helper function to create Stripe portal session
    function createPortalSession(customerId) {
        const baseUrl = $app.settings().meta.appURL;
        
        const response = $http.send({
            url: "https://api.stripe.com/v1/billing_portal/sessions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `customer=${customerId}&return_url=${baseUrl}/dashboard`
        });
        
        if (response.statusCode !== 200) {
            throw new Error("Failed to create portal session");
        }
        
        return JSON.parse(response.raw);
    }
    
    try {
        const authHeader = c.request.header.get('Authorization');
        const userRecord = authenticateUser(authHeader);
        const customerId = findUserSubscription(userRecord.id);
        const sessionData = createPortalSession(customerId);
        
        return c.json(200, { url: sessionData.url });
        
    } catch (error) {
        console.error("Error creating portal session:", error);
        const statusCode = error.message.includes("Authentication") ? 401 : 
                          error.message.includes("subscription") ? 400 : 500;
        return c.json(statusCode, { error: error.message });
    }
});

// Checkout session creation endpoint
routerAdd("POST", "/api/stripe/checkout", (c) => {
    // Helper function to authenticate user
    function authenticateUser(authHeader) {
        if (!authHeader) {
            throw new Error("Authentication required");
        }
        
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        const userRecord = $app.findAuthRecordByToken(token, "auth");
        
        if (!userRecord) {
            throw new Error("Invalid authentication token");
        }
        
        return userRecord;
    }
    
    // Helper function to validate checkout request
    function validateCheckoutRequest(body) {
        const { mode = 'subscription', priceId, trialDays = 0 } = body;
        
        if (!priceId) {
            throw new Error("Missing required field: priceId");
        }
        
        return { mode, priceId, trialDays };
    }
    
    // Helper function to build checkout session body
    function buildCheckoutBody(params, userRecord) {
        const { mode, priceId, trialDays } = params;
        const baseUrl = $app.settings().meta.appURL;
        
        let body = `mode=${encodeURIComponent(mode)}`;
        body += `&line_items[0][price]=${encodeURIComponent(priceId)}`;
        body += `&line_items[0][quantity]=1`;
        body += `&success_url=${encodeURIComponent(baseUrl + '/account/billing/success?session_id={CHECKOUT_SESSION_ID}')}`;
        body += `&cancel_url=${encodeURIComponent(baseUrl + '/pricing')}`;
        body += `&metadata[userId]=${encodeURIComponent(userRecord.id)}`;
        body += `&customer_email=${encodeURIComponent(userRecord.get('email'))}`;
        
        if (mode === 'subscription' && trialDays > 0) {
            body += `&subscription_data[trial_period_days]=${trialDays}`;
        }
        
        return body;
    }
    
    // Helper function to create Stripe checkout session
    function createCheckoutSession(body) {
        const response = $http.send({
            url: "https://api.stripe.com/v1/checkout/sessions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });
        
        if (response.statusCode !== 200) {
            throw new Error("Failed to create checkout session");
        }
        
        return JSON.parse(response.raw);
    }
    
    try {
        const authHeader = c.request.header.get('Authorization');
        const userRecord = authenticateUser(authHeader);
        const params = validateCheckoutRequest(c.requestInfo().body);
        const body = buildCheckoutBody(params, userRecord);
        const sessionData = createCheckoutSession(body);
        
        return c.json(200, { url: sessionData.url });
        
    } catch (error) {
        console.error("Error creating checkout session:", error);
        const statusCode = error.message.includes("Authentication") ? 401 : 
                          error.message.includes("Missing required") ? 400 : 500;
        return c.json(statusCode, { error: error.message });
    }
}); 