import { KeyRound } from 'lucide-react'
import Link from 'next/link'
import { createMetadata } from '@/config/seo'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import ForgotPasswordForm from './form'

export const metadata = createMetadata({
  title: 'Forgot Password',
  description: 'Reset your password to regain access to your PocketStarter account. Enter your email to receive a reset link.'
})

export default function ForgotPassword() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md border shadow-xl bg-card">
        <CardHeader className="space-y-4 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <KeyRound className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ForgotPasswordForm />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 