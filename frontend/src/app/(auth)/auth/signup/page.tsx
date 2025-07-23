import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { createMetadata } from '@/config/seo'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import SignupForm from './form'

export const metadata = createMetadata({
  title: 'Create Account',
  description: 'Create a new account to get started with PocketStarter and unlock powerful content management features.'
})

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md border shadow-xl bg-card">
        <CardHeader className="space-y-4 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Suspense>
            <SignupForm />
          </Suspense>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
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