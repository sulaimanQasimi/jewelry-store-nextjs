'use client'

import Navbar from '@/components/Navbar'
import SideBar from '@/components/SideBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col relative overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-100">
      {/* Background Blobs for "Awesome" Effect */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      <header className="h-20 shrink-0 sticky top-0 z-30 transition-all duration-300">
        <Navbar />
      </header>
      
      <div className="flex flex-1 min-h-0 relative z-20">
        <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8 order-2 w-full">
          <div className="max-w-[1600px] mx-auto animate-float" style={{ animationDuration: '4s' }}>
            {children}
          </div>
        </main>
        
        <aside className="order-1 w-64 lg:w-72 shrink-0 m-4 ml-0 rounded-2xl glass-panel border-r-0 border border-white/40 hidden md:block">
          <SideBar />
        </aside>
      </div>
    </div>
  )
}
