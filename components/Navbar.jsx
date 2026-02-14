'use client'

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CurrencyExchange from './CurrencyExchange'
import { AppContext } from '@/lib/context/AppContext'
import StorageRate from './StorageRate'

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
    <div className="flex h-full items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push('/company-information')}
          className="rounded-full ring-2 ring-gold-200 transition-all duration-300 hover:ring-gold-400 hover:shadow-[0_0_0_4px_rgba(198,167,94,0.15)] focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover" />
        </button>
        {session?.user?.name && (
          <span className="text-sm font-medium text-charcoal hidden sm:block">
            {session.user.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <StorageRate />
        <button
          type="button"
          onClick={handleBackup}
          className="rounded-[10px] p-2.5 text-charcoal-soft transition-all duration-300 hover:bg-gold-100 hover:text-charcoal"
          title="پشتیبان‌گیری"
        >
          <img src="/assets/backup.svg" alt="" className="h-5 w-5" />
        </button>
        <CurrencyExchange />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded-[10px] p-2.5 text-charcoal-soft transition-all duration-300 hover:bg-gold-100 hover:text-rosegold"
          title="خروج"
        >
          <img src="/assets/logout.svg" alt="" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
