'use client'

import React from 'react'
import type { AccountTransaction } from '@/lib/actions/accounts'

interface LedgerProps {
  transactions: AccountTransaction[]
  loading?: boolean
  emptyMessage?: string
  currency?: string
}

function formatDate(d: Date | string) {
  try {
    return new Date(d).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  } catch {
    return String(d)
  }
}

function formatAmount(value: string | number, currency = '') {
  const n = Number(value)
  const s = Number.isNaN(n) ? '0' : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return currency ? `${s} ${currency}` : s
}

export default function Ledger({
  transactions,
  loading = false,
  emptyMessage = 'No transactions yet',
  currency = ''
}: LedgerProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-800/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <th className="py-3 px-3 text-left font-medium">Date</th>
              <th className="py-3 px-3 text-left font-medium">Type</th>
              <th className="py-3 px-3 text-right font-medium">Amount</th>
              <th className="py-3 px-3 text-right font-medium">Balance before</th>
              <th className="py-3 px-3 text-right font-medium">Balance after</th>
              <th className="py-3 px-3 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : !transactions?.length ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {formatDate(tx.created_at)}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={
                        tx.type === 'credit'
                          ? 'text-green-600 dark:text-green-400 font-medium'
                          : 'text-red-600 dark:text-red-400 font-medium'
                      }
                    >
                      {tx.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-medium ${
                      tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatAmount(tx.amount, currency)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">
                    {formatAmount(tx.balance_before, currency)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-200 font-medium">
                    {formatAmount(tx.balance_after, currency)}
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
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
