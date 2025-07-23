import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'

export interface AuthHandlerOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  setLoading?: (loading: boolean) => void
  redirectTo?: string
}

/**
 * OAuth sign-in handler
 */
export const handleOAuthSignIn = async (
  provider: string, 
  options: AuthHandlerOptions = {}
) => {
  const { onSuccess, onError, redirectTo } = options
  
  try {
    await pocketbase.collection(Collections.Users).authWithOAuth2({ provider })
    if (onSuccess) onSuccess()
    
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
  } catch {
    if (onError) onError('Failed to sign in')
  }
}

/**
 * Email/password sign-in handler
 */
export const handleEmailSignIn = async (
  email: string,
  password: string,
  options: AuthHandlerOptions = {}
) => {
  const { onSuccess, onError, setLoading } = options
  if (setLoading) setLoading(true)
  
  try {
    const authData = await pocketbase.collection(Collections.Users).authWithPassword(email, password)
    
    if (!authData.record.verified) {
      pocketbase.authStore.clear()
      throw new Error('Please verify your email before signing in')
    }

    if (onSuccess) onSuccess()
  } catch {
    if (onError) onError('Failed to sign in')
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Email/password sign-up handler
 */
export const handleEmailSignUp = async (
  email: string,
  password: string,
  options: AuthHandlerOptions = {}
) => {
  const { onSuccess, onError, setLoading } = options
  if (setLoading) setLoading(true)
  
  try {
    await pocketbase.collection(Collections.Users).create({
      email,
      password,
      passwordConfirm: password,
      emailVisibility: true,
    })

    await pocketbase.collection(Collections.Users).requestVerification(email)
    if (onSuccess) onSuccess()
  } catch {
    if (onError) onError('Failed to sign up')
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Request email verification
 */
export const handleRequestVerification = async (
  email: string,
  options: AuthHandlerOptions = {}
) => {
  const { onSuccess, onError, setLoading } = options
  if (setLoading) setLoading(true)
  
  try {
    await pocketbase.collection(Collections.Users).requestVerification(email)
    if (onSuccess) onSuccess()
  } catch {
    if (onError) onError('Failed to request verification')
  } finally {
    if (setLoading) setLoading(false)
  }
} 