'use client'

import { SessionProvider } from 'next-auth/react'
import AppContextProvider from '@/lib/context/AppContext'
import { SupplierProductProvider } from '@/context/SupplierProduct'
import { ThemeProvider } from '@/lib/context/ThemeContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AppContextProvider>
          <SupplierProductProvider>
            {children}
            <ToastContainer />
          </SupplierProductProvider>
        </AppContextProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
