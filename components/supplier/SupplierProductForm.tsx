'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'

const convertToEnglish = (str: string): string => {
  const map: Record<string, string> = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  }
  return String(str).replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d)
}

const NUMERIC_FIELDS = ['weight', 'karat', 'pasaReceipt', 'wagePerGram', 'wageReceipt']

interface SupplierProductFormProps {
  supplierId: number
  supplierName: string
  onSuccess: () => void
  onCancel?: () => void
}

const initialForm = {
  name: '',
  type: '',
  karat: '',
  weight: '',
  pasa: '',
  pasaReceipt: '',
  pasaRemaining: '',
  wagePerGram: '',
  totalWage: '',
  wageReceipt: '',
  wageRemaining: '',
  detail: ''
}

export default function SupplierProductForm({ supplierId, supplierName, onSuccess, onCancel }: SupplierProductFormProps) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const cleanValue = NUMERIC_FIELDS.includes(name) ? convertToEnglish(value) : value
    setForm((prev) => ({ ...prev, [name]: cleanValue }))
  }

  useEffect(() => {
    const weight = Number(form.weight) || 0
    const karat = Number(form.karat) || 0
    const pasaReceipt = Number(form.pasaReceipt) || 0
    const wagePerGram = Number(form.wagePerGram) || 0
    const wageReceipt = Number(form.wageReceipt) || 0

    const pasa =
      weight && karat
        ? (weight * ((karat * 100 + 12) / 100)) / 23.88
        : 0
    const pasaRemaining = pasa - pasaReceipt
    const totalWage = weight * wagePerGram
    const wageRemaining = totalWage - wageReceipt

    setForm((prev) => ({
      ...prev,
      pasa: pasa ? pasa.toFixed(3) : '',
      pasaRemaining: pasa ? pasaRemaining.toFixed(3) : '',
      totalWage: totalWage ? totalWage.toFixed(2) : '',
      wageRemaining: totalWage ? wageRemaining.toFixed(2) : ''
    }))
  }, [form.weight, form.karat, form.pasaReceipt, form.wagePerGram, form.wageReceipt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.karat || !form.weight) {
      toast.error('لطفاً نام، عیار و وزن را وارد کنید')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/supplier-product/add', {
        supplierId,
        name: form.name.trim(),
        type: form.type.trim() || null,
        karat: Number(form.karat),
        weight: Number(form.weight),
        pasa: Number(form.pasa) || 0,
        pasaReceipt: Number(form.pasaReceipt) || 0,
        pasaRemaining: Number(form.pasaRemaining) || 0,
        wagePerGram: Number(form.wagePerGram) || 0,
        totalWage: Number(form.totalWage) || 0,
        wageReceipt: Number(form.wageReceipt) || 0,
        wageRemaining: Number(form.wageRemaining) || 0,
        detail: form.detail.trim() || null
      })

      if (data.success) {
        toast.success(data.message ?? 'ذخیره شد')
        setForm(initialForm)
        onSuccess()
      } else {
        toast.error(data.message ?? 'خطا')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? err.message ?? 'خطا')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card-luxury bg-white rounded-2xl border border-gold-200/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
        <h3 className="font-heading text-lg font-semibold text-charcoal">ثبت جنس تمویل‌کننده — {supplierName}</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FormField label="نام جنس">
            <input
              name="name"
              className="input-luxury w-full"
              value={form.name}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="نوعیت جنس">
            <input
              name="type"
              className="input-luxury w-full"
              value={form.type}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="عیار">
            <select
              name="karat"
              value={form.karat}
              onChange={handleChange}
              className="input-luxury w-full cursor-pointer"
            >
              <option value="">انتخاب عیار</option>
              <option value="14">14</option>
              <option value="18">18</option>
              <option value="21">21</option>
            </select>
          </FormField>
          <FormField label="وزن">
            <input
              name="weight"
              className="input-luxury w-full"
              value={form.weight}
              onChange={handleChange}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="پاسه">
            <input
              name="pasa"
              className="input-luxury w-full bg-gold-50 read-only:bg-gold-50/80"
              value={form.pasa}
              readOnly
            />
          </FormField>
          <FormField label="رسید پاسه">
            <input
              name="pasaReceipt"
              className="input-luxury w-full"
              value={form.pasaReceipt}
              onChange={handleChange}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="صرف باقی پاسه">
            <input
              name="pasaRemaining"
              className="input-luxury w-full bg-gold-50 read-only:bg-gold-50/80"
              value={form.pasaRemaining}
              readOnly
            />
          </FormField>
          <FormField label="وجوره هر گرم">
            <input
              name="wagePerGram"
              className="input-luxury w-full"
              value={form.wagePerGram}
              onChange={handleChange}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="مجموع وجوره">
            <input
              name="totalWage"
              className="input-luxury w-full bg-gold-50 read-only:bg-gold-50/80"
              value={form.totalWage}
              readOnly
            />
          </FormField>
          <FormField label="رسید وجوره">
            <input
              name="wageReceipt"
              className="input-luxury w-full"
              value={form.wageReceipt}
              onChange={handleChange}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="صرف باقی وجوره">
            <input
              name="wageRemaining"
              className="input-luxury w-full bg-gold-50 read-only:bg-gold-50/80"
              value={form.wageRemaining}
              readOnly
            />
          </FormField>
        </div>
        <div className="mt-5">
          <FormField label="جزئیات (اختیاری)">
            <textarea
              name="detail"
              className="input-luxury w-full min-h-[80px] resize-y"
              value={form.detail}
              onChange={handleChange}
            />
          </FormField>
        </div>
        <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-gold-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-luxury btn-luxury-outline px-6 py-2"
            >
              لغو
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </div>
  )
}
