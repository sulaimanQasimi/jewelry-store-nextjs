'use client'

import React from 'react'
import PaginationBar from './PaginationBar'
import type { PaginationBarProps } from './PaginationBar'

export interface ColumnDef<T = any> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T = any> {
  columns: ColumnDef<T>[]
  data: T[]
  keyField?: keyof T | string
  loading?: boolean
  emptyMessage?: string
  pagination?: PaginationBarProps
  minWidth?: string | number
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  loading = false,
  emptyMessage = 'دیتایی یافت نشد',
  pagination,
  minWidth = '900px'
}: DataTableProps<T>) {
  const getKey = (row: T) => {
    const k = keyField as string
    return row[k] ?? (row as any).id
  }

  return (
    <div className="card-luxury overflow-hidden rounded-2xl border border-gold-200/50 dark:border-slate-600/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }}>
          <thead>
            <tr className="bg-slate-700 text-white dark:bg-slate-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-3 text-right font-medium border-l border-white/10 last:border-l-0 ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-charcoal-soft dark:text-slate-400">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-charcoal-soft dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={getKey(row)}
                  className="border-b border-gold-100 dark:border-slate-600/50 last:border-0 hover:bg-champagne/40 dark:hover:bg-slate-700/50 transition-colors text-charcoal dark:text-slate-200"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-3 border-l border-gold-100 dark:border-slate-600/50 last:border-l-0 ${col.className ?? ''}`}
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.total > 0 && (
        <PaginationBar {...pagination} />
      )}
    </div>
  )
}
