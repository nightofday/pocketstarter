'use client'

import { Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/stores/auth'
import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'
import { validatePassword } from '@/lib/validation'

export default function PasswordChange() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    general: ''
  })
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors = { currentPassword: '', newPassword: '', general: '' }

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.message
      }
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return !newErrors.currentPassword && !newErrors.newPassword
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setIsUpdating(true)
    setErrors({ currentPassword: '', newPassword: '', general: '' })
    setSuccessMessage('')

    try {
      // Use PocketBase's built-in changePassword method
      await pocketbase.collection(Collections.Users).update(user.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword
      })

      // Success
      setSuccessMessage('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')

    } catch (error) {
      console.error('Password update error:', error)
      setErrors(prev => ({ ...prev, general: 'Failed to update password' }))
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle>Change Password</CardTitle>
        </div>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                if (errors.currentPassword) {
                  setErrors(prev => ({ ...prev, currentPassword: '' }))
                }
                if (successMessage) setSuccessMessage('')
              }}
              className={`border-2 ${errors.currentPassword ? 'border-destructive' : 'border-border'}`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (errors.newPassword) {
                    setErrors(prev => ({ ...prev, newPassword: '' }))
                  }
                  if (successMessage) setSuccessMessage('')
                }}
                className={`border-2 pr-10 ${errors.newPassword ? 'border-destructive' : 'border-border'}`}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long and contain at least one letter and one number
            </p>
          </div>

          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!currentPassword || !newPassword || isUpdating}
            className="w-full md:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 