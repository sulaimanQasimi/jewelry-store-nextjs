'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'

const CHARCOAL = '#1a1a1a'
const PEARL = '#f5f5f0'
const GOLD = '#D4AF37'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
}

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard')
  }, [status, router])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

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
        router.push('/dashboard')
        return
      }
      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'اطلاعات ورود نادرست است' : result.error)
      } else {
        toast.error('اطلاعات ورود نادرست است')
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'خطا در اتصال به سرور')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen w-full flex" dir="rtl">
      {/* Left: Full-bleed image / diamond-silk visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] via-[#1a1a1a] to-[#0d0d0d]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 30% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        {/* Soft diamond/silk texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />
        <div className="relative z-10 flex items-center justify-center w-full p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <Sparkles className="w-16 h-16 text-[#D4AF37]/80" />
            </div>
            <p
              className="text-white/60 text-lg font-medium"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              تجربه ورود لوکس
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-[#f5f5f0] relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md mx-4 sm:mx-6"
        >
          {/* Glassmorphism card with shimmer border */}
          <div
            className="relative rounded-3xl p-8 sm:p-10 md:p-12 overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
              border: '1px solid rgba(212, 175, 55, 0.25)'
            }}
          >
            {/* Sparkle follow cursor - subtle (fixed to viewport) */}
            <motion.div
              className="fixed w-4 h-4 pointer-events-none hidden lg:block z-50"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                x: '-50%',
                y: '-50%'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>

            {/* Logo */}
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 border border-[#D4AF37]/30 shadow-lg">
                <Image
                  src="/assets/gemify.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Welcome heading - Serif */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2 tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                خوش آمدید
              </h1>
              <p className="text-[#666] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                ورود به پنل مدیریت
              </p>
            </motion.div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-right text-[#1a1a1a] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ایمیل یا نام کاربری <span className="text-red-500" aria-hidden>*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <Mail className="w-5 h-5 text-[#D4AF37]/70" />
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-11 pl-4 py-3.5 rounded-xl border-2 border-[#e5e5e0] bg-white/80 text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    placeholder="ایمیل یا نام کاربری"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-right text-[#1a1a1a] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  رمز عبور <span className="text-red-500" aria-hidden>*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <Lock className="w-5 h-5 text-[#D4AF37]/70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-11 pl-12 py-3.5 rounded-xl border-2 border-[#e5e5e0] bg-white/80 text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    placeholder="رمز عبور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#666] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                    aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative pt-2">
                {/* Sparkle above button */}
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </motion.div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white border-2 border-[#D4AF37] bg-[#D4AF37] hover:bg-[#c4a030] hover:border-[#c4a030] hover:shadow-lg hover:shadow-[#D4AF37]/25 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#e5e5e0]" />
              <span className="text-xs text-[#999]" style={{ fontFamily: "'Inter', sans-serif" }}>
                یا ادامه با
              </span>
              <div className="flex-1 h-px bg-[#e5e5e0]" />
            </motion.div>

            {/* Social login */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-[#e5e5e0] bg-white/60 hover:border-[#D4AF37]/40 hover:bg-white/80 transition-all duration-300 text-[#1a1a1a] font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-[#e5e5e0] bg-white/60 hover:border-[#D4AF37]/40 hover:bg-white/80 transition-all duration-300 text-[#1a1a1a] font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-[#D4AF37]/20 text-center">
              <p className="text-[#666] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                حساب کاربری ندارید؟{' '}
                <Link
                  href="/signup"
                  className="text-[#D4AF37] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 rounded"
                >
                  ثبت‌نام
                </Link>
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-4 text-center">
              <p className="text-[#666] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                © تمام حقوق متعلق به شرکت گلگسی تکنالوچی
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
