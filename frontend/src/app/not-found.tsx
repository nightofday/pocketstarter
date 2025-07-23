import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

import PublicNavigation from '@/components/layout/PublicNavigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Icon */}
        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Page not found
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                Go back home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
} 