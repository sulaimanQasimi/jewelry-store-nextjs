'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export type StatCardVariant = 'emerald' | 'gold' | 'ruby' | 'neutral'

const variantStyles: Record<
  StatCardVariant,
  { icon: string; ring: string }
> = {
  emerald: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20'
  },
  gold: {
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20'
  },
  ruby: {
    icon: 'text-rose-700 dark:text-rose-400',
    ring: 'ring-rose-600/20'
  },
  neutral: {
    icon: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-500/20'
  }
}

export interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  variant?: StatCardVariant
  href: string
}

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  variant = 'neutral',
  href
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-amber-200/50 dark:border-amber-900/40 bg-[#FDFBF7] dark:bg-slate-800/80 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 hover:border-amber-300/60 dark:hover:border-amber-700/50"
    >
      <div className="p-5 flex items-start justify-between gap-4" dir="rtl">
        <div className="min-w-0 flex-1 font-stat">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {value}
          </p>
          {sub ? (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {sub}
            </p>
          ) : null}
        </div>
        <div
          className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${styles.ring} bg-white/80 dark:bg-slate-700/50 ${styles.icon} group-hover:scale-105 transition-transform duration-300`}
          aria-hidden
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </div>
    </Link>
  )
}
