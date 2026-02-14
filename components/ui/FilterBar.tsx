'use client'

import React from 'react'
import FormField from './FormField'

export interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  extraFilters?: React.ReactNode
  onReset?: () => void
}

export default function FilterBar(props: FilterBarProps) {
  const {
    search = '',
    onSearchChange,
    searchPlaceholder = 'جستجو...',
    extraFilters,
    onReset
  } = props

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gold-200/60 dark:border-slate-600/50 bg-white dark:bg-slate-800/80 p-4 shadow-sm">
      {onSearchChange != null && (
        <FormField label="جستجو">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="input-luxury min-w-[200px]"
          />
        </FormField>
      )}
      {extraFilters}
      {onReset != null && (
        <button
          type="button"
          onClick={onReset}
          className="btn-luxury btn-luxury-outline py-2 px-4"
        >
          پاک کردن فیلتر
        </button>
      )}
    </div>
  )
}
