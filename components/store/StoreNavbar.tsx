'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره‌ما' },
  { href: '/contact', label: 'تماس' },
  { href: '/shop', label: 'مجموعه' },
]

const SCROLL_THRESHOLD = 20

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

  const isLightHero = pathname === '/'
  const navDark = scrolled || !isLightHero

  return (
    <>
      <nav
        className={`
          store-nav fixed top-0 start-0 end-0 z-50 w-full
          transition-all duration-400 ease-out
          ${navDark
            ? 'bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className={`
                flex items-center gap-2 transition-colors duration-200
                ${navDark ? 'text-white hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}
              `}
              aria-label="خانه"
            >
              <span
                className="text-xl md:text-2xl font-bold tracking-tight font-[var(--font-playfair)]"
              >
                Gemify
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm font-medium tracking-widest uppercase transition-colors duration-200
                    ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                      ? 'text-[#D4AF37]'
                      : navDark ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold tracking-widest uppercase border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0C0C0C] transition-all duration-300"
              >
                ورود
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase border border-white text-white bg-transparent"
              >
                ورود
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label="منو"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-[#0C0C0C]/90 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 end-0 bottom-0 z-[70] w-full max-w-[320px] bg-[#0C0C0C] border-s border-white/10 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                <span className="font-[var(--font-playfair)] text-lg font-bold text-white">Gemify</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-md text-white hover:bg-white/10 transition-colors"
                  aria-label="بستن منو"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-8 px-6">
                <ul className="flex flex-col gap-0">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          block py-4 text-sm font-medium tracking-widest uppercase border-b border-white/5
                          transition-colors
                          ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                            ? 'text-[#D4AF37]'
                            : 'text-white/90 hover:text-white'
                          }
                        `}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-4 rounded-md border-2 border-white text-white font-semibold text-sm tracking-widest uppercase hover:bg-white hover:text-[#0C0C0C] transition-all"
                  >
                    ورود
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
