'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from '@/components/ui/Modal'
import FormField from '@/components/ui/FormField'

export interface UserFormData {
  id?: number
  username: string
  email: string
  password?: string
  role: 'admin' | 'user'
  is_active?: boolean
}

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: UserFormData | null
  onSuccess: () => void
}

const emptyForm: UserFormData = {
  username: '',
  email: '',
  password: '',
  role: 'admin',
  is_active: true
}

export default function UserFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: UserFormModalProps) {
  const [form, setForm] = useState<UserFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          id: initialData.id,
          username: initialData.username ?? '',
          email: initialData.email ?? '',
          password: '',
          role: initialData.role === 'user' ? 'user' : 'admin',
          is_active: initialData.is_active ?? true
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, mode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username?.trim() || !form.email?.trim()) {
      toast.error('نام کاربری و ایمیل الزامی است')
      return
    }
    if (mode === 'create' && !form.password) {
      toast.error('رمز عبور الزامی است')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialData?.id) {
        const payload: { username: string; email: string; role: string; is_active: boolean; password?: string } = {
          username: form.username.trim(),
          email: form.email.trim(),
          role: form.role,
          is_active: form.is_active ?? true
        }
        if (form.password?.trim()) payload.password = form.password.trim()
        const { data } = await axios.put(`/api/users/update/${initialData.id}`, payload)
        if (data.success) {
          toast.success(data.message ?? 'به‌روزرسانی شد')
          onSuccess()
          onClose()
        } else {
          toast.error(data.message ?? 'خطا')
        }
      } else {
        const { data } = await axios.post('/api/users/create', {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role
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

  const title = mode === 'edit' ? 'ویرایش کاربر' : 'افزودن کاربر'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="نام کاربری">
            <input
              name="username"
              className="input-luxury w-full"
              value={form.username}
              onChange={handleChange}
              placeholder="نام کاربری"
            />
          </FormField>
          <FormField label="ایمیل">
            <input
              name="email"
              type="email"
              className="input-luxury w-full"
              dir="ltr"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </FormField>
          <FormField label={mode === 'create' ? 'رمز عبور' : 'رمز عبور جدید (خالی = بدون تغییر)'}>
            <input
              name="password"
              type="password"
              className="input-luxury w-full"
              value={form.password ?? ''}
              onChange={handleChange}
              placeholder={mode === 'edit' ? 'خالی بگذارید تا تغییر نکند' : 'رمز عبور'}
            />
          </FormField>
          <FormField label="نقش">
            <select
              name="role"
              className="input-luxury w-full"
              value={form.role}
              onChange={handleChange}
            >
              <option value="admin">مدیر</option>
              <option value="user">کاربر</option>
            </select>
          </FormField>
          {mode === 'edit' && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                name="is_active"
                type="checkbox"
                id="user-is-active"
                checked={form.is_active ?? true}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="user-is-active" className="text-sm font-medium text-charcoal">
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
