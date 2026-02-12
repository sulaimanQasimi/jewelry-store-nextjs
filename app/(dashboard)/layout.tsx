'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppContext } from '@/lib/context/AppContext'
import Navbar from '@/components/Navbar'
import SideBar from '@/components/SideBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { token } = useContext(AppContext)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken && !token) {
        router.push('/login')
      }
    }
  }, [token, router])

  if (!token && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return null
  }

  return (
    <div className="relative">
      <div className="absolute top-0 z-10 w-full">
        <Navbar />
      </div>

      <div className="flex h-screen relative">
        <div className="absolute top-14 right-0 z-20">
          <SideBar />
        </div>

        <div className="pr-12 absolute top-18 w-full">{children}</div>
      </div>
    </div>
  )
}
