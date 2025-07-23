'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { User, CreditCard, Settings } from 'lucide-react'

const navigationItems = [
  {
    href: '/account',
    label: 'Profile',
    icon: User
  },
  {
    href: '/account/billing',
    label: 'Billing',
    icon: CreditCard
  },
  {
    href: '/account/settings',
    label: 'Settings',
    icon: Settings
  }
] as const

interface NavItemProps {
  item: (typeof navigationItems)[number]
  isActive: boolean
  variant: 'mobile' | 'desktop'
}

function NavItem({ item, isActive, variant }: NavItemProps) {
  const Icon = item.icon
  
  if (variant === 'mobile') {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{item.label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      <span>{item.label}</span>
    </Link>
  )
}

export default function AccountSidebar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-24">
      {/* Mobile Navigation */}
      <div className="lg:hidden mb-6">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              variant="mobile"
            />
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block space-y-1">
        {navigationItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            variant="desktop"
          />
        ))}
      </nav>
    </div>
  )
} 