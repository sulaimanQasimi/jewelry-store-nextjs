'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Gem,
  ShoppingBag,
  Puzzle,
  Warehouse,
  Receipt,
  CreditCard,
  Hammer,
  PackagePlus,
  Users,
  UserPlus,
  Handshake,
  CalendarCheck,
  BarChart3,
  Info,
  ChevronLeft
} from 'lucide-react'

const items = [
  { href: '/sale-product', icon: Gem, label: 'فروش جنس', color: 'from-pink-500 to-rose-500' },
  { href: '/product-from-supplier', icon: ShoppingBag, label: 'خرید جنس از تمویل کننده', color: 'from-sky-500 to-blue-600' },
  { href: '/add-fragment', icon: Puzzle, label: 'خرید شکسته', color: 'from-amber-400 to-orange-500' },
  { href: '/ware-house', icon: Warehouse, label: 'انبار', color: 'from-emerald-400 to-green-600' },
  { href: '/expenses', icon: Receipt, label: 'مصارف', color: 'from-red-400 to-red-600' },
  { href: '/loan-management', icon: CreditCard, label: 'بلانس مشتریان', color: 'from-violet-500 to-purple-600' },
  { href: '/register-product', icon: Hammer, label: 'ثبت اجناس شکسته', color: 'from-indigo-400 to-indigo-600' },
  { href: '/register-supplier-product', icon: PackagePlus, label: 'ثبت اجناس', color: 'from-teal-400 to-teal-600' },
  { href: '/suppliers', icon: Users, label: 'لیست تمویل کنندگان', color: 'from-cyan-400 to-cyan-600' },
  { href: '/customer-registration', icon: UserPlus, label: 'ثبت مشتریان', color: 'from-fuchsia-400 to-pink-600' },
  { href: '/new-trade', icon: Handshake, label: 'معامله داران', color: 'from-lime-400 to-green-600' },
  { href: '/daily-report', icon: CalendarCheck, label: 'گزارش یومیه', color: 'from-orange-400 to-amber-600' },
  { href: '/report', icon: BarChart3, label: 'گزارشات', color: 'from-blue-400 to-indigo-600' },
  { href: '/company-information', icon: Info, label: 'درباره ما', color: 'from-gray-400 to-gray-600' },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent pb-2 border-b border-gold-200/30">
          منوی اصلی
        </h2>
      </div>

      {items.map(({ href, icon: Icon, label, color }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={`
              relative group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-500 ease-out overflow-hidden
              ${isActive
                ? 'bg-gradient-to-r from-white/80 to-white/40 shadow-lg text-gold-800'
                : 'hover:bg-white/30 text-slate-600 hover:text-slate-900 hover:shadow-md'
              }
            `}
          >
            {/* Active Indicator & Hover Glow */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10`} />
            )}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color} transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

            {/* Icon Container with Glow */}
            <div className={`
              relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm transition-all duration-500
              ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-6 bg-white/60'}
            `}>
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${color} opacity-20 blur-sm group-hover:opacity-40 transition-opacity`} />
              <Icon className="h-5 w-5 z-10" />
            </div>

            <span className="truncate z-10">{label}</span>

            {/* Arrow on active/hover */}
            <div className={`mr-auto transition-transform duration-300 ${isActive ? 'translate-x-0 text-gold-600' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

export default SideBar
