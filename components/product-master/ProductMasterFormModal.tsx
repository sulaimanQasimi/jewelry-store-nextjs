'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface ProductMasterFormData {
  id?: number
  name: string
  type: string
  gram: number | string
  karat: number | string
  isActive?: boolean
}

interface ProductMasterFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: ProductMasterFormData | null
  onSuccess: () => void
}

const emptyForm: ProductMasterFormData = {
  name: '',
  type: '',
  gram: '',
  karat: '',
  isActive: true
}

export default function ProductMasterFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: ProductMasterFormModalProps) {
  const [form, setForm] = useState<ProductMasterFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          name: initialData.name ?? '',
          type: initialData.type ?? '',
          gram: initialData.gram ?? '',
          karat: initialData.karat ?? '',
          isActive: initialData.isActive !== false
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
    if (!form.name?.trim() || !form.type?.trim()) {
      toast.error('نام و نوع الزامی است')
      return
    }
    const g = parseFloat(String(form.gram))
    const k = parseFloat(String(form.karat))
    if (isNaN(g) || isNaN(k) || g <= 0 || k <= 0) {
      toast.error('وزن و عیار باید عدد مثبت باشد')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/product-master/update/${initialData.id}`, {
          name: form.name.trim(),
          type: form.type.trim(),
          gram: g,
          karat: k,
          isActive: form.isActive !== false
        })
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/product-master/create', {
          name: form.name.trim(),
          type: form.type.trim(),
          gram: g,
          karat: k,
          isActive: form.isActive !== false
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

  const title = mode === 'edit' ? 'ویرایش محصول اصلی' : 'افزودن محصول اصلی'

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
              placeholder="نام محصول"
            />
          </FormField>
          <FormField label="نوع">
            <input
              name="type"
              className="input-luxury w-full"
              value={form.type}
              onChange={handleChange}
              placeholder="نوع محصول"
            />
          </FormField>
          <FormField label="وزن (گرام)">
            <input
              name="gram"
              type="number"
              step="0.01"
              min="0"
              className="input-luxury w-full"
              value={form.gram}
              onChange={handleChange}
              placeholder="وزن به گرم"
            />
          </FormField>
          <FormField label="عیار">
            <input
              name="karat"
              type="number"
              step="0.01"
              min="0"
              className="input-luxury w-full"
              value={form.karat}
              onChange={handleChange}
              placeholder="عیار"
            />
          </FormField>
          {mode === 'edit' && (
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="pm-isActive"
                checked={form.isActive !== false}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gold-200"
              />
              <label htmlFor="pm-isActive" className="text-sm text-charcoal">
                فعال
              </label>
            </div>
          )}
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
