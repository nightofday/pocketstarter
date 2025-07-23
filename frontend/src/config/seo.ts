import type { Metadata, Viewport } from 'next'

// Site configuration - single source of truth
export const siteConfig = {
  name: 'PocketStarter',
  description: 'A comprehensive SaaS template and scaffolding kit built with Pocketbase',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pocketstarter.dev',
}

// Global viewport configuration
export const globalViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
}

// Global metadata that applies to all pages
export const globalMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} - ${siteConfig.description}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
}

/**
 * Creates consistent metadata for pages with full SEO support
 * 
 * @param title - Page title (required)
 * @param description - Meta description for public pages (optional, ignored for private pages)
 * @param image - Open Graph image (optional, defaults to site default)
 * @param noIndex - Set to true for no-index pages
 * @returns Metadata object optimized for the page type
 * 
 * @example
 * // Public page
 * export const metadata = createMetadata({
 *   title: 'About Us',
 *   description: 'Learn more about our company...'
 * })
 */
export function createMetadata({
  title,
  description,
  image = '/og-image.jpg',
  noIndex = false,
}: {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const baseMetadata: Metadata = {
    title,
    ...(noIndex && { robots: { index: false, follow: false } }),
  }

  // Only add description and social tags for public pages
  if (!noIndex && description) {
    return {
      ...baseMetadata,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        url: siteConfig.url, // This will be overridden by Next.js with the actual page URL
        siteName: siteConfig.name,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  }

  return baseMetadata
} 