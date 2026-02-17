'use client'

import React, { useState } from 'react'
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
  Package,
  Users,
  UserPlus,
  Handshake,
  CalendarCheck,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Layers,
  UserCircle,
  Wallet,
  DollarSign,
  FileText,
  ShoppingCart,
  UserCog
} from 'lucide-react'

const groups = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    icon: LayoutDashboard,
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'خلاصه', color: 'from-gold-500 to-amber-600' }
    ]
  },
  {
    id: 'sales',
    label: 'فروش و خرید',
    icon: Gem,
    items: [
      { href: '/sale-product', icon: Gem, label: 'فروش جنس', color: 'from-pink-500 to-rose-500' },
      { href: '/product-from-supplier', icon: ShoppingBag, label: 'خرید جنس از تمویل کننده', color: 'from-sky-500 to-blue-600' },
      { href: '/purchases', icon: ShoppingCart, label: 'خریدها', color: 'from-sky-600 to-blue-700' },
      { href: '/add-fragment', icon: Puzzle, label: 'خرید شکسته', color: 'from-amber-400 to-orange-500' }
    ]
  },
  {
    id: 'products',
    label: 'محصولات و انبار',
    icon: Package,
    items: [
      { href: '/products', icon: Package, label: 'اجناس', color: 'from-amber-500 to-yellow-600' },
      { href: '/product-masters', icon: Layers, label: 'محصولات اصلی', color: 'from-amber-600 to-orange-600' },
      { href: '/register-product', icon: Hammer, label: 'ثبت اجناس شکسته', color: 'from-indigo-400 to-indigo-600' },
      { href: '/register-supplier-product', icon: PackagePlus, label: 'ثبت اجناس', color: 'from-teal-400 to-teal-600' },
      { href: '/ware-house', icon: Warehouse, label: 'انبار', color: 'from-emerald-400 to-green-600' }
    ]
  },
  {
    id: 'finance',
    label: 'مالی و مصارف',
    icon: Receipt,
    items: [
      { href: '/expenses', icon: Receipt, label: 'مصارف', color: 'from-red-400 to-red-600' },
      { href: '/personal-expenses', icon: Wallet, label: 'مصارف شخصی', color: 'from-red-500 to-rose-600' },
      { href: '/currency-rates', icon: DollarSign, label: 'نرخ ارز', color: 'from-green-500 to-emerald-600' }
    ]
  },
  {
    id: 'customers',
    label: 'مشتریان و وام',
    icon: CreditCard,
    items: [
      { href: '/customer-registration', icon: UserPlus, label: 'ثبت مشتریان', color: 'from-fuchsia-400 to-pink-600' },
      { href: '/loan-management', icon: CreditCard, label: 'بلانس مشتریان', color: 'from-violet-500 to-purple-600' },
      { href: '/loan-reports', icon: FileText, label: 'گزارش قرض', color: 'from-violet-600 to-purple-700' }
    ]
  },
  {
    id: 'parties',
    label: 'اشخاص و طرف‌ها',
    icon: Users,
    items: [
      { href: '/suppliers', icon: Users, label: 'لیست تمویل کنندگان', color: 'from-cyan-400 to-cyan-600' },
      { href: '/persons', icon: UserCircle, label: 'اشخاص', color: 'from-cyan-500 to-teal-600' },
      { href: '/new-trade', icon: Handshake, label: 'معامله داران', color: 'from-lime-400 to-green-600' }
    ]
  },
  {
    id: 'reports',
    label: 'گزارشات',
    icon: BarChart3,
    items: [
      { href: '/daily-report', icon: CalendarCheck, label: 'گزارش یومیه', color: 'from-orange-400 to-amber-600' },
      { href: '/report', icon: BarChart3, label: 'گزارشات', color: 'from-blue-400 to-indigo-600' }
    ]
  },
  {
    id: 'settings',
    label: 'تنظیمات',
    icon: Info,
    items: [
      { href: '/company-information', icon: Info, label: 'درباره ما', color: 'from-gray-400 to-gray-600' },
      { href: '/users', icon: UserCog, label: 'مدیریت کاربران', color: 'from-slate-500 to-slate-600' }
    ]
  }
]

const SideBar = () => {
  const pathname = usePathname()
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set())

  const toggleGroup = (id) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isGroupActive = (items) => items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <nav className="flex flex-col gap-1 p-4 h-full overflow-y-auto custom-scrollbar bg-transparent dark:bg-gray-900 rounded-xl">
      <div className="mb-4 px-2">
        <h2 className="text-lg font-bold bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-300 bg-clip-text text-transparent pb-2 border-b border-gold-200/30 dark:border-gray-700">
          منوی اصلی
        </h2>
      </div>

      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.id)
        const hasActive = isGroupActive(group.items)

        return (
          <div key={group.id} className="mb-2">
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className={`
                w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors
                ${hasActive
                  ? 'text-gold-700 dark:text-gold-400 bg-gold-100/50 dark:bg-gold-900/20'
                  : 'text-charcoal-soft dark:text-slate-500 hover:text-charcoal dark:hover:text-slate-300 hover:bg-white/20 dark:hover:bg-gray-800/50'
                }
              `}
            >
              <div className="flex items-center gap-2 min-w-0">
                <group.icon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="truncate">{group.label}</span>
              </div>
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronUp className="h-4 w-4 shrink-0" />
              )}
            </button>

            {!isCollapsed && (
              <div className="mt-1 mr-2 space-y-0.5 border-r-2 border-gold-200/30 dark:border-gray-700">
                {group.items.map(({ href, icon: Icon, label, color }) => {
                  const isActive = pathname === href || pathname.startsWith(href + '/')

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`
                        relative group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-white/90 to-white/50 dark:from-gray-800 dark:to-gray-800 shadow-md text-gold-800 dark:text-gold-300'
                          : 'hover:bg-white/40 dark:hover:bg-gray-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${color} opacity-10`} />
                      )}
                      <div className={`absolute right-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b ${color} transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                      <div
                        className={`
                          relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all
                          ${isActive ? 'scale-105' : 'group-hover:scale-105 bg-white/50 dark:bg-gray-800'}
                        `}
                      >
                        <div className={`absolute inset-0 rounded-md bg-gradient-to-br ${color} opacity-25 blur-sm`} />
                        <Icon className="h-4 w-4 z-10 text-inherit" />
                      </div>
                      <span className="truncate z-10 flex-1">{label}</span>
                      <div className={`shrink-0 transition-transform ${isActive ? 'translate-x-0 text-gold-600' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70 text-slate-400'}`}>
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default SideBar
