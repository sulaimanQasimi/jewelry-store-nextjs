'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface ProductFormData {
  id?: number
  productName: string
  type: string
  gram: number
  karat: number
  purchasePriceToAfn?: number
  bellNumber?: number | null
  wage?: number | null
  auns?: number | null
  barcode?: string
  image?: string | null
  isSold?: boolean
}

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: ProductFormData | null
  onSuccess: () => void
}

const emptyForm: ProductFormData = {
  productName: '',
  type: '',
  gram: 0,
  karat: 0,
  wage: 0,
  auns: 0,
  bellNumber: null
}

export default function ProductFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          id: initialData.id,
          productName: initialData.productName ?? '',
          type: initialData.type ?? '',
          gram: Number(initialData.gram) || 0,
          karat: Number(initialData.karat) || 0,
          purchasePriceToAfn: initialData.purchasePriceToAfn,
          bellNumber: initialData.bellNumber ?? null,
          wage: initialData.wage ?? 0,
          auns: initialData.auns ?? 0,
          barcode: initialData.barcode ?? '',
          image: initialData.image ?? null
        })
        setImagePreview(initialData.image ? initialData.image : null)
      } else {
        setForm(emptyForm)
        setImagePreview(null)
      }
      setImageFile(null)
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const numKeys = ['gram', 'karat', 'wage', 'auns', 'bellNumber', 'purchasePriceToAfn']
    setForm((prev) => ({
      ...prev,
      [name]: numKeys.includes(name) ? (value === '' ? (name === 'bellNumber' ? null : 0) : parseFloat(value) || 0) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImageFile(null)
      setImagePreview(mode === 'edit' && initialData?.image ? (initialData.image as string) : null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.productName.trim()) {
      toast.error('نام جنس الزامی است')
      return
    }
    if (form.gram <= 0 || form.karat <= 0) {
      toast.error('وزن و عیار باید بزرگتر از صفر باشند')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'create') {
        const fd = new FormData()
        fd.append('productName', form.productName)
        fd.append('type', form.type)
        fd.append('gram', String(form.gram))
        fd.append('karat', String(form.karat))
        fd.append('wage', String(form.wage ?? 0))
        fd.append('auns', String(form.auns ?? 0))
        if (form.bellNumber != null) fd.append('bellNumber', String(form.bellNumber))
        if (imageFile) fd.append('image', imageFile)
        const { data } = await axios.post('/api/product/new-product', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (data.success) {
          toast.success(data.message ?? 'ثبت شد')
          onSuccess()
          onClose()
        } else toast.error(data.message)
      } else if (initialData?.id) {
        const { data } = await axios.put(`/api/product/${initialData.id}`, {
          productName: form.productName,
          type: form.type,
          gram: form.gram,
          karat: form.karat,
          purchasePriceToAfn: form.purchasePriceToAfn ?? 0,
          bellNumber: form.bellNumber ?? null,
          wage: form.wage ?? null,
          auns: form.auns ?? null
        })
        if (data.success) {
          toast.success('محصول به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else toast.error(data.message)
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا'))
    } finally {
      setSubmitting(false)
    }
  }

  const title = mode === 'create' ? 'افزودن جنس' : 'ویرایش جنس'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="نام جنس">
            <input
              name="productName"
              className="input-luxury w-full"
              value={form.productName}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="نوع">
            <input name="type" className="input-luxury w-full" value={form.type} onChange={handleChange} placeholder="مثال: انگشتر" />
          </FormField>
          <FormField label="وزن (گرام)">
            <input
              name="gram"
              type="number"
              step="any"
              min="0"
              className="input-luxury w-full"
              value={form.gram || ''}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="عیار">
            <input
              name="karat"
              type="number"
              step="any"
              min="0"
              className="input-luxury w-full"
              value={form.karat || ''}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="اجرت">
            <input name="wage" type="number" step="any" min="0" className="input-luxury w-full" value={form.wage || ''} onChange={handleChange} />
          </FormField>
          <FormField label="اونس">
            <input name="auns" type="number" step="any" min="0" className="input-luxury w-full" value={form.auns || ''} onChange={handleChange} />
          </FormField>
          <FormField label="شماره بل">
            <input
              name="bellNumber"
              type="number"
              className="input-luxury w-full"
              value={form.bellNumber ?? ''}
              onChange={handleChange}
              placeholder="اختیاری"
            />
          </FormField>
          {mode === 'edit' && (
            <>
              <FormField label="قیمت خرید (افغانی)">
                <input
                  name="purchasePriceToAfn"
                  type="number"
                  step="any"
                  min="0"
                  className="input-luxury w-full"
                  value={form.purchasePriceToAfn ?? ''}
                  onChange={handleChange}
                />
              </FormField>
              {form.barcode && (
                <FormField label="بارکود">
                  <input name="barcode" className="input-luxury w-full bg-gold-50" value={form.barcode} readOnly dir="ltr" />
                </FormField>
              )}
            </>
          )}
        </div>

        <FormField label="عکس">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-2 border-gold-200 bg-gold-50/50 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={
                    imagePreview.startsWith('blob') || imagePreview.startsWith('http')
                      ? imagePreview
                      : (typeof window !== 'undefined' ? window.location.origin : '') + imagePreview
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-charcoal-soft text-sm">بدون عکس</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="input-luxury text-sm" disabled={mode === 'edit'} />
            {mode === 'edit' && <span className="text-charcoal-soft text-xs">تغییر عکس در ویرایش پشتیبانی نمی‌شود</span>}
          </div>
        </FormField>

        <div className="flex gap-3 justify-end pt-4 border-t border-gold-200">
          <button type="button" onClick={onClose} className="btn-luxury btn-luxury-outline px-6 py-2">
            لغو
          </button>
          <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60">
            {submitting ? 'در حال ذخیره...' : mode === 'create' ? 'ثبت جنس' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
