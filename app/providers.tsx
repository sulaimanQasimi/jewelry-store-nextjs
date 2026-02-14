'use client'

import { SessionProvider } from 'next-auth/react'
import AppContextProvider from '@/lib/context/AppContext'
import { SupplierProductProvider } from '@/context/SupplierProduct'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        <SupplierProductProvider>
          {children}
          <ToastContainer />
        </SupplierProductProvider>
      </AppContextProvider>
    </SessionProvider>
  )
}
