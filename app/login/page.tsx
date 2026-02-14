'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') router.push('/company-information')
  }, [status, router])

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false
      })
      if (result?.ok) {
        toast.success('ورود موفقیت‌آمیز بود')
        router.push('/company-information')
        return
      }
      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'اطلاعات ورود نادرست است' : result.error)
      } else {
        toast.error('اطلاعات ورود نادرست است')
      }
    } catch (error: any) {
      toast.error(error?.message || 'خطا در اتصال به سرور')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-cream">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-champagne-light to-gold-50"></div>
      {/* Subtle gold shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-200/10 to-transparent animate-pulse"></div>
      {/* Decorative soft orbs */}
      <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-br from-gold-200/15 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-gradient-to-tr from-gold-300/10 to-transparent rounded-full blur-3xl"></div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(28,28,28,0.08),0_12px_32px_-8px_rgba(198,167,94,0.12)] border border-gold-200/50 p-8 md:p-10 card-luxury">
          {/* Logo/Brand section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_8px_24px_-4px_rgba(198,167,94,0.4)]">
              <Image
                src="/assets/gemify.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h1 className="font-heading text-3xl font-bold text-charcoal mb-2 tracking-wide">
              سیستم مدیریت زرگری
            </h1>
            <p className="text-charcoal-soft/80 text-sm">ورود به پنل مدیریت</p>
          </div>

          {/* Login form */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-right text-charcoal text-sm font-medium">
                ایمیل یا نام کاربری
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury w-full pr-10 pl-4 py-3 text-charcoal placeholder-gold-300/70"
                  placeholder="ایمیل یا نام کاربری خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-right text-charcoal text-sm font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxury w-full pr-10 pl-4 py-3 text-charcoal placeholder-gold-300/70"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-luxury btn-luxury-primary w-full py-3 px-4 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          <div className="mt-8 pt-6 border-t border-gold-200/50">
            <p className="text-center text-charcoal-soft/70 text-xs">
              <span className="text-gold-500">©</span>{' '}
              تمام حقوق متعلق به شرکت گلگسی تکنالوچی می‌باشد
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-20 left-20 w-16 h-16 opacity-15">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-gold-500">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-12 h-12 opacity-15">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-gold-500">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
    </div>
  )
}
