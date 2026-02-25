'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface CurrencyFormData {
  id?: number
  code: string
  name_fa: string
  symbol: string | null
  rate?: number | null
  is_default?: boolean | number
  active?: boolean | number
  sort_order?: number
}

interface CurrencyFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: CurrencyFormData | null
  onSuccess: () => void
}

const emptyForm: CurrencyFormData = {
  code: '',
  name_fa: '',
  symbol: '',
  rate: null,
  is_default: 0,
  active: 1,
  sort_order: 0
}

export default function CurrencyFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: CurrencyFormModalProps) {
  const [form, setForm] = useState<CurrencyFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          id: initialData.id,
          code: initialData.code ?? '',
          name_fa: initialData.name_fa ?? '',
          symbol: initialData.symbol ?? '',
          rate: initialData.rate != null ? Number(initialData.rate) : null,
          is_default: initialData.is_default === true || initialData.is_default === 1 ? 1 : 0,
          active: initialData.active === false || initialData.active === 0 ? 0 : 1,
          sort_order: typeof initialData.sort_order === 'number' ? initialData.sort_order : parseInt(String(initialData.sort_order || 0), 10) || 0
        })
      } else {
        setForm({ ...emptyForm })
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code?.trim()) {
      toast.error('کد ارز الزامی است')
      return
    }
    if (!form.name_fa?.trim()) {
      toast.error('نام فارسی ارز الزامی است')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        code: form.code.trim(),
        name_fa: form.name_fa.trim(),
        symbol: form.symbol?.trim() || null,
        rate: typeof form.rate === 'number' && !isNaN(form.rate) ? form.rate : null,
        is_default: form.is_default === 1 || form.is_default === true,
        active: form.active !== 0 && form.active !== false,
        sort_order: typeof form.sort_order === 'number' ? form.sort_order : parseInt(String(form.sort_order || 0), 10) || 0
      }
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/currencies/update/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/currencies/create', payload)
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

  const title = mode === 'edit' ? 'ویرایش ارز' : 'افزودن ارز'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="کد ارز (مثلاً USD, AFN)">
            <input
              name="code"
              className="input-luxury w-full"
              dir="ltr"
              value={form.code}
              onChange={handleChange}
              placeholder="USD"
              maxLength={20}
              disabled={mode === 'edit'}
            />
          </FormField>
          <FormField label="نام فارسی">
            <input
              name="name_fa"
              className="input-luxury w-full"
              value={form.name_fa}
              onChange={handleChange}
              placeholder="دالر"
            />
          </FormField>
          <FormField label="نماد (اختیاری)">
            <input
              name="symbol"
              className="input-luxury w-full"
              value={form.symbol ?? ''}
              onChange={handleChange}
              placeholder="$"
              maxLength={10}
            />
          </FormField>
          <FormField label="نرخ (واحد پول پایه به ازای ۱ واحد این ارز، مثلاً برای دالر: تعداد افغانی)">
            <input
              name="rate"
              type="number"
              step="0.01"
              min="0"
              className="input-luxury w-full"
              dir="ltr"
              value={form.rate ?? ''}
              onChange={(e) => { const v = e.target.value; setForm((prev) => ({ ...prev, rate: v === '' ? null : (parseFloat(v) || null) })) }}
              placeholder="مثلاً 72"
            />
          </FormField>
          <FormField label="ترتیب نمایش">
            <input
              name="sort_order"
              type="number"
              min={0}
              className="input-luxury w-full"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
            />
          </FormField>
          <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_default === 1 || form.is_default === true}
                onChange={(e) => setForm((prev) => ({ ...prev, is_default: e.target.checked ? 1 : 0 }))}
                className="rounded border-gold-200"
              />
              <span className="text-sm text-charcoal">ارز پیش‌فرض</span>
            </label>
            {mode === 'edit' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active !== 0 && form.active !== false}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked ? 1 : 0 }))}
                  className="rounded border-gold-200"
                />
                <span className="text-sm text-charcoal">فعال</span>
              </label>
            )}
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
