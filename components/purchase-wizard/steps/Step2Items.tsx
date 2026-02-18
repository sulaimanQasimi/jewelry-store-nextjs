'use client'

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Package } from 'lucide-react'
import { categoryOptions } from '../types'
import type { PurchaseWizardState, PurchaseItemRow } from '../types'

const formatNum = (n: number) => Number(n).toLocaleString('fa-IR', { useGrouping: true })

interface Step2ItemsProps {
  state: PurchaseWizardState
  onItemsChange: (items: PurchaseItemRow[]) => void
  onAddItem: () => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, patch: Partial<PurchaseItemRow>) => void
  onNext: () => void
}

export default function Step2Items({
  state,
  onItemsChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onNext
}: Step2ItemsProps) {
  const updateField = useCallback(
    (id: string, field: keyof PurchaseItemRow, value: string | number) => {
      const item = state.items.find((i) => i.id === id)
      if (!item) return
      const patch: Partial<PurchaseItemRow> = { [field]: value }
      if (field === 'weight' || field === 'purchaseRate') {
        const w = field === 'weight' ? Number(value) : item.weight
        const r = field === 'purchaseRate' ? Number(value) : item.purchaseRate
        patch.total = Math.round(w * r * 100) / 100
      }
      onUpdateItem(id, patch)
    },
    [state.items, onUpdateItem]
  )

  const subtotal = state.items.reduce((sum, i) => sum + (i.total || 0), 0)
  const hasValidItems = state.items.some((i) => (i.name?.trim() && (i.weight > 0 || i.purchaseRate > 0)) || i.total > 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        اقلام خرید را با نام، دسته، وزن، عیار و نرخ وارد کنید. جمع هر سطر به‌صورت خودکار محاسبه می‌شود.
      </p>

      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-slate-800 dark:text-white">اقلام</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          افزودن ردیف
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-600">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-700 text-white dark:bg-slate-800">
              <th className="text-right py-3 px-3 font-medium">نام</th>
              <th className="text-right py-3 px-3 font-medium">دسته</th>
              <th className="text-right py-3 px-3 font-medium">وزن (گرم)</th>
              <th className="text-right py-3 px-3 font-medium">عیار</th>
              <th className="text-right py-3 px-3 font-medium">نرخ خرید</th>
              <th className="text-right py-3 px-3 font-medium">جمع</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {state.items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 dark:border-slate-600/50 text-slate-700 dark:text-slate-200"
              >
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateField(item.id, 'name', e.target.value)}
                    placeholder="نام آیتم"
                    className="input-luxury w-full min-w-[120px] border-slate-300 dark:border-slate-600 py-2"
                  />
                </td>
                <td className="py-2 px-3">
                  <select
                    value={item.category}
                    onChange={(e) => updateField(item.id, 'category', e.target.value)}
                    className="input-luxury w-full min-w-[100px] border-slate-300 dark:border-slate-600 py-2"
                  >
                    <option value="">انتخاب</option>
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.weight || ''}
                    onChange={(e) => updateField(item.id, 'weight', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-luxury w-full min-w-[80px] border-slate-300 dark:border-slate-600 py-2"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.carat || ''}
                    onChange={(e) => updateField(item.id, 'carat', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-luxury w-full min-w-[70px] border-slate-300 dark:border-slate-600 py-2"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.purchaseRate || ''}
                    onChange={(e) => updateField(item.id, 'purchaseRate', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-luxury w-full min-w-[90px] border-slate-300 dark:border-slate-600 py-2"
                  />
                </td>
                <td className="py-2 px-3 font-medium tabular-nums" dir="ltr">
                  {formatNum(item.total)}
                </td>
                <td className="py-2 px-1">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    disabled={state.items.length <= 1}
                    className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-40 rounded-lg"
                    aria-label="حذف ردیف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <p className="text-slate-600 dark:text-slate-400">
          جمع کل اقلام: <span className="font-semibold text-slate-800 dark:text-white tabular-nums" dir="ltr">{formatNum(subtotal)}</span>
        </p>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!hasValidItems}
          whileTap={hasValidItems ? { scale: 0.98 } : undefined}
          className="px-6 py-2.5 rounded-xl font-semibold bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          مرحله بعد: پرداخت
        </motion.button>
      </div>
    </motion.div>
  )
}
