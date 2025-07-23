'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

import PublicNavigation from '@/components/layout/PublicNavigation'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl font-bold text-foreground">Error</h1>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Something went wrong
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                An unexpected error occurred. Please try again or contact support if the problem persists.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-sm text-left">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 