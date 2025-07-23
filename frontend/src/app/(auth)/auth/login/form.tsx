'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { handleEmailSignIn, handleRequestVerification } from '@/lib/auth/handlers'
import { OAuthProviders } from '@/components/auth/OAuthProviders'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    await handleEmailSignIn(email, password, {
      onSuccess: () => {
        // Check for redirect parameter and use it, otherwise go to dashboard
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        router.push(redirectTo)
      },
      onError: setError,
      setLoading
    })
  }

  const handleResendVerification = async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    await handleRequestVerification(email, {
      onSuccess: () => {
        setSuccessMessage('Verification email sent! Please check your inbox.')
      },
      onError: setError,
      setLoading
    })
  }

  const showResendButton = error?.toLowerCase().includes('verify') && email

  return (
    <div className="space-y-6">
      <OAuthProviders onError={setError} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 border border-input focus:border-primary hover:border-accent transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="h-12 border border-input focus:border-primary hover:border-accent transition-colors"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Sign in to your account'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {showResendButton && (
        <Button
          onClick={handleResendVerification}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Resend verification email
        </Button>
      )}

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline">
            Sign up here
          </Link>
        </p>
        <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
          Forgot your password?
        </Link>
      </div>
    </div>
  )
} 