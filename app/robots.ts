import type { MetadataRoute } from 'next'

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/shop', '/shop/*', '/about', '/contact'],
        disallow: ['/dashboard', '/dashboard/*', '/login', '/api', '/demo-navbar', '/demo-premium-navbar', '/sale-product'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
