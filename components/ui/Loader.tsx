'use client'

import React from 'react'
import { Gem } from 'lucide-react'

interface LoaderProps {
  message?: string
  className?: string
}

export default function Loader({ message = 'در حال بارگذاری…', className = '' }: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 min-h-[200px] text-slate-600 dark:text-slate-400 ${className}`}
      role="status"
      aria-label={message}
    >
      <div className="relative flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-amber-200 dark:border-amber-800 border-t-amber-500 dark:border-t-amber-400 rounded-full" />
        <Gem className="absolute w-5 h-5 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-stat">{message}</p>
    </div>
  )
}
