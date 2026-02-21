'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import { Coins, Calendar } from 'lucide-react'

export interface GoldRateFormData {
  id?: number
  date: string
  price_per_ounce_usd: number | string
  price_per_gram_afn?: number | string | null
  source?: string
}

const inputBase =
  'input-luxury w-full pe-10 rounded-xl border border-amber-100 dark:border-slate-600 bg-white dark:bg-slate-800/80 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-500/40 focus:border-amber-300 dark:focus:border-amber-500/60 transition-all duration-200'

interface GoldRateFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: GoldRateFormData | null
  onSuccess: () => void
}

export default function GoldRateFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: GoldRateFormModalProps) {
  const [form, setForm] = useState<GoldRateFormData>({
    date: new Date().toISOString().split('T')[0],
    price_per_ounce_usd: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          id: initialData.id,
          date: initialData.date ?? new Date().toISOString().split('T')[0],
          price_per_ounce_usd: initialData.price_per_ounce_usd ?? '',
          price_per_gram_afn: initialData.price_per_gram_afn ?? '',
          source: initialData.source ?? 'manual'
        })
      } else {
        setForm({
          date: new Date().toISOString().split('T')[0],
          price_per_ounce_usd: ''
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
    const priceOz = parseFloat(String(form.price_per_ounce_usd))
    if (isNaN(priceOz) || priceOz <= 0) {
      toast.error('نرخ طلا (دلار per اونس) باید عدد مثبت باشد')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        date: form.date.trim(),
        price_per_ounce_usd: priceOz,
        price_per_gram_afn: form.price_per_gram_afn ? parseFloat(String(form.price_per_gram_afn)) : undefined,
        source: form.source || 'manual'
      }
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/gold-rate/update/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/gold-rate/create', payload)
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

  const title = mode === 'edit' ? 'ویرایش نرخ طلا' : 'افزودن نرخ طلا'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">تاریخ</label>
            <div className="relative">
              <input
                name="date"
                type="date"
                className={inputBase}
                value={form.date}
                onChange={handleChange}
              />
              <span className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none text-amber-600/70 dark:text-amber-400/80">
                <Calendar className="w-5 h-5" strokeWidth={1.75} />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">
              نرخ طلا (دلار per اونس)
            </label>
            <div className="relative">
              <input
                name="price_per_ounce_usd"
                type="number"
                step="0.01"
                min="0"
                className={inputBase + ' phone-ltr'}
                value={form.price_per_ounce_usd}
                onChange={handleChange}
                placeholder="مثال: 2050"
                dir="ltr"
              />
              <span className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none text-amber-600/70 dark:text-amber-400/80">
                <Coins className="w-5 h-5" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          در صورت وجود نرخ ارز برای همین تاریخ، قیمت per گرم (افغانی) به‌صورت خودکار محاسبه می‌شود.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="min-w-[120px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 font-stat"
          >
            {submitting ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
