'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
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
  CalendarCheck,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  UserCircle,
  Wallet,
  DollarSign,
  FileText,
  ShoppingCart,
  UserCog,
  Crown,
  Sparkles,
  Settings,
  Coins,
  Wrench,
  TrendingUp,
  Heart
} from 'lucide-react'

/** Single source of truth for sidebar navigation. Persian labels, RTL-friendly. */
const NAV_GROUPS: Array<{
  id: string
  label: string
  icon: React.ElementType
  items: Array<{ href: string; icon: React.ElementType; label: string }>
}> = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    icon: LayoutDashboard,
    items: [{ href: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' }]
  },
  {
    id: 'sales',
    label: 'فروشات',
    icon: FileText,
    items: [
      { href: '/sales', icon: FileText, label: 'فروشات' },
      { href: '/product-from-supplier', icon: ShoppingBag, label: 'خرید جنس از تمویل کننده' },
      { href: '/purchases', icon: ShoppingCart, label: 'خریدها' },
      { href: '/add-fragment', icon: Puzzle, label: 'خرید شکسته' }
    ]
  },
  {
    id: 'products',
    label: 'محصولات و انبار',
    icon: Package,
    items: [
      { href: '/products', icon: Package, label: 'اجناس' },
      { href: '/register-product', icon: Hammer, label: 'ثبت اجناس شکسته' },
      { href: '/register-supplier-product', icon: PackagePlus, label: 'ثبت اجناس' },
      { href: '/ware-house', icon: Warehouse, label: 'انبار' }
    ]
  },
  {
    id: 'finance',
    label: 'مالی و مصارف',
    icon: Receipt,
    items: [
      { href: '/accounts', icon: Wallet, label: 'حسابات' },
      { href: '/expenses', icon: Receipt, label: 'مصارف' },
      { href: '/currency-rates', icon: DollarSign, label: 'نرخ ارز' },
      { href: '/gold-rate', icon: Coins, label: 'نرخ طلا' }
    ]
  },
  {
    id: 'customers',
    label: 'مشتریان و وام',
    icon: CreditCard,
    items: [
      { href: '/customer-registration', icon: UserPlus, label: 'ثبت مشتریان' },
      { href: '/customers/crm', icon: Heart, label: 'CRM مشتریان' },
      { href: '/loan-management', icon: CreditCard, label: 'بلانس مشتریان' },
      { href: '/loan-reports', icon: FileText, label: 'گزارش قرض' }
    ]
  },
  {
    id: 'parties',
    label: 'اشخاص و طرف‌ها',
    icon: Users,
    items: [{ href: '/suppliers', icon: Users, label: 'لیست تمویل کنندگان' }]
  },
  {
    id: 'repairs',
    label: 'تعمیرات',
    icon: Wrench,
    items: [{ href: '/repairs', icon: Wrench, label: 'لیست تعمیرات' }]
  },
  {
    id: 'reports',
    label: 'گزارشات',
    icon: BarChart3,
    items: [
      { href: '/daily-report', icon: CalendarCheck, label: 'گزارش یومیه' },
      { href: '/report', icon: BarChart3, label: 'گزارشات' },
      { href: '/report/analytics', icon: TrendingUp, label: 'تحلیل فروش' }
    ]
  },
  {
    id: 'settings',
    label: 'تنظیمات',
    icon: Settings,
    items: [
      { href: '/company-settings', icon: Settings, label: 'تنظیمات شرکت' },
      { href: '/company-information', icon: Info, label: 'درباره ما' },
      { href: '/users', icon: UserCog, label: 'مدیریت کاربران' }
    ]
  }
]

