'use client'

import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, FileText, Calendar, Upload } from 'lucide-react'
import SupplierCombobox from '@/components/ui/SupplierCombobox'
import type { SupplierOption } from '@/components/ui/SupplierCombobox'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import type { PurchaseWizardState } from '../types'

interface Step1SupplierBillProps {
  state: PurchaseWizardState
  onSupplierChange: (id: number, supplier: SupplierOption | null) => void
  onBillChange: (billNumber: string, purchaseDate: string) => void
  onFileChange: (file: File | null) => void
  onNext: () => void
}

export default function Step1SupplierBill({
  state,
  onSupplierChange,
  onBillChange,
  onFileChange,
  onNext
}: Step1SupplierBillProps) {
  const [dragOver, setDragOver] = useState(false)
  const selectedSupplier: SupplierOption | null =
    state.supplierId && state.supplierName ? { id: state.supplierId, name: state.supplierName } : null

  const canNext = state.supplierId > 0 && state.supplierName.trim() !== '' && state.billNumber.trim() !== '' && state.purchaseDate.trim() !== ''

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) onFileChange(file)
      else if (file) onFileChange(file)
    },
    [onFileChange]
  )
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      onFileChange(file ?? null)
    },
    [onFileChange]
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        تمویل‌کننده، شماره بل و تاریخ خرید را وارد کنید. اختیاری: اسکن فاکتور را آپلود کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SupplierCombobox
          value={state.supplierId}
          selectedSupplier={selectedSupplier}
          onChange={onSupplierChange}
          placeholder="جستجوی تمویل‌کننده"
          label="تمویل‌کننده"
        />
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            شماره بل (شناسه مرجع)
          </label>
          <div className="relative">
            <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              value={state.billNumber}
              onChange={(e) => onBillChange(e.target.value, state.purchaseDate)}
              placeholder="شماره بل"
              className="input-luxury w-full pl-10 rounded-xl border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            تاریخ خرید
          </label>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <PersianDatePicker
              value={state.purchaseDate || null}
              onChange={(v) => onBillChange(state.billNumber, v ?? '')}
              className="input-luxury w-full pl-10 rounded-xl border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          اسکن فاکتور / رسید (اختیاری)
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${dragOver ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}
          `}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            فایل را اینجا بکشید و رها کنید یا کلیک کنید برای انتخاب
          </p>
          {state.invoiceFile && (
            <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              {state.invoiceFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          whileTap={canNext ? { scale: 0.98 } : undefined}
          className="px-6 py-2.5 rounded-xl font-semibold bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          مرحله بعد: اقلام
        </motion.button>
      </div>
    </motion.div>
  )
}
