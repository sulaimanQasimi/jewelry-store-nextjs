'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/sale-product', icon: '/assets/jewelery.png', label: 'فروش جنس' },
  { href: '/product-from-supplier', icon: '/assets/buy.png', label: 'خرید جنس از تمویل کننده' },
  { href: '/add-fragment', icon: '/assets/broken.png', label: 'خرید شکسته' },
  { href: '/ware-house', icon: '/assets/warehouse.png', label: 'انبار' },
  { href: '/expenses', icon: '/assets/money.png', label: 'مصارف' },
  { href: '/loan-management', icon: '/assets/loan.png', label: 'بلانس مشتریان' },
  { href: '/register-product', icon: '/assets/fragment.png', label: 'ثبت اجناس شکسته' },
  { href: '/register-supplier-product', icon: '/assets/new-product.png', label: 'ثبت اجناس' },
  { href: '/suppliers', icon: '/assets/buy.png', label: 'لیست تمویل کنندگان' },
  { href: '/customer-registration', icon: '/assets/client1.png', label: 'ثبت مشتریان' },
  { href: '/new-trade', icon: '/assets/trader.png', label: 'معامله داران' },
  { href: '/daily-report', icon: '/assets/daily.png', label: 'گزارش یومیه' },
  { href: '/report', icon: '/assets/report_card.svg', label: 'گزارشات' },
  { href: '/company-information', icon: '/assets/info.svg', label: 'درباره ما' },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {items.map(({ href, icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out ${
              isActive
                ? 'bg-gold-100 text-charcoal border border-gold-300/60 shadow-[0_2px_8px_-2px_rgba(198,167,94,0.2)] nav-active-gold'
                : 'text-charcoal-soft hover:bg-champagne/80 hover:border-gold-200 border border-transparent'
            }`}
          >
            <img src={icon} alt="" className="h-5 w-5 shrink-0 object-contain opacity-90" />
            <span className="truncate">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default SideBar
