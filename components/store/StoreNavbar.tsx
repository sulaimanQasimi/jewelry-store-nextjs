'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Gem } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره‌ما' },
  { href: '/contact', label: 'تماس' },
  { href: '/shop', label: 'مجموعه' },
]

export default function StoreNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="store-nav sticky top-0 z-50 w-full bg-[#FDFBF7]/70 backdrop-blur-xl border-b border-[#F0EDE8]/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#2D2D2D] hover:text-[#D4AF37] transition-colors duration-200"
            aria-label="خانه"
          >
            <Gem className="w-8 h-8 text-[#D4AF37]" aria-hidden />
            <span className="text-xl font-semibold tracking-tight">مایسون</span>
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
              <span
                className="
                  inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium
                  rounded-sm border border-[#D4AF37] text-[#D4AF37]
                  bg-transparent hover:bg-[#D4AF37]/10 transition-all duration-200
                "
              >
                ورود / ثبت‌نام
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login">
              <span
                className="
                  inline-flex items-center justify-center px-4 py-2 text-sm font-medium
                  rounded-sm border border-[#D4AF37] text-[#D4AF37]
                  bg-transparent hover:bg-[#D4AF37]/10 transition-all duration-200
                "
              >
                ورود / ثبت‌نام
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-sm text-[#2D2D2D] hover:bg-[#F0EDE8]/60 transition-colors"
              aria-label="منو"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[#F0EDE8]">
            <ul className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block py-2.5 px-3 rounded-sm font-medium text-sm transition-colors
                      ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                        ? 'text-[#D4AF37] bg-[#D4AF37]/5'
                        : 'text-[#2D2D2D] hover:bg-[#F0EDE8]/60'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
