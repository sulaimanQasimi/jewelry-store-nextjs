'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Gem } from 'lucide-react'
import Button from './Button'

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
    <nav className="store-nav sticky top-0 z-50 w-full bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors"
            aria-label="خانه"
          >
            <Gem className="w-8 h-8 text-[#D4AF37]" aria-hidden />
            <span className="font-serif text-xl font-semibold tracking-tight">مایسون</span>
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
                    : 'text-[#2C2C2C] hover:text-[#D4AF37]'
                }
                `}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login">
              <Button variant="outline" size="sm">
                ورود / ثبت‌نام
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                ورود / ثبت‌نام
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-sm text-[#2C2C2C] hover:bg-cream-200 transition-colors"
              aria-label="منو"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-cream-200">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block py-2 px-3 rounded-sm font-medium text-sm
                      ${pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                        ? 'text-[#D4AF37] bg-cream-200'
                        : 'text-[#2C2C2C] hover:bg-cream-200'
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
