'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Building2, ChevronDown, Loader2, X } from 'lucide-react'

export interface SupplierOption {
  id: number
  name: string
}

interface SupplierComboboxProps {
  value: number
  selectedSupplier: SupplierOption | null
  onChange: (supplierId: number, supplier: SupplierOption | null) => void
  placeholder?: string
  label?: string
  className?: string
  'aria-label'?: string
}

const DEBOUNCE_MS = 280

export default function SupplierCombobox({
  value,
  selectedSupplier,
  onChange,
  placeholder = 'جستجوی تمویل‌کننده',
  label = 'تمویل‌کننده',
  className = '',
  'aria-label': ariaLabel = 'انتخاب تمویل‌کننده'
}: SupplierComboboxProps) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<SupplierOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuppliers = useCallback(async (search: string) => {
    setLoading(true)
    try {
      const { data } = await axios.get<{ success?: boolean; data?: SupplierOption[] }>(
        '/api/supplier/get-all',
        { params: { search: search.trim() || undefined, limit: 20 } }
      )
      const list = Array.isArray(data?.data) ? data.data : []
      setOptions(list.map((s) => ({ id: s.id, name: (s as any).name ?? '' })))
      setHighlightIndex(list.length > 0 ? 0 : -1)
    } catch {
      setOptions([])
      setHighlightIndex(-1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuppliers(query)
      debounceRef.current = null
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuppliers])

  const select = useCallback(
    (supplier: SupplierOption) => {
      onChange(supplier.id, supplier)
      setQuery('')
      setOptions([])
      setOpen(false)
      setHighlightIndex(-1)
      inputRef.current?.blur()
    },
    [onChange]
  )

  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange(0, null)
      setQuery('')
      setOptions([])
      setOpen(false)
      inputRef.current?.focus()
    },
    [onChange]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setOpen(true)
          setHighlightIndex((i) => (i < options.length - 1 ? i + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setOpen(true)
          setHighlightIndex((i) => (i > 0 ? i - 1 : options.length - 1))
          break
        case 'Enter':
          if (open && options[highlightIndex]) {
            e.preventDefault()
            select(options[highlightIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          setHighlightIndex(-1)
          inputRef.current?.blur()
          break
        default:
          break
      }
    },
    [open, options, highlightIndex, select]
  )

  useEffect(() => {
    if (open && listRef.current && highlightIndex >= 0) {
      const el = listRef.current.querySelector(`[data-index="${highlightIndex}"]`)
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, highlightIndex])

  const showList = open && (query.trim() !== '' || options.length > 0)
  const displayValue = selectedSupplier ? selectedSupplier.name : ''

  return (
    <div className={`min-w-[200px] ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`
            flex items-center gap-2 rounded-xl border bg-white dark:bg-slate-800/90
            border-slate-300 dark:border-slate-600
            focus-within:border-amber-500 dark:focus-within:border-amber-500
            focus-within:ring-2 focus-within:ring-amber-500/20
            shadow-sm transition-all duration-200
          `}
        >
          <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mr-2 pointer-events-none" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={selectedSupplier ? displayValue : query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              if (selectedSupplier) onChange(0, null)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 180)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            readOnly={!!selectedSupplier}
            autoComplete="off"
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls="supplier-combobox-list"
            aria-activedescendant={highlightIndex >= 0 ? `supplier-option-${highlightIndex}` : undefined}
            className="input-luxury flex-1 min-w-0 border-0 bg-transparent focus:ring-0 focus:outline-none py-2.5 pr-2 pl-10 read-only:cursor-default"
          />
          {selectedSupplier ? (
            <button
              type="button"
              onClick={clear}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg shrink-0"
              aria-label="پاک کردن انتخاب"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 mr-2 transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden
            />
          )}
        </div>
        {showList && (
          <ul
            ref={listRef}
            id="supplier-combobox-list"
            role="listbox"
            className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl py-1"
          >
            {loading ? (
              <li className="flex items-center justify-center gap-2 py-6 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>در حال بارگذاری...</span>
              </li>
            ) : options.length === 0 ? (
              <li className="py-4 text-center text-sm text-slate-500">تمویل‌کننده یافت نشد</li>
            ) : (
              options.map((s, i) => (
                <li key={s.id} role="option" data-index={i} id={`supplier-option-${i}`}>
                  <button
                    type="button"
                    onClick={() => select(s)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`
                      w-full text-right py-3 px-4 flex items-center gap-3 transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset
                      ${highlightIndex === i ? 'bg-amber-50 dark:bg-amber-900/20 text-slate-900 dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'}
                    `}
                    aria-selected={highlightIndex === i}
                  >
                    <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-slate-400 mr-auto">#{s.id}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
