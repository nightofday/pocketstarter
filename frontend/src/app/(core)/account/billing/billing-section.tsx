'use client'

import { useState } from 'react'
import { useAuth } from '@/stores/auth'
import { redirectToPortal } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Loader2 } from 'lucide-react'
import { PricingCard } from '@/components/billing/PricingCard'
import { pricingPlans } from '@/config/pricing'

export default function BillingSection() {
  const { subscriptionStatus } = useAuth()
  const [portalLoading, setPortalLoading] = useState(false)

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      await redirectToPortal()
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open portal. Please try again.')
      setPortalLoading(false)
    }
  }

  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    return (
      <div className="text-center p-8 rounded-lg border bg-card">
        <h2 className="text-2xl font-bold mb-4">
          {subscriptionStatus === 'active' ? 'Active Subscription' : 'Trial Active'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {subscriptionStatus === 'active' 
            ? 'You have access to all premium features' 
            : 'Enjoying your trial period? You have access to all premium features'}
        </p>
        <Button onClick={handlePortal} disabled={portalLoading}>
          {portalLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Subscription
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-1 border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Upgrade Your Plan
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Choose a plan that works best for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              stripePriceId={plan.stripePriceId}
              mode={plan.mode}
              trialDays={plan.trialDays}
              popular={plan.popular}
              cta={plan.cta}
              compact
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 