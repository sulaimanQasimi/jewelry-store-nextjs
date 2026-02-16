'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    productName: '',
    type: '',
    gram: 0,
    karat: 0,
    wage: 0,
    auns: 0,
    bellNumber: '' as string | number
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numKeys = ['gram', 'karat', 'wage', 'auns', 'bellNumber']
    setForm((prev) => ({
      ...prev,
      [name]: numKeys.includes(name)
        ? value === ''
          ? name === 'bellNumber'
            ? ''
            : 0
          : parseFloat(value) || (name === 'bellNumber' ? value : 0)
        : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImageFile(null)
      setImagePreview(null)
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
      const fd = new FormData()
      fd.append('productName', form.productName)
      fd.append('type', form.type)
      fd.append('gram', String(form.gram))
      fd.append('karat', String(form.karat))
      fd.append('wage', String(form.wage ?? 0))
      fd.append('auns', String(form.auns ?? 0))
      if (form.bellNumber !== '' && form.bellNumber != null) {
        fd.append('bellNumber', String(form.bellNumber))
      }
      if (imageFile) fd.append('image', imageFile)

      const { data } = await axios.post('/api/product/new-product', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) {
        toast.success(data.message ?? 'ثبت شد')
        const id = data.newProduct?.id
        if (id) {
          router.push(`/products/${id}`)
        } else {
          router.push('/products')
        }
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
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-luxury btn-luxury-outline py-2 px-4"
        >
          بازگشت
        </button>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">افزودن جنس</h1>
      </header>

      <form onSubmit={handleSubmit} className="card-luxury p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <input
              name="type"
              className="input-luxury w-full"
              value={form.type}
              onChange={handleChange}
              placeholder="مثال: انگشتر"
            />
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
            <input
              name="wage"
              type="number"
              step="any"
              min="0"
              className="input-luxury w-full"
              value={form.wage || ''}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="اونس">
            <input
              name="auns"
              type="number"
              step="any"
              min="0"
              className="input-luxury w-full"
              value={form.auns || ''}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="شماره بل">
            <input
              name="bellNumber"
              type="number"
              className="input-luxury w-full"
              value={form.bellNumber}
              onChange={handleChange}
              placeholder="اختیاری"
            />
          </FormField>
        </div>

        <FormField label="عکس">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-2 border-gold-200 bg-gold-50/50 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-charcoal-soft text-sm">بدون عکس</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-luxury text-sm"
            />
          </div>
        </FormField>

        <div className="flex gap-3 pt-4 border-t border-gold-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-luxury btn-luxury-outline px-6 py-2"
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال ذخیره...' : 'ثبت جنس'}
          </button>
        </div>
      </form>
    </div>
  )
}
