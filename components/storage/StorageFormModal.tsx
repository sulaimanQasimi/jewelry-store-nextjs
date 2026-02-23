'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

export interface StorageFormData {
  date: string
  usd: number
  afn: number
}

interface StorageFormModalProps {
  open: boolean
  onClose: () => void
  initialData: StorageFormData | null
  onSuccess: () => void
}

export default function StorageFormModal({
  open,
  onClose,
  initialData,
  onSuccess
}: StorageFormModalProps) {
  const [form, setForm] = useState<StorageFormData>({
    date: new Date().toISOString().slice(0, 10),
    usd: 0,
    afn: 0
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          date: initialData.date || new Date().toISOString().slice(0, 10),
          usd: initialData.usd ?? 0,
          afn: initialData.afn ?? 0
        })
      } else {
        setForm({
          date: new Date().toISOString().slice(0, 10),
          usd: 0,
          afn: 0
        })
      }
    }
  }, [open, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'date' ? value : parseFloat(value) || 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/storage/set', {
        date: form.date,
        usd: form.usd,
        afn: form.afn
      })
      if (data.success) {
        toast.success('دخل با موفقیت ذخیره شد')
        onSuccess()
        onClose()
      } else {
        toast.error(data.message ?? 'خطا')
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

  return (
    <Modal open={open} onClose={onClose} title="ثبت دخل انبار" size="default">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="تاریخ">
            <PersianDatePicker
              value={form.date || null}
              onChange={(v) => setForm((f) => ({ ...f, date: v ?? '' }))}
              className="input-luxury w-full"
            />
          </FormField>
          <FormField label="دلار (USD)">
            <input
              type="number"
              step="0.01"
              name="usd"
              className="input-luxury w-full"
              value={form.usd || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </FormField>
          <FormField label="افغانی (AFN)">
            <input
              type="number"
              step="0.01"
              name="afn"
              className="input-luxury w-full"
              value={form.afn || ''}
              onChange={handleChange}
              placeholder="0"
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
            {submitting ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
