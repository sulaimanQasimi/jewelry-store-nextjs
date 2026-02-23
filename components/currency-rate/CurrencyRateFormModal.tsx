'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

export interface CurrencyRateFormData {
  id?: number
  date: string
  usdToAfn: number | string
}

interface CurrencyRateFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: CurrencyRateFormData | null
  onSuccess: () => void
}

export default function CurrencyRateFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: CurrencyRateFormModalProps) {
  const [form, setForm] = useState<CurrencyRateFormData>({
    date: new Date().toISOString().split('T')[0],
    usdToAfn: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          date: initialData.date ?? new Date().toISOString().split('T')[0],
          usdToAfn: initialData.usdToAfn ?? ''
        })
      } else {
        setForm({
          date: new Date().toISOString().split('T')[0],
          usdToAfn: ''
        })
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date?.trim()) {
      toast.error('تاریخ الزامی است')
      return
    }
    const rate = parseFloat(String(form.usdToAfn))
    if (isNaN(rate) || rate <= 0) {
      toast.error('نرخ ارز باید عدد مثبت باشد')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/currency-rate/update/${initialData.id}`, {
          date: form.date.trim(),
          usdToAfn: rate
        })
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/currency-rate/create', {
          date: form.date.trim(),
          usdToAfn: rate
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

  const title = mode === 'edit' ? 'ویرایش نرخ ارز' : 'افزودن نرخ ارز'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="تاریخ">
            <PersianDatePicker
              value={form.date || null}
              onChange={(v) => setForm((f) => ({ ...f, date: v ?? '' }))}
              className="input-luxury w-full"
            />
          </FormField>
          <FormField label="نرخ دالر به افغانی">
            <input
              name="usdToAfn"
              type="number"
              step="0.01"
              min="0"
              className="input-luxury w-full"
              value={form.usdToAfn}
              onChange={handleChange}
              placeholder="نرخ دالر به افغانی"
            />
          </FormField>
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
