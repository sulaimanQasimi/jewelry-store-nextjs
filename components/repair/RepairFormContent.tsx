'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CustomerCombobox from '@/components/ui/CustomerCombobox'
import type { CustomerOption } from '@/components/ui/CustomerCombobox'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import { Wrench, Calendar, FileText, Coins } from 'lucide-react'

export interface RepairFormData {
  id?: number
  customer_id: number
  customer_name: string
  customer_phone: string
  product_description: string
  incoming_notes: string
  estimated_cost: number | null
  currency: string
  status: string
  due_date: string | null
}

const inputBase =
  'input-luxury w-full pe-10 rounded-xl border border-amber-100 dark:border-slate-600 bg-white dark:bg-slate-800/80 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-500/40 focus:border-amber-300 dark:focus:border-amber-500/60 transition-all duration-200'

const STATUS_OPTIONS = [
  { value: 'received', label: 'دریافت شده' },
  { value: 'in_progress', label: 'در دست تعمیر' },
  { value: 'ready', label: 'آماده تحویل' },
  { value: 'delivered', label: 'تحویل داده شده' },
  { value: 'cancelled', label: 'لغو شده' }
]

export interface RepairFormContentProps {
  mode: 'create' | 'edit'
  initialData: RepairFormData | null
  onSuccess: () => void
  onCancel: () => void
}

export default function RepairFormContent({
  mode,
  initialData,
  onSuccess,
  onCancel
}: RepairFormContentProps) {
  const [customerId, setCustomerId] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null)
  const [form, setForm] = useState<RepairFormData>({
    customer_id: 0,
    customer_name: '',
    customer_phone: '',
    product_description: '',
    incoming_notes: '',
    estimated_cost: null,
    currency: 'AFN',
    status: 'received',
    due_date: null
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        id: initialData.id,
        customer_id: initialData.customer_id ?? 0,
        customer_name: initialData.customer_name ?? '',
        customer_phone: initialData.customer_phone ?? '',
        product_description: initialData.product_description ?? '',
        incoming_notes: initialData.incoming_notes ?? '',
        estimated_cost: initialData.estimated_cost ?? null,
        currency: initialData.currency ?? 'AFN',
        status: initialData.status ?? 'received',
        due_date: initialData.due_date ?? null
      })
      setCustomerId(initialData.customer_id ?? 0)
      setSelectedCustomer(
        initialData.customer_name
          ? {
              id: initialData.customer_id,
              customerName: initialData.customer_name,
              phone: initialData.customer_phone
            }
          : null
      )
    } else {
      setForm({
        customer_id: 0,
        customer_name: '',
        customer_phone: '',
        product_description: '',
        incoming_notes: '',
        estimated_cost: null,
        currency: 'AFN',
        status: 'received',
        due_date: null
      })
      setCustomerId(0)
      setSelectedCustomer(null)
    }
  }, [mode, initialData])

  const handleCustomerChange = (id: number, customer: CustomerOption | null) => {
    setCustomerId(id)
    setSelectedCustomer(customer)
    setForm((prev) => ({
      ...prev,
      customer_id: id,
      customer_name: customer?.customerName ?? '',
      customer_phone: customer?.phone ?? ''
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'estimated_cost' ? (value === '' ? null : parseFloat(value) || null) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name?.trim() || !form.customer_phone?.trim()) {
      toast.error('نام و تلفن مشتری الزامی است')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        customer_id: form.customer_id || customerId,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        product_description: form.product_description,
        incoming_notes: form.incoming_notes,
        estimated_cost: form.estimated_cost,
        currency: form.currency,
        status: form.status,
        due_date: form.due_date || null
      }
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/repairs/update/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
        } else toast.error(data.message ?? 'خطا')
      } else {
        const { data } = await axios.post('/api/repairs/create', payload)
        if (data.success) {
          toast.success(data.message ?? 'ثبت شد')
          onSuccess()
        } else toast.error(data.message ?? 'خطا')
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
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div>
        <CustomerCombobox
          value={customerId}
          selectedCustomer={selectedCustomer}
          onChange={handleCustomerChange}
          label="مشتری"
          placeholder="جستجوی مشتری"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">نام مشتری</label>
          <input
            name="customer_name"
            type="text"
            className={inputBase}
            value={form.customer_name}
            onChange={handleChange}
            placeholder="در صورت عدم انتخاب از لیست"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">تلفن</label>
          <input
            name="customer_phone"
            type="text"
            className={inputBase + ' phone-ltr'}
            value={form.customer_phone}
            onChange={handleChange}
            dir="ltr"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat flex items-center gap-2">
          <FileText className="w-4 h-4" /> توضیحات جنس / کار تعمیر
        </label>
        <textarea
          name="product_description"
          className={inputBase + ' min-h-[80px]'}
          value={form.product_description}
          onChange={handleChange}
          placeholder="شرح جنس یا کار درخواستی"
          rows={3}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">یادداشت ورود</label>
        <textarea
          name="incoming_notes"
          className={inputBase + ' min-h-[60px]'}
          value={form.incoming_notes}
          onChange={handleChange}
          placeholder="اختیاری"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat flex items-center gap-2">
            <Coins className="w-4 h-4" /> هزینه تخمینی
          </label>
          <input
            name="estimated_cost"
            type="number"
            step="0.01"
            min="0"
            className={inputBase}
            value={form.estimated_cost ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat">واحد پول</label>
          <select name="currency" className={inputBase} value={form.currency} onChange={handleChange}>
            <option value="AFN">افغانی</option>
            <option value="USD">دلار</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat flex items-center gap-2">
            <Calendar className="w-4 h-4" /> تاریخ تحویل پیش‌بینیشده
          </label>
          <PersianDatePicker
            value={form.due_date}
            onChange={(v) => setForm((f) => ({ ...f, due_date: v }))}
            className={inputBase}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 font-stat flex items-center gap-2">
            <Wrench className="w-4 h-4" /> وضعیت
          </label>
          <select name="status" className={inputBase} value={form.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="min-w-[120px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:opacity-70 font-stat"
        >
          {submitting ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </div>
    </form>
  )
}
