import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collection | Maison Jewelry',
  description: 'Explore our collection of fine jewelry. Rings, necklaces, bracelets and more.',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
