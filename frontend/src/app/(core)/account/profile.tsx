'use client'

import { Loader2, Save, User } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/stores/auth'
import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'

export default function ProfileSection() {
  const { user, loading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.target as HTMLFormElement)
    
    setIsUpdating(true)
    try {
      await pocketbase.collection(Collections.Users).update(user.id, {
        name: formData.get('displayName')?.toString().trim() || '',
        wants_marketing: formData.get('marketing') === 'on'
      })
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile: ' + (error instanceof Error ? error.message : 'An error occurred'))
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Profile Card Loading */}
        <Card className="border-1 border-border bg-card">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-muted animate-pulse rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Details Loading */}
        <Card className="border-1 border-border bg-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading account...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card className="border-1 border-border bg-card">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-accent shadow-lg">
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {user.name || user.email?.split('@')[0]}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Account Details */}
      <Card className="border-1 border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>
            View your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
              <code className="text-xs bg-muted px-3 py-1.5 rounded-lg border-2 border-border block">
                {user.id}
              </code>
            </div>
          </div>
          
          <Separator className="my-4 border-border" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Label className="text-sm font-medium text-muted-foreground">Email Status</Label>
              <Badge variant={user.verified ? "default" : "secondary"} className="font-semibold border-2 ml-2">
                {user.verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
            <div className="flex items-center">
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-foreground font-medium ml-2">
                {user.created ? new Date(user.created).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="border-1 border-border bg-card">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your display name and other preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={user?.name || user?.email?.split('@')[0] || ''}
                className="border-2 border-border"
              />
              <p className="text-sm text-muted-foreground">
                This is how your name will be displayed throughout the app.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="marketing"
                name="marketing"
                defaultChecked={user?.wants_marketing ?? false}
              />
              <Label htmlFor="marketing">Receive marketing emails</Label>
            </div>
            
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full md:w-auto"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 