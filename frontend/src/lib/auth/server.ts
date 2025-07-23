import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'
import { TypedPocketBase, UsersResponse } from '@/types/pocketbase-types'

// Initialize an authenticated PocketBase instance for server-side requests
export async function initServerAuth() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL) as TypedPocketBase
  
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('pb_auth')
    
    if (authCookie?.value) {
      pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
    }
  } catch (err) {
    console.error('Auth initialization error:', err)
  }
  
  return pb
}

// Require authentication for server-side operations
export async function requireAuth(): Promise<UsersResponse> {
  const pb = await initServerAuth()
  
  if (!pb.authStore.isValid) {
    throw new Error('Authentication required')
  }
  
  return pb.authStore.record as UsersResponse
}