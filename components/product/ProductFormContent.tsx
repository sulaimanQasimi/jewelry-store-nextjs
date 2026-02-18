'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import type { ProductFormData } from './ProductFormModal'

const emptyForm: ProductFormData = {
  productName: '',
  type: '',
  gram: 0,
  karat: 0,
  wage: 0,
  auns: 0,
  bellNumber: null
}

export interface ProductFormContentProps {
  mode: 'create' | 'edit'
  initialData?: ProductFormData | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductFormContent({
  mode,
  initialData,
  onSuccess,
  onCancel
}: ProductFormContentProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
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
  }, [mode, initialData])

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
        } else toast.error(data.message)
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا'))
    } finally {
      setSubmitting(false)
    }
  }

  const imagePreviewUrl =
    imagePreview &&
    (imagePreview.startsWith('blob') || imagePreview.startsWith('http')
      ? imagePreview
      : (typeof window !== 'undefined' ? window.location.origin : '') + imagePreview)

  return (
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
                <input name="barcode" className="input-luxury w-full bg-gold-50 dark:bg-slate-800" value={form.barcode} readOnly dir="ltr" />
              </FormField>
            )}
          </>
        )}
      </div>

      <FormField label="عکس">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl border-2 border-gold-200 dark:border-slate-600 bg-gold-50/50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden">
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-charcoal-soft dark:text-slate-400 text-sm">بدون عکس</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-luxury text-sm"
            disabled={mode === 'edit'}
          />
          {mode === 'edit' && (
            <span className="text-charcoal-soft dark:text-slate-400 text-xs">تغییر عکس در ویرایش پشتیبانی نمی‌شود</span>
          )}
        </div>
      </FormField>

      <div className="flex gap-3 justify-end pt-4 border-t border-gold-200 dark:border-slate-600">
        <button type="button" onClick={onCancel} className="btn-luxury btn-luxury-outline px-6 py-2">
          لغو
        </button>
        <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60">
          {submitting ? 'در حال ذخیره...' : mode === 'create' ? 'ثبت جنس' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  )
}
