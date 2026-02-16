'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface PersonalExpenseFormData {
  id?: number
  name: string
  personId: number | string
  amount: number | string
  currency: string
  detail: string | null
}

interface PersonalExpenseFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: PersonalExpenseFormData | null
  onSuccess: () => void
}

const emptyForm: PersonalExpenseFormData = {
  name: '',
  personId: '',
  amount: '',
  currency: 'افغانی',
  detail: ''
}

export default function PersonalExpenseFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: PersonalExpenseFormModalProps) {
  const [form, setForm] = useState<PersonalExpenseFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [persons, setPersons] = useState<{ id: number; name: string; phone: string }[]>([])

  useEffect(() => {
    if (open) {
      axios.get<{ success?: boolean; data?: { id: number; name: string; phone: string }[] }>('/api/person/list', { params: { limit: 500 } })
        .then(({ data: res }) => {
          setPersons(Array.isArray(res?.data) ? res.data : [])
        })
        .catch(() => setPersons([]))
    }
  }, [open])

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          name: initialData.name ?? '',
          personId: initialData.personId ?? '',
          amount: initialData.amount ?? '',
          currency: initialData.currency ?? 'افغانی',
          detail: initialData.detail ?? ''
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.personId) {
      toast.error('نام و شخص الزامی است')
      return
    }
    const amt = parseFloat(String(form.amount))
    if (isNaN(amt) || amt <= 0) {
      toast.error('مبلغ باید عدد مثبت باشد')
      return
    }
    if (!form.currency?.trim()) {
      toast.error('واحد پول الزامی است')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        personId: parseInt(String(form.personId)),
        amount: amt,
        currency: form.currency.trim(),
        detail: form.detail?.trim() || null
      }
      if (mode === 'edit' && initialData?.id) {
        const { data } = await axios.put(`/api/personal-expense/update/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/personal-expense/create', payload)
        if (data.success) {
          toast.success(data.message ?? 'ذخیره شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    } finally {
      setSubmitting(false)
    }
  }

  const title = mode === 'edit' ? 'ویرایش مصرف شخصی' : 'افزودن مصرف شخصی'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="نام">
            <input name="name" className="input-luxury w-full" value={form.name} onChange={handleChange} placeholder="نام مصرف" />
          </FormField>
          <FormField label="شخص">
            <select name="personId" className="input-luxury w-full" value={form.personId} onChange={handleChange} required>
              <option value="">انتخاب شخص...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.name} - {p.phone}</option>
              ))}
            </select>
          </FormField>
          <FormField label="مبلغ">
            <input name="amount" type="number" step="0.01" min="0" className="input-luxury w-full" value={form.amount} onChange={handleChange} placeholder="مبلغ" />
          </FormField>
          <FormField label="واحد پول">
            <select name="currency" className="input-luxury w-full" value={form.currency} onChange={handleChange}>
              <option value="افغانی">افغانی</option>
              <option value="دالر">دالر</option>
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="جزئیات">
              <textarea name="detail" className="input-luxury w-full min-h-[80px]" value={form.detail ?? ''} onChange={handleChange} placeholder="جزئیات (اختیاری)" />
            </FormField>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gold-200">
          <button type="button" onClick={onClose} className="btn-luxury btn-luxury-outline px-6 py-2">لغو</button>
          <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60">
            {submitting ? 'در حال ذخیره...' : mode === 'edit' ? 'به‌روزرسانی' : 'ذخیره'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
