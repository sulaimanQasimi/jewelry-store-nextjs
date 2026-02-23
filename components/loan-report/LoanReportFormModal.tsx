'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

export interface LoanReportFormData {
  id?: number
  cName: string
  cId: number | string
  amount: number | string
  currency: string
  detail: string
  date: string | null
}

interface LoanReportFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: LoanReportFormData | null
  onSuccess: () => void
}

const emptyForm: LoanReportFormData = {
  cName: '',
  cId: '',
  amount: '',
  currency: 'افغانی',
  detail: '',
  date: null
}

export default function LoanReportFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: LoanReportFormModalProps) {
  const [form, setForm] = useState<LoanReportFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [customers, setCustomers] = useState<{ id: number; customerName?: string; name?: string; phone: string }[]>([])

  useEffect(() => {
    if (open) {
      axios.get<{ success?: boolean; data?: { id: number; customerName: string; phone: string }[] }>('/api/customer/registered-customers', { params: { limit: 500 } })
        .then(({ data: res }) => {
          const list = Array.isArray(res?.data) ? res.data : []
          setCustomers(list)
        })
        .catch(() => setCustomers([]))
    }
  }, [open])

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          cName: initialData.cName ?? '',
          cId: initialData.cId ?? '',
          amount: initialData.amount ?? '',
          currency: initialData.currency ?? 'افغانی',
          detail: initialData.detail ?? '',
          date: initialData.date ?? null
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, mode, initialData])

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    const c = customers.find((x) => x.id === parseInt(id))
    setForm((prev) => ({
      ...prev,
      cId: id,
      cName: c ? (c.customerName ?? c.name ?? '') : prev.cName
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.cName?.trim() || !form.cId) {
      toast.error('مشتری الزامی است')
      return
    }
    const amt = parseFloat(String(form.amount))
    if (isNaN(amt) || amt <= 0) {
      toast.error('مبلغ باید عدد مثبت باشد')
      return
    }
    if (!form.currency?.trim()) {
      toast.error('واحد پول الزامی است')
      return
    }
    if (!form.detail?.trim()) {
      toast.error('جزئیات الزامی است')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/loan-report/update/${initialData.id}`, {
          cName: form.cName.trim(),
          cId: parseInt(String(form.cId)),
          amount: amt,
          currency: form.currency.trim(),
          detail: form.detail.trim(),
          date: form.date || null
        })
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/loan-report/create', {
          cName: form.cName.trim(),
          cId: parseInt(String(form.cId)),
          amount: amt,
          currency: form.currency.trim(),
          detail: form.detail.trim(),
          date: form.date || null
        })
        if (data.success) {
          toast.success(data.message ?? 'ذخیره شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    } finally {
      setSubmitting(false)
    }
  }

  const title = mode === 'edit' ? 'ویرایش گزارش قرض' : 'افزودن گزارش قرض'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="مشتری" required>
            <select
              name="cId"
              className="input-luxury w-full"
              value={form.cId}
              onChange={handleCustomerSelect}
              required
            >
              <option value="">انتخاب مشتری...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customerName ?? c.name ?? ''} - {c.phone}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="نام مشتری">
            <input
              name="cName"
              className="input-luxury w-full"
              value={form.cName}
              onChange={handleChange}
              placeholder="نام مشتری"
            />
          </FormField>
          <FormField label="مبلغ">
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              className="input-luxury w-full"
              value={form.amount}
              onChange={handleChange}
              placeholder="مبلغ"
            />
          </FormField>
          <FormField label="واحد پول">
            <select
              name="currency"
              className="input-luxury w-full"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="افغانی">افغانی</option>
              <option value="دالر">دالر</option>
            </select>
          </FormField>
          <FormField label="تاریخ">
            <PersianDatePicker
              value={form.date}
              onChange={(v) => setForm((f) => ({ ...f, date: v }))}
              className="input-luxury w-full"
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="جزئیات" required>
              <textarea
                name="detail"
                className="input-luxury w-full min-h-[80px]"
                value={form.detail}
                onChange={handleChange}
                placeholder="جزئیات"
                required
              />
            </FormField>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gold-200">
          <button type="button" onClick={onClose} className="btn-luxury btn-luxury-outline px-6 py-2">
            لغو
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال ذخیره...' : mode === 'edit' ? 'به‌روزرسانی' : 'ذخیره'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
