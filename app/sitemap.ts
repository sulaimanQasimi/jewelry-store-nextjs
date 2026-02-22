import type { MetadataRoute } from 'next'
import { query } from '@/lib/db'

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const rows = (await query(
      'SELECT id, updatedAt FROM products WHERE isSold = 0 ORDER BY id',
      []
    )) as { id: number; updatedAt: Date | string }[]
    productEntries = (rows ?? []).map((row) => ({
      url: `${baseUrl}/shop/${row.id}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // If DB fails (e.g. build without DB), sitemap still returns static entries
  }

  return [...staticEntries, ...productEntries]
}
