import PocketBase from 'pocketbase'
import { TypedPocketBase } from '@/types/pocketbase-types'
import { Collections } from '@/types/pocketbase-types'

// Create PocketBase instance
export const pocketbase = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL
) as TypedPocketBase

// Only sync cookies and handle auth on client-side
if (typeof window !== 'undefined') {
  // Load initial auth state from cookie
  pocketbase.authStore.loadFromCookie(document.cookie)
  
  // If we have a valid auth session, try to refresh it immediately
  if (pocketbase.authStore.isValid) {
    pocketbase.collection(Collections.Users).authRefresh()
      .catch((err) => {
        // Only clear auth store on auth errors
        if (err?.status === 401 || err?.status === 403) {
          pocketbase.authStore.clear()
        }
      })
  }

  // Keep cookie in sync with auth changes
  pocketbase.authStore.onChange(() => {
    if (pocketbase.authStore.isValid) {
      // User is authenticated - set the cookie
      document.cookie = pocketbase.authStore.exportToCookie({
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' // Using 'lax' instead of 'strict' to allow cookies on redirects from external sites (e.g., Stripe to update subscription status after payment)
      })
    } else {
      // User is not authenticated (signed out) - clear the cookie
      document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax'
    }
  })
}
