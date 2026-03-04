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
                © تمام حقوق متعلق به{' '}
                <a
                  href="https://galaxy-technology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 rounded"
                >
                  شرکت گلکسی تکنولوژی
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
