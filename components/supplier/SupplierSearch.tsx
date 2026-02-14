'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface Supplier {
  id: number
  name: string
  phone?: string
  address?: string
}

interface SupplierSearchProps {
  onSelect: (supplier: { id: number; name: string }) => void
  placeholder?: string
  value?: string
}

export default function SupplierSearch({ onSelect, placeholder = 'اسم تمویل کننده', value: controlledValue }: SupplierSearchProps) {
  const [search, setSearch] = useState(controlledValue ?? '')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (controlledValue !== undefined) setSearch(controlledValue)
  }, [controlledValue])

  useEffect(() => {
    if (!search.trim()) {
      setSuppliers([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await axios.get<{ success: boolean; supplier?: Supplier[] }>(
          '/api/supplier/get',
          { params: { search: search.trim() } }
        )
        if (data.success && data.supplier) {
          setSuppliers(data.supplier)
          setOpen(true)
        } else {
          setSuppliers([])
        }
      } catch {
        setSuppliers([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (s: Supplier) => {
    setSearch(s.name)
    setSuppliers([])
    setOpen(false)
    onSelect({ id: s.id, name: s.name })
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => suppliers.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="input-luxury w-full"
        autoComplete="off"
      />
      {loading && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-soft">...</span>
      )}
      {open && suppliers.length > 0 && (
        <ul className="absolute top-full right-0 left-0 z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-gold-200 bg-white py-1 shadow-lg">
          {suppliers.map((s) => (
            <li
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(s)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(s)}
              className="cursor-pointer px-4 py-2.5 text-charcoal transition-colors hover:bg-gold-50"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
