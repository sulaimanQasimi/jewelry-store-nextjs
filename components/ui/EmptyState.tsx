'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  subMessage?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export default function EmptyState({
  message = 'داده‌ای وجود ندارد',
  subMessage,
  action,
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-xl border border-amber-200/50 dark:border-amber-800/40 bg-[#FDFBF7]/50 dark:bg-slate-800/30 ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
        {icon ?? <Sparkles className="w-7 h-7" strokeWidth={1.75} />}
      </div>
      <p className="font-heading text-lg font-medium text-slate-700 dark:text-slate-300 text-center">
        {message}
      </p>
      {subMessage ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-stat max-w-sm">
          {subMessage}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
