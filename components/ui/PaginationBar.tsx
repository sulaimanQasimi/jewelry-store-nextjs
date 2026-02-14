'use client'

import React from 'react'

export interface PaginationBarProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  limitOptions?: number[]
}

export default function PaginationBar({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50]
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold-200 dark:border-slate-600 bg-gold-50/50 dark:bg-slate-800/80 px-4 py-3 text-sm">
      <div className="flex items-center gap-4">
        <span className="text-charcoal-soft dark:text-slate-400">
          نمایش {start}–{end} از {total}
        </span>
        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="input-luxury w-20 py-1.5 text-sm"
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="btn-luxury btn-luxury-outline rounded-lg px-2 py-1 text-sm disabled:opacity-50"
        >
          اول
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-luxury btn-luxury-outline rounded-lg px-2 py-1 text-sm disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="px-2 text-charcoal dark:text-slate-200">
          صفحه {page} از {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-luxury btn-luxury-outline rounded-lg px-2 py-1 text-sm disabled:opacity-50"
        >
          بعدی
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="btn-luxury btn-luxury-outline rounded-lg px-2 py-1 text-sm disabled:opacity-50"
        >
          آخر
        </button>
      </div>
    </div>
  )
}
