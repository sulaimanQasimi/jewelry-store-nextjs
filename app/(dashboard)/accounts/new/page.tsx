'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAccount } from '@/lib/actions/accounts'
import { Wallet, ArrowRight } from 'lucide-react'

const CURRENCIES = ['AFN', 'USD', 'EUR', 'افغانی', 'دالر']

export default function NewAccountPage() {
  const router = useRouter()
  const [accountNumber, setAccountNumber] = useState('')
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('AFN')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await createAccount(accountNumber, name, currency)
      if (result.success) {
        router.push(result.account ? `/accounts/${result.account.id}` : '/accounts')
      } else {
        setError(result.error ?? 'خطا در ثبت حساب.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Link
          href="/accounts"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-charcoal dark:text-slate-200"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-semibold text-charcoal dark:text-white flex items-center gap-2">
          <Wallet className="w-7 h-7 text-amber-600" />
          ثبت حساب جدید
        </h1>
      </div>

      <div className="card-luxury rounded-2xl border border-gold-200/50 dark:border-slate-600/50 p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="account_number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              شماره حساب
            </label>
            <input
              id="account_number"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              placeholder="مثال: ACC-001"
              className="input-luxury w-full"
            />
          </div>
          <div>
            <label htmlFor="account_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              نام حساب
            </label>
            <input
              id="account_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="مثال: حساب جاری اصلی"
              className="input-luxury w-full"
            />
          </div>
          <div>
            <label htmlFor="account_currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              واحد پول
            </label>
            <select
              id="account_currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-luxury w-full"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
            <Link href="/accounts" className="btn-luxury btn-luxury-outline px-4 py-2">
              لغو
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-luxury btn-luxury-primary px-4 py-2 disabled:opacity-60"
            >
              {submitting ? 'در حال ثبت...' : 'ثبت حساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
