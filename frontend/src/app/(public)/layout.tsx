import PublicFooter from '@/components/layout/PublicFooter'
import PublicNavigation from '@/components/layout/PublicNavigation'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavigation />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
} 