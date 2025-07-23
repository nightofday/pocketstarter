import { createMetadata } from '@/config/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = createMetadata({
  title: 'Payment Successful',
  description: 'Your payment was processed successfully.'
})

export default function BillingSuccess() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200 shadow-lg bg-card">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase! Your subscription has been activated.
              </p>
              <p className="text-sm text-muted-foreground">
                You now have access to all premium features. You can manage your subscription anytime from your dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="flex items-center gap-2">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/account/billing">
                  Manage Subscription
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 