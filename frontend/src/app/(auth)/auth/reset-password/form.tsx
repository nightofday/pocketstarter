'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'
import { validatePassword } from '@/lib/validation'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message)
      return
    }

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await pocketbase.collection(Collections.Users).confirmPasswordReset(
        token,
        password,
        confirmPassword
      )

      setMessage('Password updated successfully! Redirecting to sign in...')
      
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <>
        <Alert variant="destructive">
          <AlertDescription>Invalid reset link. Please request a new password reset.</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push('/auth/forgot-password')}
          className="w-full"
        >
          Request New Reset Link
        </Button>
      </>
    )
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Updating Password...' : 'Update Password'}
      </Button>
    </form>
  )
} 