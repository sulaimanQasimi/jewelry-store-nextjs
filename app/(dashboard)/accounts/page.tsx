'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getAccounts } from '@/lib/actions/accounts'
import type { Account } from '@/lib/actions/accounts'
import CreateAccountModal from '@/components/accounts/CreateAccountModal'
import { Wallet, Plus, ArrowLeft } from 'lucide-react'

function formatBalance(value: string | number, currency: string) {
  const n = Number(value)
  const s = Number.isNaN(n) ? '0' : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return `${s} ${currency}`
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const refresh = useCallback(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setLoading(true)
    getAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-semibold text-charcoal dark:text-white flex items-center gap-2">
          <Wallet className="w-7 h-7 text-amber-600" />
          حسابات
        </h1>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="btn-luxury btn-luxury-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          ثبت حساب جدید
        </button>
      </div>

      <div className="card-luxury rounded-2xl border border-gold-200/50 dark:border-slate-600/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal-soft dark:text-slate-400">
            در حال بارگذاری...
          </div>
        ) : !accounts.length ? (
          <div className="p-12 text-center">
            <p className="text-charcoal-soft dark:text-slate-400 mb-4">
              هنوز حسابی ثبت نشده است. با کلیک روی دکمه زیر اولین حساب را ایجاد کنید.
            </p>
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="btn-luxury btn-luxury-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              ثبت حساب جدید
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-white dark:bg-slate-800">
                  <th className="py-3 px-3 text-right font-medium">شماره حساب</th>
                  <th className="py-3 px-3 text-right font-medium">نام</th>
                  <th className="py-3 px-3 text-right font-medium">واحد پول</th>
                  <th className="py-3 px-3 text-right font-medium">موجودی</th>
                  <th className="py-3 px-3 text-right font-medium">وضعیت</th>
                  <th className="py-3 px-3 text-right font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-3 font-medium text-charcoal dark:text-white">{acc.account_number}</td>
                    <td className="py-3 px-3 text-charcoal dark:text-slate-200">{acc.name}</td>
                    <td className="py-3 px-3 text-charcoal dark:text-slate-200">{acc.currency}</td>
                    <td className="py-3 px-3 font-medium text-charcoal dark:text-white">
                      {formatBalance(acc.balance, acc.currency)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={
                          acc.status === 'active'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }
                      >
                        {acc.status === 'active' ? 'فعال' : 'مسدود'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/accounts/${acc.id}`}
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        مشاهده و حواله / برداشت
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateAccountModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  )
}
