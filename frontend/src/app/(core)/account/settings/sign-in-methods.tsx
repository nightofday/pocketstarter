'use client'

import { Mail, Eye, EyeOff, Save, Loader2, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/stores/auth'
import { pocketbase } from '@/lib/pocketbase'
import { ClientResponseError } from 'pocketbase'
import { Collections } from '@/types/pocketbase-types'
import { validatePassword } from '@/lib/validation'
import { oauthProviders } from '@/lib/auth/providers'

export default function SignInMethods() {
  const { user, signOut } = useAuth()
  const [connectedProviders, setConnectedProviders] = useState<string[]>([])
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch connected providers
  useEffect(() => {
    if (!user) return

    const fetchProviders = async () => {
      try {
        const result = await pocketbase.collection(Collections.Externalauths).getList(1, 50, {
          filter: `recordRef = "${user.id}"`
        })
        setConnectedProviders(result.items.map((item: { provider: string }) => item.provider))
      } catch (err) {
        if (!(err as ClientResponseError).isAbort) {
          console.error('Failed to fetch providers:', err)
        }
      }
    }

    fetchProviders()
  }, [user])

  const resetPasswordForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setShowPasswordChange(false)
    setError('')
    setSuccess('')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!currentPassword || !newPassword) {
      setError('All fields are required')
      return
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message)
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password')
      return
    }

    setIsUpdating(true)

    try {
      await pocketbase.collection(Collections.Users).update(user!.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword
      })

      setSuccess('Password updated successfully! Signing you out for security...')
      
      // Sign out the user after a brief delay to show the success message
      setTimeout(async () => {
        resetPasswordForm()
        await signOut()
      }, 2000)
    } catch {
      setError('Failed to update password')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Sign-in Methods</CardTitle>
        </div>
        <CardDescription>
          Manage how you sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connected OAuth providers */}
        {connectedProviders.map(provider => {
          const config = oauthProviders[provider as keyof typeof oauthProviders]
          const IconComponent = config?.icon

          return (
            <div key={provider} className="border border-border rounded-md overflow-hidden">
              <div className="p-4 flex items-center justify-between bg-background/50 border-b border-border">
                <div className="flex items-center">
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                  <span className="font-medium capitalize">{provider}</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 rounded-full">
                  Connected
                </span>
              </div>
              <div className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  You can use your <span className="capitalize">{provider}</span> account to sign in
                </p>
              </div>
            </div>
          )
        })}

        {/* Email & password */}
        <div className="border border-border rounded-md overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-background/50 border-b border-border">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-medium">Email</span>
            </div>
          </div>

          <div className="p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => showPasswordChange ? resetPasswordForm() : setShowPasswordChange(true)}
                className="text-sm hover:underline"
              >
                {showPasswordChange ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {showPasswordChange && (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-1 h-8 px-3 hover:bg-transparent"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert variant="success">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 