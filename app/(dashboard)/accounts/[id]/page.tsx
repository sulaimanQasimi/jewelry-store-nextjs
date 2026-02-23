'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getAccount, getAccountTransactions } from '@/lib/actions/accounts'
import type { Account } from '@/lib/actions/accounts'
import Ledger from '@/components/accounts/Ledger'
import DepositWithdrawModal from '@/components/accounts/DepositWithdrawModal'
import type { TransactionType } from '@/lib/actions/accounts'
import { Wallet, ArrowRight, Plus, Minus } from 'lucide-react'

function formatBalance(value: string | number, currency: string) {
  const n = Number(value)
  const s = Number.isNaN(n) ? '0' : n.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return `${s} ${currency}`
}

export default function AccountDetailPage() {
  const params = useParams()
  const accountId = params?.id as string | undefined
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Awaited<ReturnType<typeof getAccountTransactions>>>([])
  const [loading, setLoading] = useState(true)
  const [modalType, setModalType] = useState<TransactionType | null>(null)

  const refresh = useCallback(() => {
    if (!accountId) return
    setLoading(true)
    Promise.all([getAccount(accountId), getAccountTransactions(accountId)])
      .then(([acc, txs]) => {
        setAccount(acc ?? null)
        setTransactions(Array.isArray(txs) ? txs : [])
      })
      .catch(() => {
        setAccount(null)
        setTransactions([])
      })
      .finally(() => setLoading(false))
  }, [accountId])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!accountId) {
    return (
      <div className="p-8 text-center text-charcoal-soft dark:text-slate-400 font-[family-name:var(--font-vazirmatn),'Vazirmatn',Tahoma,sans-serif]">
        شناسه حساب نامعتبر است.
      </div>
    )
  }

  if (!loading && !account) {
    return (
      <div className="space-y-4 font-[family-name:var(--font-vazirmatn),'Vazirmatn',Tahoma,sans-serif]" dir="rtl">
        <Link href="/accounts" className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1">
          بازگشت به لیست حساب‌ها
        </Link>
        <p className="text-charcoal-soft dark:text-slate-400">حساب یافت نشد.</p>
      </div>
    )
  }

  return (
    <div
      className="space-y-6 min-h-0 font-[family-name:var(--font-vazirmatn),'Vazirmatn',Tahoma,sans-serif]"
      dir="rtl"
    >
      {/* Header: back + title + action buttons (واریز / برداشت) at start (right in RTL) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/accounts"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-charcoal dark:text-slate-200 transition-colors"
            aria-label="بازگشت به لیست حساب‌ها"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-charcoal dark:text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            {account?.name ?? '—'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModalType('credit')}
            disabled={loading || account?.status !== 'active'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            واریز
          </button>
          <button
            type="button"
            onClick={() => setModalType('debit')}
            disabled={loading || account?.status !== 'active'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            <Minus className="w-4 h-4" />
            برداشت
          </button>
        </div>
      </div>

      {/* Account details card: glassmorphism / soft-shadow, 4-column grid */}
      {account && (
        <div className="rounded-2xl border border-white/60 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_16px_-8px_rgba(0,0,0,0.04)] p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">شماره حساب</p>
              <p className="font-medium text-charcoal dark:text-white text-lg">{account.account_number}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">موجودی</p>
              <p className="font-medium text-charcoal dark:text-white text-lg">
                {formatBalance(account.balance, account.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">واحد پول</p>
              <p className="font-medium text-charcoal dark:text-white text-lg">{account.currency}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">وضعیت</p>
              <p
                className={`font-medium text-lg ${account.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}
              >
                {account.status === 'active' ? 'فعال' : 'مسدود'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction history */}
      <div>
        <h2 className="text-lg font-semibold text-charcoal dark:text-white mb-3">تاریخچه تراکنش‌ها</h2>
        <Ledger
          transactions={transactions}
          loading={loading}
          emptyMessage="هنوز تراکنشی ثبت نشده است."
          currency={account?.currency ?? ''}
        />
      </div>

      {account && (
        <>
          <DepositWithdrawModal
            open={modalType === 'credit'}
            onClose={() => setModalType(null)}
            accountId={account.id}
            accountName={account.name}
            currency={account.currency}
            type="credit"
            onSuccess={refresh}
          />
          <DepositWithdrawModal
            open={modalType === 'debit'}
            onClose={() => setModalType(null)}
            accountId={account.id}
            accountName={account.name}
            currency={account.currency}
            type="debit"
            onSuccess={refresh}
          />
        </>
      )}
    </div>
  )
}
