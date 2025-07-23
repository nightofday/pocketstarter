import { PUBLIC_ROUTES, SITEMAP_EXCLUSIONS } from './src/routes.js'

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: SITEMAP_EXCLUSIONS,
  outDir: 'public',
  additionalPaths: async (config) => {
    return PUBLIC_ROUTES.map(route => ({
      loc: route,
      changefreq: 'daily',
      priority: route === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    }))
  },
}

export default config 