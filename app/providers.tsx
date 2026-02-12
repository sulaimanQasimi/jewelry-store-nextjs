'use client'

import AppContextProvider from '@/lib/context/AppContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      {children}
      <ToastContainer />
    </AppContextProvider>
  )
}
