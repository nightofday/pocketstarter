import { Suspense } from 'react'
import { CheckCircle } from 'lucide-react'
import { createMetadata } from '@/config/seo'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VerifyForm from './form'

export const metadata = createMetadata({
  title: 'Verify Email',
  description: 'Verify your email address to complete your account setup.'
})

export default function VerifyEmail() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md border shadow-xl bg-card">
        <CardHeader className="space-y-4 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <CheckCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
          <CardDescription>
            Confirm your email address to complete your account setup
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <VerifyForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 