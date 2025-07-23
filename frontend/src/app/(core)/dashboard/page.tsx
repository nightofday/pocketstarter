import { createMetadata } from '@/config/seo'
import { Card, CardContent } from '@/components/ui/card'

import UserDashboardContent from './content'

export const metadata = createMetadata({
  title: 'Dashboard'
})

export default async function Dashboard() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8" role="main">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <section className="mb-12 text-center" aria-labelledby="welcome-heading">
          <h1 id="welcome-heading" className="text-3xl font-bold">
            Welcome to <span className="text-primary">PocketStarter</span>
          </h1>
        </section>

        {/* Main Content Area */}
        <Card 
          className="border-1 border-border bg-background mb-8"
          role="region"
          aria-labelledby="main-content-title"
        >
          <CardContent className="text-center py-12">
            <UserDashboardContent />
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 