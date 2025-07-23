'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { handleEmailSignUp } from '@/lib/auth/handlers'
import { validatePassword } from '@/lib/validation'
import { OAuthProviders } from '@/components/auth/OAuthProviders'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsSuccess(false)

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setMessage(passwordValidation.message)
      return
    }

    await handleEmailSignUp(email, password, {
      onSuccess: () => {
        setIsSuccess(true)
        setMessage('Account created! Please check your email to verify your account.')
        // Clear form
        setEmail('')
        setPassword('')
      },
      onError: (error) => {
        setMessage(error)
      },
      setLoading
    })
  }

  return (
    <div className="space-y-6">
      {!isSuccess ? (
        <>
          <OAuthProviders onError={setMessage} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-medium">
                Or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 border border-input focus:border-primary hover:border-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="h-12 border border-input focus:border-primary hover:border-accent transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long and contain at least one letter and one number
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </>
      ) : (
        <Alert variant="success" className="bg-green-50">
          <AlertDescription className="text-center py-4">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {!isSuccess && message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 