// Menu item: RTL layout with icon to the right of Persian label, hover/active soft background
const LuxuryMenuItem: React.FC<{
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  isCollapsed: boolean
}> = ({ href, icon: Icon, label, isActive, isCollapsed }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className={`
        relative group flex flex-row-reverse items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300
        ${isCollapsed ? 'justify-center px-2' : ''}
        ${isActive
          ? 'text-[#d4af37] bg-[#d4af37]/15'
          : 'text-[#fefaf0]/70 hover:text-[#fefaf0] hover:bg-[#d4af37]/10'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-lg overflow-hidden luxury-shine" />
      )}

      <div
        className={`
          absolute inset-0 rounded-lg transition-all duration-300
          ${isHovered || isActive ? 'bg-[#d4af37]/10' : ''}
        `}
      />

      {/* Icon to the right of Persian text (RTL) */}
      <div
        className={`
          relative flex items-center justify-center rounded-md shrink-0 transition-all duration-300
          ${isActive ? 'scale-110' : 'group-hover:scale-110'}
          ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}
        `}
      >
        <Icon
          className={`
            relative z-10 transition-colors duration-300
            ${isActive ? 'text-[#d4af37]' : 'text-[#fefaf0]/60 group-hover:text-[#d4af37]'}
            ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}
          `}
        />
      </div>

      {!isCollapsed && (
        <span className="relative z-10 truncate flex-1 text-right font-medium tracking-wide">{label}</span>
      )}

      {isActive && !isCollapsed && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      )}
    </Link>
  )
}

// Luxury Sidebar Component
const LuxurySidebar: React.FC = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  // Sub-menus collapsed by default; expand the group containing the current route
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const allIds = new Set(NAV_GROUPS.map((g) => g.id))
    const activeGroup = NAV_GROUPS.find((g) =>
      g.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    )
    if (activeGroup) allIds.delete(activeGroup.id)
    return allIds
  })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCollectionOpen, setIsCollectionOpen] = useState(false)

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isGroupActive = (items: typeof NAV_GROUPS[0]['items']) =>
    items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))

  // Collection items (can be customized)
  const collectionItems = [
    { label: 'الماس', count: 12 },
    { label: 'طلا', count: 45 },
    { label: 'نقره', count: 28 },
    { label: 'مروارید', count: 19 },
  ]

  return (
    <aside
        dir="rtl"
        className={`
          relative h-full flex flex-col transition-all duration-500 ease-in-out right-0
          ${isCollapsed ? 'w-20' : 'w-64 lg:w-72'}
        `}
        style={{
          background: 'linear-gradient(180deg, #064e3b 0%, #0a0a0a 100%)',
        }}
      >
        {/* Glassmorphism Container */}
        <div
          className="relative h-full backdrop-blur-xl border-r border-[#d4af37]/30"
          style={{
            background: 'rgba(6, 78, 59, 0.7)',
            boxShadow: 'inset -1px 0 0 rgba(212, 175, 55, 0.1), 4px 0 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-[#064e3b] border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#064e3b] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3 rotate-180" />
            )}
          </button>

          {/* Scrollable Content */}
          <nav className="flex flex-col h-full overflow-y-auto luxury-scrollbar p-4">
            {/* Header */}
            <div className={`mb-6 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-2'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d4af37]/30 blur-md rounded-lg" />
                  <div className="relative bg-gradient-to-br from-[#d4af37] to-[#b8941f] p-2 rounded-lg">
                    <Crown className="w-5 h-5 text-[#064e3b]" />
                  </div>
                </div>
                {!isCollapsed && (
                  <h2
                    className="text-xl font-bold text-[#d4af37] tracking-wider"
                    style={{
                      fontFamily: "'Playfair Display', 'Cinzel', serif",
                      letterSpacing: '0.1em',
                    }}
                  >
                    منوی اصلی
                  </h2>
                )}
              </div>
              {!isCollapsed && (
                <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
              )}
            </div>

            {/* Menu Groups */}
            <div className="flex-1 space-y-1">
              {NAV_GROUPS.map((group) => {
                const isCollapsedGroup = collapsedGroups.has(group.id)
                const hasActive = isGroupActive(group.items)

                return (
                  <div key={group.id} className="mb-2">
                    {/* Group Header */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`
                        w-full flex flex-row-reverse items-center justify-between gap-2 rounded-lg px-3 py-2.5 transition-all duration-300
                        ${isCollapsed ? 'justify-center px-2' : ''}
                        ${hasActive
                          ? 'text-[#d4af37] bg-[#d4af37]/15'
                          : 'text-[#fefaf0]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/10'
                        }
                      `}
                    >
                      <div className={`flex flex-row-reverse items-center gap-2 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                        <group.icon
                          className={`
                            shrink-0 transition-colors duration-300
                            ${hasActive ? 'text-[#d4af37]' : 'text-[#fefaf0]/60'}
                            ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}
                          `}
                        />
                        {!isCollapsed && (
                          <span
                            className="truncate font-semibold tracking-wide"
                            style={{
                              fontFamily: "'Playfair Display', 'Cinzel', serif",
                            }}
                          >
                            {group.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <>
                          {isCollapsedGroup ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#d4af37]/60" />
                          ) : (
                            <ChevronUp className="h-4 w-4 shrink-0 text-[#d4af37]/60" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Group Items */}
                    {!isCollapsedGroup && (
                      <div className={`mt-1 space-y-0.5 ${isCollapsed ? '' : 'mr-2 border-r border-[#d4af37]/20'}`}>
                        {group.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                          return (
                            <LuxuryMenuItem
                              key={item.href}
                              href={item.href}
                              icon={item.icon}
                              label={item.label}
                              isActive={isActive}
                              isCollapsed={isCollapsed}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Jewelry Collection Dropdown */}
            {!isCollapsed && (
              <div className="mt-4 border-t border-[#d4af37]/20 pt-4">
                <button
                  onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                  className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#fefaf0]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span
                      style={{
                        fontFamily: "'Playfair Display', 'Cinzel', serif",
                      }}
                    >
                      مجموعه جواهرات
                    </span>
                  </div>
                  {isCollectionOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#d4af37]/60" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#d4af37]/60" />
                  )}
                </button>

                {isCollectionOpen && (
                  <div className="mt-2 space-y-1 luxury-scrollbar max-h-40 overflow-y-auto">
                    {collectionItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300 group"
                      >
                        <span className="text-sm text-[#fefaf0]/60 group-hover:text-[#d4af37] transition-colors">
                          {item.label}
                        </span>
                        <span className="text-xs text-[#d4af37]/60 font-medium px-2 py-0.5 rounded-full bg-[#d4af37]/10">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Profile Section */}
            <div className={`mt-4 pt-4 border-t border-[#d4af37]/20 ${isCollapsed ? 'px-2' : ''}`}>
              {session?.user && (
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#d4af37]/30 blur-md rounded-full" />
                    <div
                      className="relative w-12 h-12 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#d4af37]/20 to-[#b8941f]/10 flex items-center justify-center overflow-hidden"
                      style={{
                        boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-6 h-6 text-[#d4af37]" />
                      )}
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-[#fefaf0] truncate"
                        style={{
                          fontFamily: "'Playfair Display', 'Cinzel', serif",
                        }}
                      >
                        {session.user.name || 'کاربر'}
                      </p>
                      <p className="text-xs text-[#fefaf0]/50 truncate">
                        {session.user.email || 'ایمیل'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    )
  }

export default LuxurySidebar
