'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface FragmentFormData {
  id?: number
  gram: number
  wareHouse: number
  changedToPasa: number
  remain: number | null
  amount: number
  detail: string | null
  isCompleted?: boolean
}

interface FragmentFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: FragmentFormData | null
  onSuccess: () => void
}

const emptyForm: FragmentFormData = {
  gram: 0,
  wareHouse: 0,
  changedToPasa: 0,
  remain: null,
  amount: 0,
  detail: '',
  isCompleted: false
}

export default function FragmentFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: FragmentFormModalProps) {
  const [form, setForm] = useState<FragmentFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          id: initialData.id,
          gram: initialData.gram ?? 0,
          wareHouse: initialData.wareHouse ?? 0,
          changedToPasa: initialData.changedToPasa ?? 0,
          remain: initialData.remain ?? null,
          amount: initialData.amount ?? 0,
          detail: initialData.detail ?? '',
          isCompleted: initialData.isCompleted ?? false
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      const num = ['gram', 'wareHouse', 'changedToPasa', 'amount'].includes(name)
      setForm((prev) => ({
        ...prev,
        [name]: num ? (value === '' ? 0 : parseFloat(value) || 0) : value
      }))
    }
  }

  const handleRemainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setForm((prev) => ({ ...prev, remain: v === '' ? null : parseFloat(v) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.gram <= 0) {
      toast.error('وزن باید عدد مثبت باشد')
      return
    }
    if (form.amount < 0) {
      toast.error('مبلغ نامعتبر است')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/fragment/update/${initialData.id}`, {
          gram: form.gram,
          wareHouse: form.wareHouse,
          changedToPasa: form.changedToPasa,
          remain: form.remain,
          amount: form.amount,
          detail: form.detail?.trim() || null,
          isCompleted: form.isCompleted ?? false
        })
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/fragment/create', {
          gram: form.gram,
          wareHouse: form.wareHouse,
          changedToPasa: form.changedToPasa,
          remain: form.remain,
          amount: form.amount,
          detail: form.detail?.trim() || null,
          isCompleted: form.isCompleted ?? false
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

  const title = mode === 'edit' ? 'ویرایش شکسته' : 'افزودن شکسته'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="وزن (گرم)">
            <input
              type="number"
              step="0.01"
              name="gram"
              className="input-luxury w-full"
              value={form.gram || ''}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </FormField>
          <FormField label="انبار">
            <input
              type="number"
              step="0.01"
              name="wareHouse"
              className="input-luxury w-full"
              value={form.wareHouse || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </FormField>
          <FormField label="تبدیل به پاسا">
            <input
              type="number"
              step="0.01"
              name="changedToPasa"
              className="input-luxury w-full"
              value={form.changedToPasa || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </FormField>
          <FormField label="باقی‌مانده">
            <input
              type="number"
              step="0.01"
              name="remain"
              className="input-luxury w-full"
              value={form.remain ?? ''}
              onChange={handleRemainChange}
              placeholder="خالی"
            />
          </FormField>
          <FormField label="مبلغ">
            <input
              type="number"
              step="0.01"
              name="amount"
              className="input-luxury w-full"
              value={form.amount || ''}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="توضیحات">
              <textarea
                name="detail"
                className="input-luxury w-full"
                rows={2}
                value={form.detail ?? ''}
                onChange={handleChange}
                placeholder="توضیحات (اختیاری)"
              />
            </FormField>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="fragment-isCompleted"
              name="isCompleted"
              checked={form.isCompleted ?? false}
              onChange={handleChange}
              className="rounded border-gold-200"
            />
            <label htmlFor="fragment-isCompleted" className="text-sm text-charcoal">
              تکمیل شده
            </label>
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
