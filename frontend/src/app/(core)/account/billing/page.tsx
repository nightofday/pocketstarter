import { createMetadata } from '@/config/seo'
import BillingSection from './billing-section'

export const metadata = createMetadata({
  title: 'Account Settings - Billing'
})

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <BillingSection />
    </div>
  )
} 