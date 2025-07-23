'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'

/**
 * Providers wrapper component that includes:
 * 1. ThemeProvider - Dark/light mode
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
} 