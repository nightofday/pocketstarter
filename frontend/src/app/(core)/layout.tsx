import CoreNavigation from '@/components/layout/CoreNavigation'

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <CoreNavigation />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
} 