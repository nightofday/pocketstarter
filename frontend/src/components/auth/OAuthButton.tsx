'use client'

import { Button } from '@/components/ui/button'
import { OAuthProvider } from '@/lib/auth/providers'
import { handleOAuthSignIn } from '@/lib/auth/handlers'

interface OAuthButtonProps {
  provider: OAuthProvider
  onError: (error: string) => void
  redirectTo: string
}

export function OAuthButton({ 
  provider, 
  onError,
  redirectTo
}: OAuthButtonProps) {
  const Icon = provider.icon

  const handleClick = () => {
    handleOAuthSignIn(provider.provider, {
      onError,
      redirectTo
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="w-full h-12 border hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
    >
      <>
        <Icon className="mr-3 h-5 w-5" />
        {provider.displayName}
      </>
    </Button>
  )
} 