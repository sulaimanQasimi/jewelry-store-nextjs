'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, TelegramIcon } from '@/components/icons/SocialIcons'

export interface CustomerFormData {
  id?: number
  customerName: string
  phone: string
  email: string | null
  address: string | null
  image?: string | null
  secondaryPhone?: string | null
  companyName?: string | null
  notes?: string | null
  birthDate?: string | null
  anniversary_date?: string | null
  nationalId?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  whatsappUrl?: string | null
  telegramUrl?: string | null
}

export interface CustomerCreateResponse {
  newCustomer?: { id: number }
}

interface CustomerFormProps {
  mode: 'create' | 'edit'
  initialData?: CustomerFormData | null
  onSuccess: (data?: CustomerCreateResponse) => void
  onCancel: () => void
}

const emptyForm: CustomerFormData = {
  customerName: '',
  phone: '',
  email: '',
  address: '',
  secondaryPhone: '',
  companyName: '',
  notes: '',
  birthDate: '',
  anniversary_date: '',
  nationalId: '',
  facebookUrl: '',
  instagramUrl: '',
  whatsappUrl: '',
  telegramUrl: ''
}

export default function CustomerForm({
  mode,
  initialData,
  onSuccess,
  onCancel
}: CustomerFormProps) {
  const [form, setForm] = useState<CustomerFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        customerName: initialData.customerName ?? '',
        phone: initialData.phone ?? '',
        email: initialData.email ?? '',
        address: initialData.address ?? '',
        image: initialData.image ?? null,
        secondaryPhone: initialData.secondaryPhone ?? '',
        companyName: initialData.companyName ?? '',
        notes: initialData.notes ?? '',
        birthDate: initialData.birthDate ?? '',
        anniversary_date: initialData.anniversary_date ?? '',
        nationalId: initialData.nationalId ?? '',
        facebookUrl: initialData.facebookUrl ?? '',
        instagramUrl: initialData.instagramUrl ?? '',
        whatsappUrl: initialData.whatsappUrl ?? '',
        telegramUrl: initialData.telegramUrl ?? ''
      })
      setImagePreview(initialData.image ? initialData.image : null)
    } else if (mode === 'create') {
      setForm(emptyForm)
      setImagePreview(null)
    }
    setImageFile(null)
  }, [mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value === '' ? null : value }))
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

  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.append('customerName', form.customerName)
    fd.append('phone', form.phone)
    if (form.email) fd.append('email', form.email)
    if (form.address) fd.append('address', form.address)
    if (form.secondaryPhone) fd.append('secondaryPhone', form.secondaryPhone)
    if (form.companyName) fd.append('companyName', form.companyName)
    if (form.notes) fd.append('notes', form.notes)
    if (form.birthDate) fd.append('birthDate', form.birthDate)
    if (form.anniversary_date) fd.append('anniversary_date', form.anniversary_date)
    if (form.nationalId) fd.append('nationalId', form.nationalId)
    if (form.facebookUrl) fd.append('facebookUrl', form.facebookUrl)
    if (form.instagramUrl) fd.append('instagramUrl', form.instagramUrl)
    if (form.whatsappUrl) fd.append('whatsappUrl', form.whatsappUrl)
    if (form.telegramUrl) fd.append('telegramUrl', form.telegramUrl)
    if (imageFile) fd.append('image', imageFile)
    return fd
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.phone.trim()) {
      toast.error('نام و شماره تماس الزامی است')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'create') {
        const fd = buildFormData()
        fd.append('date', new Date().toISOString())
        const { data } = await axios.post('/api/customer/new-customer', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (data.success) {
          toast.success(data.message ?? 'ثبت شد')
          onSuccess(data as CustomerCreateResponse)
        } else toast.error(data.message)
      } else if (initialData?.id) {
        const fd = buildFormData()
        const { data } = await axios.put(`/api/customer/update-customer/${initialData.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (data.success) {
          toast.success(data.message ?? 'آپدیت شد')
          onSuccess()
        } else toast.error(data.message)
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0">
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-luxury text-sm"
              />
            </div>
          </FormField>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="نام مشتری">
            <input
              name="customerName"
              className="input-luxury w-full"
              value={form.customerName}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="شماره تماس">
            <input
              name="phone"
              className="input-luxury w-full phone-ltr"
              dir="ltr"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="ایمیل">
            <input
              type="email"
              name="email"
              className="input-luxury w-full"
              value={form.email ?? ''}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="شماره ثانوی">
            <input
              name="secondaryPhone"
              className="input-luxury w-full phone-ltr"
              dir="ltr"
              value={form.secondaryPhone ?? ''}
              onChange={handleChange}
            />
          </FormField>
        </div>
      </div>

      <FormField label="آدرس">
        <input
          name="address"
          className="input-luxury w-full"
          value={form.address ?? ''}
          onChange={handleChange}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="نام شرکت">
          <input
            name="companyName"
            className="input-luxury w-full"
            value={form.companyName ?? ''}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="تاریخ تولد">
          <input
            type="date"
            name="birthDate"
            className="input-luxury w-full"
            value={form.birthDate ?? ''}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="سالگرد (تاریخ)">
          <input
            type="date"
            name="anniversary_date"
            className="input-luxury w-full"
            value={form.anniversary_date ?? ''}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="شناسه ملی">
          <input
            name="nationalId"
            className="input-luxury w-full"
            value={form.nationalId ?? ''}
            onChange={handleChange}
          />
        </FormField>
      </div>

      <FormField label="یادداشت">
        <textarea
          name="notes"
          className="input-luxury w-full min-h-[80px]"
          value={form.notes ?? ''}
          onChange={handleChange}
        />
      </FormField>

      <div className="border-t border-gold-200 pt-4">
        <p className="text-sm font-medium text-charcoal mb-3">لینک شبکه‌های اجتماعی</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
            <input
              name="facebookUrl"
              className="input-luxury flex-1"
              placeholder="Facebook URL"
              value={form.facebookUrl ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <InstagramIcon className="w-5 h-5 text-[#E4405F]" />
            <input
              name="instagramUrl"
              className="input-luxury flex-1"
              placeholder="Instagram URL"
              value={form.instagramUrl ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            <input
              name="whatsappUrl"
              className="input-luxury flex-1"
              placeholder="WhatsApp URL"
              value={form.whatsappUrl ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <TelegramIcon className="w-5 h-5 text-[#26A5E4]" />
            <input
              name="telegramUrl"
              className="input-luxury flex-1"
              placeholder="Telegram URL"
              value={form.telegramUrl ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gold-200">
        <button type="button" onClick={onCancel} className="btn-luxury btn-luxury-outline px-6 py-2">
          لغو
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
        >
          {submitting ? 'در حال ذخیره...' : mode === 'create' ? 'ثبت مشتری' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  )
}
