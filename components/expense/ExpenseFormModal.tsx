'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'
import type { ExpenseFormData } from '@/types/expense'

const emptyForm = {
  type: '',
  detail: '',
  price: '',
  currency: 'افغانی',
  date: ''
}

interface ExpenseFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: ExpenseFormData | null
  onSuccess: () => void
}

export default function ExpenseFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: ExpenseFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          type: initialData.type ?? '',
          detail: initialData.detail ?? '',
          price: initialData.price != null ? String(initialData.price) : '',
          currency: initialData.currency ?? 'افغانی',
          date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : ''
        })
      } else {
        setForm({
          ...emptyForm,
          date: new Date().toISOString().slice(0, 10)
        })
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type?.trim() || !form.detail?.trim() || !form.price?.trim() || !form.currency?.trim()) {
      toast.error('نوع، جزئیات، مبلغ و واحد پول را وارد کنید')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        type: form.type.trim(),
        detail: form.detail.trim(),
        price: Number(form.price),
        currency: form.currency,
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString()
      }

      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/expense/update-spent/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/expense/add-expense', payload)
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

  const title = mode === 'edit' ? 'ویرایش مصرف' : 'افزودن مصرف'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="نوع">
            <input
              name="type"
              className="input-luxury w-full"
              value={form.type}
              onChange={handleChange}
              placeholder="نوع مصارف"
            />
          </FormField>
          <FormField label="واحد پول">
            <select name="currency" value={form.currency} onChange={handleChange} className="input-luxury w-full">
              <option value="افغانی">افغانی</option>
              <option value="دالر">دالر</option>
            </select>
          </FormField>
          <FormField label="مبلغ">
            <input
              name="price"
              type="number"
              className="input-luxury w-full"
              value={form.price}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="تاریخ">
            <input
              name="date"
              type="date"
              className="input-luxury w-full"
              value={form.date}
              onChange={handleChange}
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="جزئیات">
              <textarea
                name="detail"
                className="input-luxury w-full min-h-[80px] resize-y"
                value={form.detail}
                onChange={handleChange}
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
