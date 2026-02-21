'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
  UserCog,
  Crown,
  Sparkles,
  Settings,
  Coins,
  Wrench
} from 'lucide-react'

const groups = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    icon: LayoutDashboard,
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'خلاصه' }
    ]
  },
  {
    id: 'sales',
    label: 'فروش و خرید',
    icon: Gem,
    items: [
      { href: '/sale-product', icon: Gem, label: 'فروش جنس' },
      { href: '/sales', icon: FileText, label: 'لیست فروشات' },
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
      { href: '/product-masters', icon: Layers, label: 'محصولات اصلی' },
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
      { href: '/expenses', icon: Receipt, label: 'مصارف' },
      { href: '/personal-expenses', icon: Wallet, label: 'مصارف شخصی' },
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
      { href: '/loan-management', icon: CreditCard, label: 'بلانس مشتریان' },
      { href: '/loan-reports', icon: FileText, label: 'گزارش قرض' }
    ]
  },
  {
    id: 'parties',
    label: 'اشخاص و طرف‌ها',
    icon: Users,
    items: [
      { href: '/suppliers', icon: Users, label: 'لیست تمویل کنندگان' },
      { href: '/persons', icon: UserCircle, label: 'اشخاص' },
      { href: '/new-trade', icon: Handshake, label: 'معامله داران' }
    ]
  },
  {
    id: 'repairs',
    label: 'تعمیرات',
    icon: Wrench,
    items: [
      { href: '/repairs', icon: Wrench, label: 'لیست تعمیرات' }
    ]
  },
  {
    id: 'reports',
    label: 'گزارشات',
    icon: BarChart3,
    items: [
      { href: '/daily-report', icon: CalendarCheck, label: 'گزارش یومیه' },
      { href: '/report', icon: BarChart3, label: 'گزارشات' }
    ]
  },
  {
    id: 'settings',
    label: 'تنظیمات',
    icon: Info,
    items: [
      { href: '/company-settings', icon: Settings, label: 'تنظیمات شرکت' },
      { href: '/company-information', icon: Info, label: 'درباره ما' },
      { href: '/users', icon: UserCog, label: 'مدیریت کاربران' }
    ]
  }
]

// Luxury Menu Item Component with Shine Animation
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
        relative group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-500
        ${isCollapsed ? 'justify-center px-2' : ''}
        ${isActive
          ? 'text-[#d4af37] bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5'
          : 'text-[#fefaf0]/70 hover:text-[#fefaf0] hover:bg-[#d4af37]/5'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
          {/* Shine Animation for Active Item */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg overflow-hidden luxury-shine" />
      )}

      {/* Gold Glow on Hover */}
      <div
        className={`
          absolute inset-0 rounded-lg transition-all duration-500
          ${isHovered || isActive
            ? 'shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-gradient-to-r from-[#d4af37]/10 to-transparent'
            : ''
          }
        `}
      />

      {/* Icon Container */}
      <div
        className={`
          relative flex items-center justify-center rounded-md transition-all duration-300
          ${isActive ? 'scale-110' : 'group-hover:scale-110'}
          ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}
        `}
      >
        <div
          className={`
            absolute inset-0 rounded-md transition-opacity duration-300
            ${isActive || isHovered ? 'bg-[#d4af37]/20 blur-sm' : 'bg-transparent'}
          `}
        />
        <Icon
          className={`
            relative z-10 transition-colors duration-300
            ${isActive ? 'text-[#d4af37]' : 'text-[#fefaf0]/60 group-hover:text-[#d4af37]'}
            ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}
          `}
        />
      </div>

      {/* Label */}
      {!isCollapsed && (
        <span className="relative z-10 truncate flex-1 font-medium tracking-wide">{label}</span>
      )}

      {/* Active Indicator */}
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
  // Start with all groups collapsed; open the one containing the current route
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const allIds = new Set(groups.map((g) => g.id))
    const activeGroup = groups.find((g) =>
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

  const isGroupActive = (items: typeof groups[0]['items']) =>
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
        className={`
          relative h-full flex flex-col transition-all duration-500 ease-in-out
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
              {groups.map((group) => {
                const isCollapsedGroup = collapsedGroups.has(group.id)
                const hasActive = isGroupActive(group.items)

                return (
                  <div key={group.id} className="mb-2">
                    {/* Group Header */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`
                        w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 transition-all duration-300
                        ${isCollapsed ? 'justify-center px-2' : ''}
                        ${hasActive
                          ? 'text-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'text-[#fefaf0]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                        }
                      `}
                    >
                      <div className={`flex items-center gap-2 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
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
