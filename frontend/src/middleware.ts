import { NextRequest, NextResponse } from 'next/server'
import { PROTECTED_ROUTES } from './routes.js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected using glob-style patterns
  const isProtectedRoute = PROTECTED_ROUTES.some(route => {
    if (route.endsWith('/*')) {
      // For wildcard routes, check if the pathname starts with the base path
      const basePath = route.slice(0, -2) // Remove '/*'
      return pathname === basePath || pathname.startsWith(basePath + '/')
    }
    // For exact routes, check for exact match
    return pathname === route
  })
  
  // Get auth token from cookie for fast path check
  const authToken = request.cookies.get('pb_auth')?.value
  const hasAuthToken = Boolean(authToken)
  
  // Fast-fail for protected routes without token
  if (isProtectedRoute && !hasAuthToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect authenticated users from auth pages (except logout)
  // Note: This is a lightweight check, full verification happens in the page
  if (hasAuthToken && pathname.startsWith('/auth/') && !pathname.includes('/logout')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  // Get PocketBase URL from environment variable
  const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
  const pocketbaseWsUrl = pocketbaseUrl.replace('http://', 'ws://').replace('https://', 'wss://')

  // Generate nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Create CSP directives
  const cspDirectives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", 'https://js.stripe.com', 'https://checkout.stripe.com', 'https://*.googletagmanager.com'],
    // For style-src, allow unsafe-inline for now as popular libraries like next/image and shadcn components require inline styles
    // For better security, consider avoiding those components and set style-src to "'self'", `'nonce-${nonce}'"
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'blob:', 'data:', 'https:', 'https://*.stripe.com', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
    'font-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'frame-src': ['https://js.stripe.com', 'https://hooks.stripe.com', 'https://checkout.stripe.com'],
    'connect-src': ["'self'", pocketbaseUrl, pocketbaseWsUrl, 'https://api.stripe.com', 'https://checkout.stripe.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com']
  }

  // Add upgrade-insecure-requests in production
  if (!isDevelopment) {
    cspDirectives['upgrade-insecure-requests'] = []
  }

  // Convert directives object to CSP string
  const cspHeader = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')

  // Set request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), usb=()')
  
  // Only apply HSTS in production
  if (!isDevelopment) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
} 