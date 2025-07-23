import { Suspense } from 'react'
import { createMetadata } from '@/config/seo'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import ResetPasswordForm from './form'

export const metadata = createMetadata({
  title: 'Reset Password',
  description: 'Create a new password for your PocketStarter account and regain access to your dashboard.'
})

function ResetPasswordContent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
} 