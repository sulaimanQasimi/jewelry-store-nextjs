import StoreNavbar from '@/components/store/StoreNavbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Maison | Fine Jewelry',
    template: '%s | Maison',
  },
  description: 'Timeless elegance. Fine jewelry crafted for forever.',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="store-layout min-h-screen bg-cream-50 text-[#2C2C2C]" dir="ltr">
      <StoreNavbar />
      <main className="relative">{children}</main>
    </div>
  )
}
