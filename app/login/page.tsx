'use client'

import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const { token, setToken } = useContext(AppContext)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Support both email and username login
      const loginData = {
        email: email,
        username: email, // Also send as username in case user enters username
        password: password
      }

      const { data } = await axios.post('/api/admin/login', loginData)
      if (data.success) {
        console.log(data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        setToken(data.token)
        toast.success('ورود موفقیت‌آمیز بود')
        setTimeout(() => {
          router.push('/company-information')
        }, 500)
      } else {
        toast.error(data.message || 'اطلاعات ورود نادرست است')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'خطا در اتصال به سرور')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      router.push('/company-information')
    }
  }, [token, router])

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Animated gold shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-500/20 p-8 md:p-10">
          {/* Logo/Brand section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50">
              <Image
                src="/assets/gemify.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-2">
              سیستم مدیریت زرگری
            </h1>
            <p className="text-slate-400 text-sm">ورود به پنل مدیریت</p>
          </div>

          {/* Login form */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Email/Username input */}
            <div className="space-y-2">
              <label className="block text-right text-slate-300 text-sm font-medium">
                ایمیل یا نام کاربری
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300"
                  placeholder="ایمیل یا نام کاربری خود را وارد کنید"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label className="block text-right text-slate-300 text-sm font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>در حال ورود...</span>
                </>
              ) : (
                <>
                  <span>ورود</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-center text-slate-500 text-xs">
              <span className="text-yellow-500">©</span>{' '}
              تمام حقوق متعلق به شرکت گلگسی تکنالوچی می‌باشد
            </p>
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="mt-6 flex justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Floating jewelry icons decoration */}
      <div className="absolute top-20 left-20 w-16 h-16 opacity-20 animate-bounce delay-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-12 h-12 opacity-20 animate-bounce delay-700">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
    </div>
  )
}
