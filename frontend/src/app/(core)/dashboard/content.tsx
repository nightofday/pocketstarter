'use client'

import { useAuth } from '@/stores/auth'

export default function UserDashboardContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="h-6 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h3 className="text-lg font-mono text-foreground">[Your content]</h3>
      <p className="text-muted-foreground">
        You are signed in as{' '}
        <span className="font-medium text-foreground">{user?.email}</span>.
      </p>
    </div>
  )
} 