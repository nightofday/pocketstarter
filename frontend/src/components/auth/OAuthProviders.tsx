'use client'

import { useSearchParams } from 'next/navigation'
import { getEnabledProviders } from '@/lib/auth/providers'
import { OAuthButton } from './OAuthButton'

interface OAuthProvidersProps {
  onError: (error: string) => void
}

// Client component that handles search params
function OAuthProvidersClient({ onError }: OAuthProvidersProps) {
  const providers = getEnabledProviders()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  // If no providers are enabled, don't render anything
  if (providers.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <OAuthButton
          key={provider.name}
          provider={provider}
          onError={onError}
          redirectTo={redirectTo}
        />
      ))}
    </div>
  )
}

// Server component that wraps the client component
export function OAuthProviders(props: OAuthProvidersProps) {
  return <OAuthProvidersClient {...props} />
} 