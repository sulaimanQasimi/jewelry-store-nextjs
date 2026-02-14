'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface TraderFormData {
  id?: number
  name: string
  phone: string
  address: string | null
}

interface TraderFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: TraderFormData | null
  onSuccess: () => void
}

const emptyForm: TraderFormData = {
  name: '',
  phone: '',
  address: ''
}

export default function TraderFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: TraderFormModalProps) {
  const [form, setForm] = useState<TraderFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          name: initialData.name ?? '',
          phone: initialData.phone ?? '',
          address: initialData.address ?? ''
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.phone?.trim()) {
      toast.error('نام و شماره تماس الزامی است')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/trader/update/${initialData.id}`, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address?.trim() || null
        })
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/trader/create', {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address?.trim() || null
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

  const title = mode === 'edit' ? 'ویرایش معامله‌دار' : 'افزودن معامله‌دار'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="نام">
            <input
              name="name"
              className="input-luxury w-full"
              value={form.name}
              onChange={handleChange}
              placeholder="نام معامله‌دار"
            />
          </FormField>
          <FormField label="شماره تماس">
            <input
              name="phone"
              className="input-luxury w-full phone-ltr"
              dir="ltr"
              value={form.phone}
              onChange={handleChange}
              placeholder="شماره تماس"
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="آدرس">
              <input
                name="address"
                className="input-luxury w-full"
                value={form.address ?? ''}
                onChange={handleChange}
                placeholder="آدرس (اختیاری)"
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
