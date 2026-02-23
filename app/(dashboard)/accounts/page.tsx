'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getAccounts } from '@/lib/actions/accounts'
import type { Account } from '@/lib/actions/accounts'
import FilterBar from '@/components/ui/FilterBar'
import FormField from '@/components/ui/FormField'
import { Wallet, Plus, ArrowLeft } from 'lucide-react'

function formatBalance(value: string | number, currency: string) {
  const n = Number(value)
  const s = Number.isNaN(n) ? '0' : n.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return `${s} ${currency}`
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen'>('all')

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredAccounts = useMemo(() => {
    let list = accounts
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (acc) =>
          acc.account_number.toLowerCase().includes(q) || acc.name.toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'active') list = list.filter((acc) => acc.status === 'active')
    if (statusFilter === 'frozen') list = list.filter((acc) => acc.status === 'frozen')
    return list
  }, [accounts, search, statusFilter])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
  }

  const extraFilters = (
    <>
      <FormField label="وضعیت">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'frozen')}
          className="input-luxury w-full min-w-[120px]"
        >
          <option value="all">همه</option>
          <option value="active">فعال</option>
          <option value="frozen">مسدود</option>
        </select>
      </FormField>
    </>
  )

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            حسابات
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
            لیست حساب‌ها را با فیلتر مشاهده کنید.
          </p>
        </div>
        <Link
          href="/accounts/new"
          className="min-w-[140px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 transition-all duration-200 inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          ثبت حساب جدید
        </Link>
      </header>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="شماره حساب یا نام..."
        extraFilters={extraFilters}
        onReset={resetFilters}
      />

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
            <Link
              href="/accounts/new"
              className="min-w-[140px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              ثبت حساب جدید
            </Link>
          </div>
        ) : !filteredAccounts.length ? (
          <div className="p-12 text-center text-charcoal-soft dark:text-slate-400">
            با این فیلتر حسابی یافت نشد.
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
                {filteredAccounts.map((acc) => (
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
    </div>
  )
}
