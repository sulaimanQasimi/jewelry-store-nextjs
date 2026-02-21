'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Tag,
  Layers,
  Scale,
  Sparkles,
  Coins,
  TrendingUp,
  FileText,
  Plus,
  Camera
} from 'lucide-react'
import type { ProductFormData } from './ProductFormModal'

const emptyForm: ProductFormData = {
  productName: '',
  type: '',
  gram: 0,
  karat: 0,
  wage: 0,
  auns: 0,
  bellNumber: null,
  pricing_mode: 'fixed',
  wage_per_gram: null
}

const inputBase =
  'input-luxury w-full pe-10 rounded-xl border border-amber-100 dark:border-slate-600 bg-white dark:bg-slate-800/80 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-500/40 focus:border-amber-300 dark:focus:border-amber-500/60 transition-all duration-200'

function FieldWithIcon({
  label,
  icon: Icon,
  children
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5" dir="rtl">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">
        {label}
      </label>
      <div className="relative">
        {children}
        <span
          className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none text-amber-600/70 dark:text-amber-400/80"
          aria-hidden
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  )
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
  const [dragActive, setDragActive] = useState(false)
  const [suggestedPriceAfn, setSuggestedPriceAfn] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        pricing_mode: initialData.pricing_mode ?? 'fixed',
        wage_per_gram: initialData.wage_per_gram ?? null,
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

  useEffect(() => {
    if (form.pricing_mode !== 'gold_based' || form.gram <= 0 || form.karat <= 0) {
      setSuggestedPriceAfn(null)
      return
    }
    const wagePerGram = form.wage_per_gram ?? 0
    axios
      .get<{ success?: boolean; suggestedPriceAfn?: number | null }>('/api/gold-rate/suggested-price', {
        params: { gram: form.gram, karat: form.karat, wagePerGram }
      })
      .then(({ data }) => {
        setSuggestedPriceAfn(data?.suggestedPriceAfn ?? null)
      })
      .catch(() => setSuggestedPriceAfn(null))
  }, [form.pricing_mode, form.gram, form.karat, form.wage_per_gram])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const numKeys = ['gram', 'karat', 'wage', 'auns', 'bellNumber', 'purchasePriceToAfn', 'wage_per_gram']
    setForm((prev) => ({
      ...prev,
      [name]: numKeys.includes(name) ? (value === '' ? (name === 'bellNumber' || name === 'wage_per_gram' ? null : 0) : parseFloat(value) || 0) : value
    }))
  }

  const processFile = (file: File | null) => {
    if (!file) {
      setImageFile(null)
      setImagePreview(mode === 'edit' && initialData?.image ? (initialData.image as string) : null)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (mode === 'edit') return
    const file = e.dataTransfer.files?.[0]
    processFile(file ?? null)
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
        fd.append('pricing_mode', form.pricing_mode ?? 'fixed')
        if (form.wage_per_gram != null) fd.append('wage_per_gram', String(form.wage_per_gram))
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
          auns: form.auns ?? null,
          pricing_mode: form.pricing_mode ?? 'fixed',
          wage_per_gram: form.wage_per_gram ?? null
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
    <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
      {/* Basic Information */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white border-b border-amber-100 dark:border-slate-600 pb-2">
          اطلاعات پایه
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWithIcon label="نام جنس" icon={Tag}>
            <input
              name="productName"
              className={inputBase}
              value={form.productName}
              onChange={handleChange}
              required
              placeholder="نام جنس را وارد کنید"
            />
          </FieldWithIcon>
          <FieldWithIcon label="نوع" icon={Layers}>
            <input
              name="type"
              className={inputBase}
              value={form.type}
              onChange={handleChange}
              placeholder="مثال: انگشتر"
            />
          </FieldWithIcon>
          <FieldWithIcon label="وزن (گرام)" icon={Scale}>
            <input
              name="gram"
              type="number"
              step="any"
              min="0"
              className={inputBase}
              value={form.gram || ''}
              onChange={handleChange}
              required
            />
          </FieldWithIcon>
          <FieldWithIcon label="عیار" icon={Sparkles}>
            <input
              name="karat"
              type="number"
              step="any"
              min="0"
              className={inputBase}
              value={form.karat || ''}
              onChange={handleChange}
              required
            />
          </FieldWithIcon>
        </div>
      </section>

      {/* Financial & Logistics */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white border-b border-amber-100 dark:border-slate-600 pb-2">
          مالی و لجستیک
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWithIcon label="اجرت" icon={Coins}>
            <input
              name="wage"
              type="number"
              step="any"
              min="0"
              className={inputBase}
              value={form.wage || ''}
              onChange={handleChange}
            />
          </FieldWithIcon>
          <FieldWithIcon label="اونس" icon={TrendingUp}>
            <input
              name="auns"
              type="number"
              step="any"
              min="0"
              className={inputBase}
              value={form.auns || ''}
              onChange={handleChange}
            />
          </FieldWithIcon>
          <div className="flex flex-col gap-1.5" dir="rtl">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">نحوه قیمت‌گذاری</label>
            <select
              name="pricing_mode"
              className={inputBase}
              value={form.pricing_mode ?? 'fixed'}
              onChange={handleChange}
            >
              <option value="fixed">قیمت ثابت</option>
              <option value="gold_based">بر اساس طلا</option>
            </select>
          </div>
          {(form.pricing_mode ?? 'fixed') === 'gold_based' && (
            <>
              <FieldWithIcon label="اجرت هر گرم (افغانی)" icon={Coins}>
                <input
                  name="wage_per_gram"
                  type="number"
                  step="any"
                  min="0"
                  className={inputBase}
                  value={form.wage_per_gram ?? ''}
                  onChange={handleChange}
                  placeholder="اختیاری"
                />
              </FieldWithIcon>
              {suggestedPriceAfn != null && (
                <div className="flex flex-col gap-1.5 rounded-xl border border-amber-200/60 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-900/20 p-3" dir="rtl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">قیمت پیشنهادی (بر اساس نرخ طلا)</span>
                  <span className="text-xl font-bold text-amber-700 dark:text-amber-400 font-stat tabular-nums">
                    {suggestedPriceAfn.toLocaleString('fa-IR')} افغانی
                  </span>
                </div>
              )}
            </>
          )}
          <FieldWithIcon label="شماره بل" icon={FileText}>
            <input
              name="bellNumber"
              type="number"
              className={inputBase}
              value={form.bellNumber ?? ''}
              onChange={handleChange}
              placeholder="اختیاری"
            />
          </FieldWithIcon>
        </div>
      </section>

      {/* Edit-only fields */}
      {mode === 'edit' && (
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white border-b border-amber-100 dark:border-slate-600 pb-2">
            ویرایش
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWithIcon label="قیمت خرید (افغانی)" icon={Coins}>
              <input
                name="purchasePriceToAfn"
                type="number"
                step="any"
                min="0"
                className={inputBase}
                value={form.purchasePriceToAfn ?? ''}
                onChange={handleChange}
              />
            </FieldWithIcon>
            {form.barcode && (
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">بارکود</label>
                <input
                  name="barcode"
                  className={inputBase + ' bg-slate-50 dark:bg-slate-800'}
                  value={form.barcode}
                  readOnly
                  dir="ltr"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Image Upload */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white border-b border-amber-100 dark:border-slate-600 pb-2">
          عکس جنس
        </h2>
        {mode === 'edit' ? (
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl border border-amber-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-sm font-stat">بدون عکس</span>
              )}
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-xs">تغییر عکس در ویرایش پشتیبانی نمی‌شود</span>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative w-full max-w-xs rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center gap-2 py-8 px-6
              ${dragActive
                ? 'border-amber-400 bg-amber-50/80 dark:bg-amber-900/20'
                : 'border-amber-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-700/50'
              }
            `}
          >
            {imagePreviewUrl ? (
              <>
                <img src={imagePreviewUrl} alt="" className="w-24 h-24 rounded-lg object-cover border border-amber-100" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-stat">کلیک یا کشیدن برای تعویض</span>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <Plus className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1.5 text-amber-600/90 dark:text-amber-400/90">
                  <Camera className="w-4 h-4" strokeWidth={1.75} />
                  <span className="text-sm font-medium font-stat">کلیک یا فایل را اینجا رها کنید</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-stat">PNG, JPG تا ۵ مگابایت</span>
              </>
            )}
            </div>
          </>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end pt-6 border-t border-amber-100 dark:border-slate-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 focus:outline-none transition-all duration-200 font-stat"
        >
          لغو
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 disabled:opacity-70 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:outline-none transition-all duration-200 font-stat"
        >
          {submitting ? 'در حال ذخیره...' : mode === 'create' ? 'ثبت جنس' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  )
}
