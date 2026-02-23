'use client'

import React from 'react'
import type { AccountTransaction } from '@/lib/actions/accounts'

interface LedgerProps {
  transactions: AccountTransaction[]
  loading?: boolean
  emptyMessage?: string
  currency?: string
}

function formatDateFa(d: Date | string) {
  try {
    return new Date(d).toLocaleString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return String(d)
  }
}

function formatAmount(value: string | number, currency = '') {
  const n = Number(value)
  const s = Number.isNaN(n) ? '0' : n.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return currency ? `${s} ${currency}` : s
}

export default function Ledger({
  transactions,
  loading = false,
  emptyMessage = 'هنوز تراکنشی ثبت نشده است.',
  currency = ''
}: LedgerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm">
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                تاریخ
              </th>
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                نوع
              </th>
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                مبلغ
              </th>
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                موجودی قبلی
              </th>
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                موجودی جدید
              </th>
              <th className="py-3 px-3 text-right font-medium border-b border-slate-200 dark:border-slate-600">
                توضیحات
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : !transactions?.length ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr
                  key={tx.id}
                  className={`border-b border-slate-100 dark:border-slate-600/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700/30' : 'bg-white dark:bg-slate-800/30'
                  } hover:bg-slate-100 dark:hover:bg-slate-700/50`}
                >
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap text-right">
                    {formatDateFa(tx.created_at)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-medium ${
                        tx.type === 'credit'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.type === 'credit' ? 'واریز' : 'برداشت'}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-medium ${
                      tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatAmount(tx.amount, currency)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
                    {formatAmount(tx.balance_before, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-charcoal dark:text-white">
                    {formatAmount(tx.balance_after, currency)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[200px] truncate text-right">
                    {tx.description ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
