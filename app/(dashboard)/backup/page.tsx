'use client'

import React, { useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DatabaseBackup, Upload, Loader2 } from 'lucide-react'

export default function BackupPage() {
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackup = async () => {
    setBackupLoading(true)
    try {
      const { data } = await axios.post('/api/backup/backup')
      if (data?.success) {
        toast.success(data.message ?? 'پشتیبان با موفقیت ایجاد شد')
      } else {
        toast.error(data?.message ?? 'خطا در ایجاد پشتیبان')
      }
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا در ایجاد پشتیبان'))
    } finally {
      setBackupLoading(false)
    }
  }

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRestoreLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axios.post('/api/backup/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data?.success) {
        toast.success(data.message ?? 'بازیابی با موفقیت انجام شد')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        toast.error(data?.message ?? 'خطا در بازیابی')
      }
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا در بازیابی'))
    } finally {
      setRestoreLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="w-full py-8 px-4 sm:px-8 md:px-16" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">پشتیبان و بازیابی</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-600">
            <DatabaseBackup className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">ایجاد پشتیبان</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            یک نسخه پشتیبان از داده‌های فعلی روی سرور ذخیره می‌شود (پوشه backups).
          </p>
          <button
            type="button"
            onClick={handleBackup}
            disabled={backupLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {backupLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ایجاد...
              </>
            ) : (
              <>
                <DatabaseBackup className="w-5 h-5" />
                ایجاد پشتیبان
              </>
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-600">
            <Upload className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">بازیابی از پشتیبان</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            فایل JSON پشتیبان (خروجی همین سیستم) را انتخاب کنید. داده‌های فعلی با محتوای فایل جایگزین می‌شوند.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleRestore}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={restoreLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/50 border border-amber-300 dark:border-amber-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {restoreLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال بازیابی...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                انتخاب فایل و بازیابی
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
