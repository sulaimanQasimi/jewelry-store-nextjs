import { Vazirmatn } from 'next/font/google'
import StoreNavbar from '@/components/store/StoreNavbar'
import type { Metadata } from 'next'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazirmatn',
})

export const metadata: Metadata = {
  title: {
    default: 'مایسون | جواهرات ناب',
    template: '%s | مایسون',
  },
  description: 'زیبایی ماندگار. جواهراتی برای همیشه.',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`store-layout min-h-screen bg-cream-50 text-[#2C2C2C] ${vazirmatn.className}`} dir="rtl">
      <StoreNavbar />
      <main className="relative">{children}</main>
    </div>
  )
}
