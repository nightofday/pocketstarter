'use client'

import { create } from 'zustand'
import { pocketbase } from '@/lib/pocketbase'
import { UsersResponse } from '@/types/pocketbase-types'
import { SubscriptionStatus, checkSubscription } from '@/lib/stripe'

interface AuthState {
  user: UsersResponse | null
  loading: boolean
  subscriptionStatus: SubscriptionStatus
  signOut: () => Promise<void>
}

// Create the store with the same API as our current AuthContext
export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  subscriptionStatus: 'none',
  signOut: async () => {
    pocketbase.authStore.clear()
    set({ user: null, subscriptionStatus: 'none' })
    window.location.href = '/auth/login'
  }
}))

// Initialize auth state and subscriptions on the client side
if (typeof window !== 'undefined') {
  // Set initial state from PocketBase
  useAuth.setState({ 
    user: pocketbase.authStore.record as UsersResponse | null,
    loading: false,
    subscriptionStatus: 'none'
  })

  // Subscribe to PocketBase auth changes
  pocketbase.authStore.onChange(async (_, record) => {
    const user = record ? (record as UsersResponse) : null
    const status = user ? await checkSubscription() : 'none'
    
    useAuth.setState({ 
      user,
      loading: false,
      subscriptionStatus: status
    })
  })
} 