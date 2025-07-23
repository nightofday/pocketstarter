'use client'

import { LogOut, Menu, X, User, Settings, Palette, ChevronDown, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/stores/auth'
import { useTheme } from '@/contexts/ThemeContext'


export default function CoreNavigation() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const AccountDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary" 
          className="text-sm hidden md:flex cursor-pointer"
          aria-label="Account menu"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          Account
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mr-4">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer group">
            <Settings className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground group-focus:text-accent-foreground transition-colors" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer group">
          <Palette className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground group-focus:text-accent-foreground transition-colors" />
          Color mode <span className="text-xs text-muted-foreground group-hover:text-accent-foreground group-focus:text-accent-foreground capitalize transition-colors">({theme})</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer group">
          <LogOut className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground group-focus:text-accent-foreground transition-colors" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2"
              aria-label="Go to dashboard home page"
            >
              <Image 
                src={theme === 'dark' ? '/logo-light.svg' : '/logo.svg'} 
                alt="PocketStarter logo" 
                width={150}
                height={32}
                className="h-8" 
              />
            </Link>
          </div>
          
          <nav 
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go to dashboard"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4" role="toolbar" aria-label="User actions">
            <AccountDropdown />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav 
            id="mobile-navigation"
            className="md:hidden border-t bg-background"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-3 space-y-1">
              <div className="px-3 py-3 border-b border-border mb-2">
                <p className="text-sm font-medium leading-none">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
              <Link 
                href="/dashboard" 
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-md transition-colors cursor-pointer group"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Go to dashboard"
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" aria-hidden="true" />
                Dashboard
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-md transition-colors cursor-pointer group"
              >
                <Settings className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" aria-hidden="true" />
                Settings
              </Link>
              <button
                onClick={() => {
                  toggleTheme()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-md transition-colors cursor-pointer group"
              >
                <Palette className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" aria-hidden="true" />
                Color mode <span className="text-xs text-muted-foreground group-hover:text-accent-foreground capitalize transition-colors">({theme})</span>
              </button>
              <button
                onClick={() => {
                  signOut()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-md transition-colors cursor-pointer group"
              >
                <LogOut className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" aria-hidden="true" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
} 