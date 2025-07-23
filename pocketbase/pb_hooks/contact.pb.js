/// <reference path="../pb_data/types.d.ts" />

// Contact form submission hook
routerAdd("POST", "/api/contact", (c) => {
    try {
        const data = c.requestInfo().body;
        // Validate required fields
        if (!data || !data.name || !data.email || !data.message) {
            return c.json(400, { 
                error: "Missing required fields: name, email, and message are required" 
            })
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            return c.json(400, { 
                error: "Invalid email format" 
            })
        }
        
        // Send notification email to admin using PocketBase's built-in mailer
        const message = new MailerMessage({
            from: {
                address: $app.settings().meta.senderAddress,
                name: $app.settings().meta.senderName,
            },
            to: [{ 
                address: $app.settings().meta.senderAddress // Send to admin email
            }],
            subject: `New Contact Form Submission from ${data.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
                <p><small>Reply directly to: ${data.email}</small></p>
            `
        })
        
        // Send the email
        $app.newMailClient().send(message)
        
        return c.json(200, { 
            success: true, 
            message: "Message sent successfully" 
        })
        
    } catch (error) {
        console.error("Contact form error:", error)
        return c.json(500, { 
            error: "Failed to send message. Please try again." 
        })
    }
});