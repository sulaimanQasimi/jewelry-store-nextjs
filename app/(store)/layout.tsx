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
    <div className={`store-layout min-h-screen text-[#2D2D2D] ${vazirmatn.className}`} style={{ backgroundColor: '#FDFBF7' }} dir="rtl">
      <StoreNavbar />
      <main className="relative">{children}</main>
    </div>
  )
}
