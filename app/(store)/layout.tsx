import { Vazirmatn, Playfair_Display } from 'next/font/google'
import StoreNavbar from '@/components/store/StoreNavbar'
import type { Metadata } from 'next'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazirmatn',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'Gemify | جواهرات ناب',
    template: '%s | Gemify',
  },
  description: 'زیبایی ماندگار. جواهراتی برای همیشه.',
  openGraph: {
    title: 'Gemify | جواهرات ناب',
    description: 'زیبایی ماندگار. جواهراتی برای همیشه.',
    locale: 'fa',
    type: 'website',
    images: [{ url: '/assets/logo.svg', width: 512, height: 512, alt: 'Gemify' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemify | جواهرات ناب',
    description: 'زیبایی ماندگار. جواهراتی برای همیشه.',
  },
}

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

function StoreJsonLd() {
    const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Gemify',
        url: baseUrl,
        logo: `${baseUrl}/assets/logo.svg`,
      },
      {
        '@type': 'WebSite',
        name: 'Gemify | جواهرات ناب',
        url: baseUrl,
        description: 'زیبایی ماندگار. جواهراتی برای همیشه.',
        publisher: { '@id': `${baseUrl}/#organization` },
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`store-layout min-h-screen ${vazirmatn.className} ${vazirmatn.variable} ${playfair.variable}`}
      style={{
        backgroundColor: 'var(--store-bg, #FAFAFA)',
        color: 'var(--store-text, #0C0C0C)',
      }}
      dir="rtl"
    >
      <StoreJsonLd />
      <StoreNavbar />
      <main className="relative">{children}</main>
    </div>
  )
}
