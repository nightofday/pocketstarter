import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'

export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'none'

// Core Stripe API functions
export async function createCheckoutSession({
  mode = 'subscription',
  priceId,
  trialDays = 0
}: {
  mode?: 'subscription' | 'payment'
  priceId: string
  trialDays?: number
}) {
  if (!pocketbase.authStore.isValid) {
    throw new Error('Please sign in to continue')
  }

  const response = await pocketbase.send('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ mode, priceId, trialDays }),
  })

  if (!response.url) {
    throw new Error('Failed to create checkout session')
  }

  return response.url
}

export async function createPortalSession() {
  if (!pocketbase.authStore.isValid) {
    throw new Error('Please sign in to continue')
  }

  const response = await pocketbase.send('/api/stripe/portal', {
    method: 'POST',
    body: JSON.stringify({}),
  })

  if (!response.url) {
    throw new Error('Failed to create portal session')
  }

  return response.url
}

export async function checkSubscription(): Promise<SubscriptionStatus> {
  if (!pocketbase.authStore.isValid) return 'none'
  
  try {
    const subscription = await pocketbase.collection(Collections.Subscriptions)
      .getFirstListItem(`user = "${pocketbase.authStore.record?.id}" && (subscription_status = "active" || subscription_status = "trialing")`)
    return (subscription?.subscription_status as SubscriptionStatus) || 'none'
  } catch {
    return 'none'
  }
}

// Client-side convenience functions
export async function redirectToCheckout(params: {
  mode?: 'subscription' | 'payment'
  priceId: string
  trialDays?: number
}) {
  try {
    const url = await createCheckoutSession(params)
    window.location.href = url
  } catch (error) {
    console.error('Checkout failed:', error)
    throw error
  }
}

export async function redirectToPortal() {
  try {
    const url = await createPortalSession()
    window.open(url, '_blank')
  } catch (error) {
    console.error('Portal failed:', error)
    throw error
  }
} 