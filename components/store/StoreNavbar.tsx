'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Gem } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره‌ما' },
  { href: '/contact', label: 'تماس' },
  { href: '/shop', label: 'مجموعه' },
]

const SCROLL_THRESHOLD = 24

export default function StoreNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`
          store-nav sticky top-0 z-50 w-full
          transition-all duration-500 ease-out
          ${scrolled
            ? 'bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#D4AF37]/30 shadow-[0_1px_0_0_rgba(212,175,55,0.15)]'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#2D2D2D] hover:text-[#D4AF37] transition-colors duration-200"
              aria-label="خانه"
            >
              <Gem className="w-8 h-8 text-[#D4AF37]" aria-hidden />
              <span className="text-xl font-semibold tracking-tight font-[var(--font-playfair)]">مایسون</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    font-medium text-sm tracking-wide transition-colors duration-200
                    ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                      ? 'text-[#D4AF37]'
                      : 'text-[#2D2D2D] hover:text-[#D4AF37]'
                  }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login">
                <span className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-sm border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10 transition-all duration-200">
                  ورود / ثبت‌نام
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link href="/login">
                <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-sm border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10 transition-all duration-200">
                  ورود / ثبت‌نام
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-sm text-[#2D2D2D] hover:bg-[#F0EDE8]/60 transition-colors"
                aria-label="منو"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium slide-out mobile menu (full overlay, RTL from right) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-[#2C2C2C]/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 end-0 bottom-0 z-[70] w-full max-w-sm bg-[#FDFBF7] shadow-2xl md:hidden flex flex-col border-s border-[#D4AF37]/20"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E0D9]/80">
                <span className="font-[var(--font-playfair)] text-lg font-semibold text-[#2C2C2C]">مایسون</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-sm text-[#2D2D2D] hover:bg-[#F0EDE8]/60 transition-colors"
                  aria-label="بستن منو"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-8 px-6">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          block py-4 px-3 text-base font-medium transition-colors border-b border-[#F0EDE8]/60
                          ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                            ? 'text-[#D4AF37]'
                            : 'text-[#2D2D2D] hover:text-[#D4AF37]'
                          }
                        `}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-[#E5E0D9]">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3.5 rounded-sm border border-[#D4AF37] text-[#D4AF37] font-medium hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    ورود / ثبت‌نام
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
