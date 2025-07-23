'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'
import { handleRequestVerification } from '@/lib/auth/handlers'

export default function VerifyForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setError('Invalid verification link. Please request a new verification email.')
        return
      }

      setLoading(true)
      try {
        await pocketbase.collection(Collections.Users).confirmVerification(token)
        setMessage('Email verified successfully! You can now sign in.')
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const handleResendVerification = async () => {
    const email = searchParams.get('email')
    if (!email) {
      setError('No email address found. Please try signing up again.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    await handleRequestVerification(email, {
      onSuccess: () => {
        setMessage('Verification email sent! Please check your inbox.')
      },
      onError: (error) => {
        setError(error)
      },
      setLoading
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {error && (
        <div className="space-y-4 text-center">
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full"
          >
            Resend verification email
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Or{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
            >
              return to sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  )
} 