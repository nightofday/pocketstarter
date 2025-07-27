import { createMetadata } from '@/config/seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = createMetadata({
  title: 'PocketStarter: A Pocketbase / Next.js template',
  description: 'A Pocketbase / Next.js template for building your own SaaS product.',
})

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-[1408px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                Your tagline
              </div>
              <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Welcome to <span className="text-primary">Pocket</span><span>Starter</span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground font-medium">
                This is a description of your product. 
                You can customize this text to describe your product and its features.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
                <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto">
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 px-8 text-lg font-semibold rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto">
                  <Link href="/pricing">
                    View Pricing <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Column - Screenshot */}
            <div className="relative">
              {/* Screenshot Image with shadow and border */}
              <div className="relative overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <Image
                    src="/screenshot-placeholder.png"
                    alt="Dashboard Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-semibold mb-4">
              Your tagline
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Your product features
            </h2>
            <p className="mt-4 text-xl text-muted-foreground font-medium">
              Your product features description.
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="mt-6 text-2xl font-bold">Feature 1</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  This is a description of your product feature.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <CardTitle className="mt-6 text-2xl font-bold">Feature 2</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  This is a description of your product feature.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="mt-6 text-2xl font-bold">Feature 3</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  This is a description of your product feature.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
