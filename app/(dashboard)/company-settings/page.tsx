'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Image, Building2, Phone, Mail, MapPin, Sparkles } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '@/lib/context/AppContext'

const inputBase =
  'w-full ps-3 pe-10 py-3 rounded-xl border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 [&::placeholder]:text-slate-400 [&::placeholder]:opacity-100 dark:[&::placeholder]:text-slate-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-500/40 focus:border-amber-300 dark:focus:border-amber-500/60 outline-none transition-all duration-200 font-stat'

function FieldWithIcon({
  label,
  icon: Icon,
  required,
  children
}: {
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5" dir="rtl">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">
        {label}
        {required && <span className="text-red-500 ms-0.5" aria-hidden>*</span>}
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

interface CompanyFormState {
  companyName: string
  slogan: string
  phone: string
  email: string
  address: string
}

const emptyForm: CompanyFormState = {
  companyName: '',
  slogan: '',
  phone: '',
  email: '',
  address: ''
}

export default function CompanySettingsPage() {
  const { companyData, getCompanyData } = useContext(AppContext) ?? {}
  const [form, setForm] = useState<CompanyFormState>(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        await getCompanyData?.()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [getCompanyData])

  useEffect(() => {
    const data = companyData
    if (data && typeof data === 'object') {
      const row = Array.isArray(data) ? data[0] : data
      if (row) {
        setForm({
          companyName: row.companyName ?? row.CompanyName ?? '',
          slogan: row.slogan ?? '',
          phone: row.phone ?? '',
          email: row.email ?? '',
          address: row.address ?? ''
        })
        const img = row.image ?? row.Image
        if (img) {
          const path = typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')) ? img : `/${img}`
          setLogoPreview(path)
        } else {
          setLogoPreview(null)
        }
      }
    }
  }, [companyData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const processLogoFile = (file: File | null) => {
    if (!file) {
      setLogoFile(null)
      const data = companyData
      const row = data && typeof data === 'object' ? (Array.isArray(data) ? data[0] : data) : null
      const img = row?.image ?? row?.Image
      setLogoPreview(img ? (String(img).startsWith('http') || String(img).startsWith('/') ? img : `/${img}`) : null)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید')
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processLogoFile(e.target.files?.[0] ?? null)
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
    processLogoFile(e.dataTransfer.files?.[0] ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim()) {
      toast.error('نام شرکت الزامی است')
      return
    }
    if (!form.phone.trim()) {
      toast.error('شماره تلفن الزامی است')
      return
    }
    if (!form.address.trim()) {
      toast.error('آدرس الزامی است')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('companyName', form.companyName)
      fd.append('slogan', form.slogan)
      fd.append('phone', form.phone)
      fd.append('email', form.email)
      fd.append('address', form.address)
      if (logoFile) fd.append('image', logoFile)

      const { data } = await axios.post('/api/company/edit-company', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data?.success) {
        toast.success(data.message ?? 'تنظیمات ذخیره شد')
        await getCompanyData?.()
        setLogoFile(null)
      } else {
        toast.error(data?.message ?? 'خطا در ذخیره')
      }
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا در ذخیره'))
    } finally {
      setSaving(false)
    }
  }

  const logoPreviewUrl = logoPreview && (logoPreview.startsWith('blob') || logoPreview.startsWith('http') || logoPreview.startsWith('/'))
    ? logoPreview
    : logoPreview
      ? (typeof window !== 'undefined' ? window.location.origin : '') + logoPreview
      : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-amber-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900/50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <h1 className="font-heading text-2xl font-semibold text-slate-800 dark:text-white">
            تنظیمات شرکت
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-stat">
            اطلاعات برند و تماس شرکت را ویرایش کنید
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Brand Identity */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-600 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600">
                <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
                  هویت برند
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <FieldWithIcon label="نام شرکت" icon={Building2} required>
                  <input
                    name="companyName"
                    type="text"
                    className={inputBase}
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="نام شرکت یا فروشگاه"
                  />
                </FieldWithIcon>
                <FieldWithIcon label="شعار (اختیاری)" icon={Sparkles}>
                  <input
                    name="slogan"
                    type="text"
                    className={inputBase}
                    value={form.slogan}
                    onChange={handleChange}
                    placeholder="شعار برند"
                  />
                </FieldWithIcon>

                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">
                    لوگو
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      min-h-[200px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-8 px-4 cursor-pointer transition-all duration-200
                      ${dragActive
                        ? 'border-amber-400 bg-amber-50/80 dark:bg-amber-900/20'
                        : 'border-amber-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-700/50'
                      }
                    `}
                  >
                    {logoPreviewUrl ? (
                      <>
                        <img
                          src={logoPreviewUrl}
                          alt=""
                          className="max-h-32 max-w-full object-contain rounded-lg border border-amber-100 dark:border-slate-600"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-stat">
                          کلیک یا کشیدن برای تعویض
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                          <Image className="w-8 h-8" strokeWidth={1.75} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat text-center">
                          لوگو را اینجا رها کنید یا کلیک کنید
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500 font-stat">
                          PNG, JPG تا ۵ مگابایت
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Contact & Localization */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-600 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600">
                <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
                  تماس و موقعیت
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <FieldWithIcon label="آدرس" icon={MapPin} required>
                  <input
                    name="address"
                    type="text"
                    className={inputBase}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="آدرس کامل"
                  />
                </FieldWithIcon>
                <FieldWithIcon label="تلفن" icon={Phone} required>
                  <input
                    name="phone"
                    type="tel"
                    className={inputBase + ' phone-ltr'}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="۰۷۸۱۲۳۴۵۶۷"
                    dir="ltr"
                  />
                </FieldWithIcon>
                <FieldWithIcon label="ایمیل" icon={Mail}>
                  <input
                    name="email"
                    type="email"
                    className={inputBase + ' phone-ltr'}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    dir="ltr"
                  />
                </FieldWithIcon>
              </div>
            </section>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto min-w-[220px] py-4 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:outline-none shadow-lg shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 font-stat"
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
