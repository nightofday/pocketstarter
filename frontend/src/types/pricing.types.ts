/**
 * Type definitions for pricing plans
 * This file provides TypeScript support for pricing.ts
 */

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  priceMonthly?: number  // Optional for one-time payments
  priceOneTime?: number  // For one-time payments
  stripePriceId: string
  trialDays?: number     // Not applicable for one-time payments
  features: string[]
  popular: boolean
  cta: string
  mode: 'subscription' | 'payment'  // Payment mode
}

 