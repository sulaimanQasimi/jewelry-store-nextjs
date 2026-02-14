'use client'

import Navbar from '@/components/Navbar'
import SideBar from '@/components/SideBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col bg-cream">
      <header className="h-16 shrink-0 border-b border-gold-200/60 bg-champagne-light/95 backdrop-blur-sm shadow-[0_2px_20px_-4px_rgba(28,28,28,0.06)] sticky top-0 z-30 transition-all duration-300">
        <Navbar />
      </header>
      <div className="flex flex-1 min-h-0">
        <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8 order-2 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
        <aside className="order-1 w-60 lg:w-64 shrink-0 border-l border-gold-200/50 bg-white shadow-[0_0_24px_-4px_rgba(198,167,94,0.08)]">
          <SideBar />
        </aside>
      </div>
    </div>
  )
}
