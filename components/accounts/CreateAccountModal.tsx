'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { createAccount } from '@/lib/actions/accounts'

const CURRENCIES = ['AFN', 'USD', 'EUR', 'افغانی', 'دالر']

interface CreateAccountModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateAccountModal({ open, onClose, onSuccess }: CreateAccountModalProps) {
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
        setAccountNumber('')
        setName('')
        setCurrency('AFN')
        onSuccess()
        onClose()
      } else {
        setError(result.error ?? 'خطا در ثبت حساب.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="ثبت حساب جدید" size="default">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          <button
            type="button"
            onClick={onClose}
            className="btn-luxury btn-luxury-outline px-4 py-2"
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury btn-luxury-primary px-4 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال ثبت...' : 'ثبت حساب'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
