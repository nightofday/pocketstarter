/**
 * Route constants for authentication and sitemap configuration
 */

/* Routes that don't need authentication */
export const PUBLIC_ROUTES = [
  '/auth',
  '/pricing',
  '/contact',
]

/* Routes that need authentication */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/*',
  '/account',
  '/account/*',
]

/* Routes to exclude from sitemap */
export const SITEMAP_EXCLUSIONS = [
  ...PROTECTED_ROUTES,
  '/api/*',
  '/auth/callback',
]