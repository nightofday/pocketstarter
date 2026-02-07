'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { redirectToCheckout } from '@/lib/stripe'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  stripePriceId: string
  mode?: 'subscription' | 'payment'
  trialDays?: number
  popular?: boolean
  cta?: string
  compact?: boolean // For smaller cards in account section
}

export function PricingCard({
  name,
  price,
  description,
  features,
  stripePriceId,
  mode = 'subscription',
  trialDays = 0,
  popular = false,
  cta = 'Get Started',
  compact = false
}: PricingCardProps) {
  const { user, loading: authLoading } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to sign up if not authenticated
      window.location.href = '/auth/signup'
      return
    }

    setCheckoutLoading(true)
    try {
      await redirectToCheckout({
        mode,
        priceId: stripePriceId,
        trialDays,
      })
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
      setCheckoutLoading(false)
    }
  }

  const period = mode === 'payment' ? ' once' : '/month'

  return (
    <Card 
      className={`relative ${popular ? 'border-primary shadow-lg scale-105' : 'border-border'} ${
        compact ? 'text-sm' : ''
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-2 py-1 text-xs">
            {compact ? 'Popular' : 'Most Popular'}
          </Badge>
        </div>
      )}

      <CardHeader className={`text-center ${compact ? 'pb-4' : 'pb-8'}`}>
        <CardTitle className={compact ? 'text-lg font-semibold' : 'text-2xl font-bold'}>
          {name}
        </CardTitle>
        <CardDescription className={compact ? 'text-sm' : 'text-base'}>
          {description}
        </CardDescription>
        <div className="mt-2">
          <span className={`font-bold text-foreground ${compact ? 'text-2xl' : 'text-4xl'}`}>
            {price}
          </span>
          <span className={`text-muted-foreground ${compact ? 'text-sm' : ''}`}>
            {period}
          </span>
          {trialDays > 0 && (
            <div className={`text-primary mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
              {trialDays}-day free trial
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? 'pb-4' : 'space-y-4'}>
        <ul className={compact ? 'space-y-2' : 'space-y-3'}>
          {(compact ? features.slice(0, 3) : features).map((feature, index) => (
            <li key={index} className={`flex items-center ${compact ? 'space-x-2' : 'space-x-3'}`}>
              <Check className={`text-primary flex-shrink-0 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                {feature}
              </span>
            </li>
          ))}
          {compact && features.length > 3 && (
            <li className="text-xs text-muted-foreground">
              + {features.length - 3} more features
            </li>
          )}
        </ul>
      </CardContent>

      <CardFooter className={compact ? 'pt-0' : ''}>
        {name === 'Free' ? (
          authLoading ? (
            <div className={`w-full text-center text-muted-foreground ${compact ? 'text-sm py-2' : 'py-3'}`}>
              Loading...
            </div>
          ) : user ? (
            <div className={`w-full text-center text-muted-foreground ${compact ? 'text-sm py-2' : 'py-3'}`}>
              Current Plan
            </div>
          ) : (
            <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          )
        ) : (
          <Button
            onClick={handleCheckout}
            disabled={authLoading || checkoutLoading}
            className={`w-full ${compact ? 'text-sm py-2' : ''}`}
            variant={popular ? "default" : "outline"}
          >
            {checkoutLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : authLoading ? (
              'Loading...'
            ) : user ? (
              cta
            ) : (
              `Sign up to ${cta}`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 