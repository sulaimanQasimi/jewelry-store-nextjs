'use client'

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CurrencyExchange from './CurrencyExchange'
import { AppContext } from '@/lib/context/AppContext'
import StorageRate from './StorageRate'
import ThemeToggle from './ThemeToggle'
import { DatabaseBackup, LogOut } from 'lucide-react'

const Navbar = () => {
  const { companyData } = useContext(AppContext)
  const { data: session } = useSession()
  const router = useRouter()

  const handleBackup = async () => {
    try {
      const { data } = await axios.post('/api/backup/backup')
      if (data.success) toast.success(data.message)
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const logo = Array.isArray(companyData) && companyData[0]?.image ? `/${companyData[0].image}` : '/assets/logo.svg'

  return (
    <div className="mx-4 mt-2 mb-2 flex h-16 items-center justify-between rounded-xl px-6 backdrop-blur-md bg-white/70 dark:bg-slate-800/80 shadow-sm border border-white/50 dark:border-slate-600/50 transition-all hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-800">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push('/company-information')}
          className="group relative rounded-full p-1 transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 blur opacity-40 group-hover:opacity-70 transition-opacity" />
          <img
            src={logo}
            alt="Logo"
            className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        </button>

        {session?.user?.name && (
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-gold-600 font-semibold mb-[-2px]">خوش آمدید،</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {session.user.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block">
          <StorageRate />
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block"></div>

        <ThemeToggle />

        <button
          type="button"
          onClick={handleBackup}
          className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600 border border-slate-100/50 hover:border-blue-200"
          title="پشتیبان‌گیری"
        >
          <DatabaseBackup className="h-5 w-5 transition-transform group-hover:rotate-12" />
        </button>

        <div className="hidden md:block">
          <CurrencyExchange />
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="group flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 border border-red-50 hover:border-red-400"
          title="خروج"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="hidden md:inline">خروج</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
