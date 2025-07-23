// Pricing configuration - single source of truth for all pricing data

import type { PricingPlan } from '@/types/pricing.types'

// Main pricing plans configuration
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    price: '$0',
    priceMonthly: 0,
    stripePriceId: '', // No Stripe price needed for free plan
    mode: 'subscription',
    features: [
      'Feature 1',
      'Feature 2'
    ],
    popular: false,
    cta: 'Get Started'
  },
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Full access with monthly billing',
    price: '$9',
    priceMonthly: 9,
    stripePriceId: '', // Replace with your actual Stripe price ID
    trialDays: 14,
    mode: 'subscription',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
      'Feature 5'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    description: 'One-time payment for lifetime access',
    price: '$99',
    priceOneTime: 99,
    stripePriceId: '', // Replace with your actual Stripe one-time price ID
    mode: 'payment',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
      'Feature 5',
      'Feature 6'
    ],
    popular: false,
    cta: 'Buy Lifetime'
  }
] 