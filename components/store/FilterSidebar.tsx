'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import Button from './Button'

export interface CategoryOption {
  id: number
  name: string
}

export interface FilterState {
  categoryId: string
  priceMin: string
  priceMax: string
  material: string
  availability: boolean
}

const MATERIAL_OPTIONS = [
  { value: '', label: 'همهٔ جنس‌ها' },
  { value: 'Gold', label: 'طلا' },
  { value: 'Silver', label: 'نقره' },
  { value: 'Platinum', label: 'پلاتین' },
]

interface FilterSidebarProps {
  categories: CategoryOption[]
  filter: FilterState
  onFilterChange: (next: Partial<FilterState>) => void
  priceRange: { min: number; max: number }
  onClearFilters: () => void
  className?: string
}

export default function FilterSidebar({
  categories,
  filter,
  onFilterChange,
  priceRange,
  onClearFilters,
  className = '',
}: FilterSidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [materialOpen, setMaterialOpen] = useState(true)
  const [availabilityOpen, setAvailabilityOpen] = useState(true)

  const handlePriceMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      onFilterChange({ priceMin: v })
    },
    [onFilterChange]
  )
  const handlePriceMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      onFilterChange({ priceMax: v })
    },
    [onFilterChange]
  )

  const minVal = filter.priceMin !== '' ? Number(filter.priceMin) : priceRange.min
  const maxVal = filter.priceMax !== '' ? Number(filter.priceMax) : priceRange.max
  const low = isNaN(minVal) ? priceRange.min : Math.max(priceRange.min, minVal)
  const high = isNaN(maxVal) ? priceRange.max : Math.min(priceRange.max, maxVal)

  return (
    <aside
      className={`
        bg-cream-50 border border-cream-200 rounded-sm p-4 shadow-sm
        h-fit sticky top-24 luxury-scrollbar overflow-y-auto
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-[#2C2C2C] font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#D4AF37]" />
          فیلترها
        </h2>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-[#D4AF37] hover:underline font-medium"
        >
          پاک کردن همه
        </button>
      </div>

      {/* Categories */}
      <div className="border-b border-cream-200 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2C2C2C] py-1"
        >
          <span>دسته‌بندی</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {categoryOpen && (
          <ul className="mt-2 space-y-1">
            <li>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filter.categoryId === ''}
                  onChange={() => onFilterChange({ categoryId: '' })}
                  className="w-4 h-4 text-[#D4AF37] border-cream-300 focus:ring-[#D4AF37]"
                />
                <span className="text-[#2C2C2C]/80 group-hover:text-[#2C2C2C]">همه</span>
              </label>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={String(cat.id) === filter.categoryId}
                    onChange={() => onFilterChange({ categoryId: String(cat.id) })}
                    className="w-4 h-4 text-[#D4AF37] border-cream-300 focus:ring-[#D4AF37]"
                  />
                  <span className="text-[#2C2C2C]/80 group-hover:text-[#2C2C2C]">{cat.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price range */}
      <div className="border-b border-cream-200 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2C2C2C] py-1"
        >
          <span>محدودهٔ قیمت</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${priceOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {priceOpen && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`کم‌ترین ${priceRange.min}`}
                value={filter.priceMin}
                onChange={handlePriceMin}
                className="w-full px-3 py-2 border border-cream-300 rounded-sm text-sm text-[#2C2C2C] bg-white focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
              <span className="text-[#2C2C2C]/60">–</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`بیش‌ترین ${priceRange.max}`}
                value={filter.priceMax}
                onChange={handlePriceMax}
                className="w-full px-3 py-2 border border-cream-300 rounded-sm text-sm text-[#2C2C2C] bg-white focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
              value={high}
              onChange={(e) => onFilterChange({ priceMax: e.target.value })}
              className="w-full h-2 rounded-full appearance-none bg-cream-200 accent-[#D4AF37]"
            />
          </div>
        )}
      </div>

      {/* Material */}
      <div className="border-b border-cream-200 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setMaterialOpen(!materialOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2C2C2C] py-1"
        >
          <span>جنس</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${materialOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {materialOpen && (
          <ul className="mt-2 space-y-1">
            {MATERIAL_OPTIONS.map((opt) => (
              <li key={opt.value || 'all'}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="material"
                    checked={filter.material === opt.value}
                    onChange={() => onFilterChange({ material: opt.value })}
                    className="w-4 h-4 text-[#D4AF37] border-cream-300 focus:ring-[#D4AF37]"
                  />
                  <span className="text-[#2C2C2C]/80 group-hover:text-[#2C2C2C]">{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Availability */}
      <div>
        <button
          type="button"
          onClick={() => setAvailabilityOpen(!availabilityOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2C2C2C] py-1"
        >
          <span>موجودی</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${availabilityOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {availabilityOpen && (
          <label className="flex items-center gap-2 mt-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filter.availability}
              onChange={(e) => onFilterChange({ availability: e.target.checked })}
              className="w-4 h-4 rounded text-[#D4AF37] border-cream-300 focus:ring-[#D4AF37]"
            />
            <span className="text-[#2C2C2C]/80 group-hover:text-[#2C2C2C]">فقط موجود</span>
          </label>
        )}
      </div>
    </aside>
  )
}
