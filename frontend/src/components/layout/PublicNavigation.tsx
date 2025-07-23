'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/contexts/ThemeContext'


interface PublicNavigationProps {
  isAuthPage?: boolean
}

export default function PublicNavigation({ isAuthPage = false }: PublicNavigationProps) {
  const { theme } = useTheme()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1408px]">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src={theme === 'dark' ? '/logo-light.svg' : '/logo.svg'} 
                alt="PocketStarter" 
                width={150}
                height={32}
                className="h-8"
                priority
              />
            </Link>
          </div>
          
          {!isAuthPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="secondary" asChild>
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 