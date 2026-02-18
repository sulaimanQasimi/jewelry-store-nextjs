'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { User, ChevronDown, Loader2, X } from 'lucide-react'

export interface CustomerOption {
  id: number
  customerName: string
  phone: string
}

interface CustomerComboboxProps {
  value: number
  selectedCustomer: CustomerOption | null
  onChange: (customerId: number, customer: CustomerOption | null) => void
  placeholder?: string
  label?: string
  className?: string
  'aria-label'?: string
}

const DEBOUNCE_MS = 280

export default function CustomerCombobox({
  value,
  selectedCustomer,
  onChange,
  placeholder = 'نام، شماره تماس یا شناسه مشتری',
  label = 'مشتری',
  className = '',
  'aria-label': ariaLabel = 'انتخاب مشتری'
}: CustomerComboboxProps) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchCustomers = useCallback(async (search: string) => {
    if (!search.trim()) {
      setOptions([])
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get<{ success?: boolean; data?: CustomerOption[] }>(
        '/api/customer/registered-customers',
        { params: { search: search.trim(), limit: 20 } }
      )
      const list = Array.isArray(data?.data) ? data.data : []
      setOptions(list.map((c) => ({ id: c.id, customerName: (c as any).customerName ?? '', phone: (c as any).phone ?? '' })))
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
      fetchCustomers(query)
      debounceRef.current = null
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchCustomers])

  const select = useCallback(
    (customer: CustomerOption) => {
      onChange(customer.id, customer)
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
  const displayValue = selectedCustomer
    ? `${selectedCustomer.customerName} — ${selectedCustomer.phone}`
    : ''

  return (
    <div className={`min-w-[200px] ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`
            flex items-center gap-2 rounded-xl border bg-white dark:bg-slate-800/90
            shadow-sm transition-all duration-200
            border-slate-200 dark:border-slate-600
            focus-within:border-gold-500 dark:focus-within:border-gold-500
            focus-within:ring-2 focus-within:ring-gold-500/20 dark:focus-within:ring-gold-400/20
            focus-within:shadow-[0_0_0_3px_rgba(255,175,0,0.12)]
          `}
        >
          <User className="w-4 h-4 text-gold-500 shrink-0 mr-2 pointer-events-none" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={selectedCustomer ? displayValue : query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              if (selectedCustomer) onChange(0, null)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 180)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            readOnly={!!selectedCustomer}
            autoComplete="off"
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls="customer-combobox-list"
            aria-activedescendant={highlightIndex >= 0 ? `customer-option-${highlightIndex}` : undefined}
            className="input-luxury flex-1 min-w-0 border-0 bg-transparent focus:ring-0 focus:outline-none py-2.5 pr-2 pl-10 read-only:cursor-default"
          />
          {selectedCustomer ? (
            <button
              type="button"
              onClick={clear}
              className="p-2 text-slate-400 hover:text-charcoal dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg shrink-0"
              aria-label="پاک کردن انتخاب مشتری"
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
            id="customer-combobox-list"
            role="listbox"
            className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gold-200/80 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/30 py-1 luxury-scrollbar"
          >
            {loading ? (
              <li className="flex items-center justify-center gap-2 py-6 text-charcoal-soft dark:text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>در حال بارگذاری...</span>
              </li>
            ) : options.length === 0 ? (
              <li className="py-4 text-center text-sm text-charcoal-soft dark:text-slate-400">
                مشتری یافت نشد
              </li>
            ) : (
              options.map((c, i) => (
                <li key={c.id} role="option" data-index={i} id={`customer-option-${i}`}>
                  <button
                    type="button"
                    onClick={() => select(c)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`
                      w-full text-right py-3 px-4 flex items-center gap-3 transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset
                      ${highlightIndex === i ? 'bg-gold-50 dark:bg-gold-900/20 text-charcoal dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-charcoal dark:text-slate-200'}
                    `}
                    aria-selected={highlightIndex === i}
                  >
                    <User className="w-5 h-5 text-gold-500 shrink-0" />
                    <div>
                      <p className="font-medium">{c.customerName}</p>
                      <p className="text-sm text-charcoal-soft dark:text-slate-400" dir="ltr">
                        {c.phone}
                      </p>
                    </div>
                    {c.id && <span className="text-xs text-slate-400 mr-auto">#{c.id}</span>}
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
