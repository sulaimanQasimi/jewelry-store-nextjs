'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import axios from 'axios'

export interface AccountOption {
  id: string
  account_number: string
  name: string
  currency: string
  balance: string
  status: string
}

export interface ReturnProductInfo {
  productId: number
  productName: string
  lineTotal: number
}

interface ReturnPaymentModalProps {
  open: boolean
  onClose: () => void
  saleId: number
  bellNumber: number
  product: ReturnProductInfo
  onSuccess: (updatedSale: unknown | null) => void
}

export default function ReturnPaymentModal({
  open,
  onClose,
  saleId,
  bellNumber,
  product,
  onSuccess
}: ReturnPaymentModalProps) {
  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && accounts.length === 0) {
      setLoadingAccounts(true)
      axios
        .get<{ success?: boolean; data?: AccountOption[] }>('/api/accounts/list')
        .then((res) => {
          const list = Array.isArray(res.data?.data) ? res.data.data : []
          setAccounts(list.filter((a) => a.status === 'active'))
          if (list.length > 0 && !accountId) setAccountId(list[0].id)
        })
        .catch(() => setAccounts([]))
        .finally(() => setLoadingAccounts(false))
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setAmount(String(product.lineTotal))
      setDescription(`مرجوعی بل #${bellNumber} - ${product.productName}`)
      if (accounts.length > 0 && !accountId) setAccountId(accounts[0].id)
    }
  }, [open, product.lineTotal, product.productName, bellNumber, accounts, accountId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const numAmount = parseFloat(amount)
    if (!accountId) {
      setError('حساب را انتخاب کنید.')
      return
    }
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError('مبلغ معتبر وارد کنید.')
      return
    }
    setSubmitting(true)
    try {
      const desc = description?.trim() || `مرجوعی بل #${bellNumber} - ${product.productName}`
      const txRes = await axios.post('/api/accounts/transaction', {
        accountId,
        type: 'debit',
        amount: numAmount,
        description: desc
      })
      if (!txRes.data?.success) {
        setError(txRes.data?.message ?? 'برداشت از حساب ناموفق بود.')
        return
      }
      const returnRes = await axios.post<{
        success?: boolean
        message?: string
        transaction?: unknown
      }>(`/api/transaction/return?transactionId=${saleId}&productId=${product.productId}`, {
        note: desc
      })
      if (returnRes.data?.success) {
        onSuccess(returnRes.data.transaction ?? null)
        onClose()
      } else {
        setError(returnRes.data?.message ?? 'ثبت مرجوعی ناموفق بود.')
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        (err?.message || 'خطا در پردازش')
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="برگشت محصول و برداشت از حساب"
      size="default"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          مبلغ بازپرداخت از حساب انتخاب‌شده برداشت می‌شود و محصول به انبار برمی‌گردد.
        </p>
        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
            محصول
          </label>
          <p className="text-charcoal dark:text-white font-medium">{product.productName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            مبلغ خط: {Number(product.lineTotal).toLocaleString('fa-IR')} افغانی
          </p>
        </div>
        <div>
          <label htmlFor="return-account" className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
            حساب (برداشت از)
          </label>
          {!loadingAccounts && accounts.length === 0 && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-2">هیچ حساب فعالی یافت نشد. از بخش حساب‌ها یک حساب ایجاد کنید.</p>
          )}
          <select
            id="return-account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            disabled={loadingAccounts}
            className="input-luxury w-full"
          >
            <option value="">انتخاب حساب...</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — {acc.account_number} ({acc.currency}) — موجودی: {Number(acc.balance).toLocaleString('fa-IR')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="return-amount" className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
            مبلغ برداشت
          </label>
          <input
            id="return-amount"
            type="number"
            step="1"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="input-luxury w-full"
          />
        </div>
        <div>
          <label htmlFor="return-desc" className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
            توضیح (اختیاری)
          </label>
          <input
            id="return-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مرجوعی بل #..."
            className="input-luxury w-full"
          />
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
            disabled={submitting || loadingAccounts}
            className="btn-luxury btn-luxury-primary px-4 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال پردازش...' : 'برداشت و برگشت محصول'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
