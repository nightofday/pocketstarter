import { User } from 'lucide-react'
import { Suspense } from 'react'
import { createMetadata } from '@/config/seo'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import LoginForm from './form'

export const metadata = createMetadata({
  title: 'Sign In',
  description: 'Sign in to your PocketStarter account to access your dashboard and manage your content efficiently.'
})

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md border shadow-xl bg-card">
        <CardHeader className="space-y-4 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 