'use client'

import React from 'react'
import Link from 'next/link'
import { Coins } from 'lucide-react'

interface GoldRatesCardProps {
  pricePerGramAfn: number | null
  date: string | null
  pricePerOunceUsd?: number | null
  href?: string
}

const formatNum = (n: number) => n.toLocaleString('fa-IR')
const formatDate = (d: string) => {
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

export default function GoldRatesCard({
  pricePerGramAfn,
  date,
  pricePerOunceUsd,
  href = '/gold-rate'
}: GoldRatesCardProps) {
  const value = pricePerGramAfn != null ? `${formatNum(Math.round(pricePerGramAfn))} افغانی/گرم` : '—'
  const sub = date ? formatDate(date) : 'ثبت نرخ طلا'
  const sub2 = pricePerOunceUsd != null ? `$${pricePerOunceUsd.toLocaleString('en')}/oz` : null

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-amber-200/50 dark:border-amber-900/40 bg-[#FDFBF7] dark:bg-slate-800/80 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 hover:border-amber-300/60 dark:hover:border-amber-700/50"
    >
      <div className="p-5 flex items-start justify-between gap-4" dir="rtl">
        <div className="min-w-0 flex-1 font-stat">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">نرخ طلا</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>
          {sub2 ? (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub2}</p>
          ) : null}
        </div>
        <div
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ring-1 ring-amber-500/20 bg-white/80 dark:bg-slate-700/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform duration-300"
          aria-hidden
        >
          <Coins className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </div>
    </Link>
  )
}
