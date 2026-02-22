'use client'

import { useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

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

const MATERIAL_SWATCHES = [
  { value: '', label: 'همهٔ جنس‌ها', swatch: 'bg-[#E5E0D9]' },
  { value: 'Gold', label: 'طلا', swatch: 'bg-[#D4AF37]' },
  { value: 'Silver', label: 'نقره', swatch: 'bg-[#C0C0C0]' },
  { value: 'Platinum', label: 'پلاتین', swatch: 'bg-[#E5E4E2]' },
] as const

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
    (e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ priceMin: e.target.value }),
    [onFilterChange]
  )
  const handlePriceMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ priceMax: e.target.value }),
    [onFilterChange]
  )

  const minVal = filter.priceMin !== '' ? Number(filter.priceMin) : priceRange.min
  const maxVal = filter.priceMax !== '' ? Number(filter.priceMax) : priceRange.max
  const high = isNaN(maxVal) ? priceRange.max : Math.min(priceRange.max, maxVal)

  return (
    <aside
      className={`
        h-fit sticky top-24 overflow-y-auto luxury-scrollbar
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#2D2D2D] font-semibold text-base">
          فیلترها
        </h2>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-[#D4AF37] hover:underline font-medium transition-colors"
        >
          پاک کردن همه
        </button>
      </div>

      {/* Category accordion */}
      <div className="border-b border-[#F0EDE8] pb-4 mb-4">
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2D2D2D] py-2"
        >
          <span>دسته‌بندی</span>
          <ChevronDown
            className={`w-4 h-4 text-[#2D2D2D]/60 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {categoryOpen && (
          <ul className="mt-2 space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => onFilterChange({ categoryId: '' })}
                className={`w-full text-start text-sm py-1.5 px-0 rounded-sm transition-colors ${
                  filter.categoryId === '' ? 'text-[#D4AF37] font-medium' : 'text-[#2D2D2D]/80 hover:text-[#2D2D2D]'
                }`}
              >
                همه
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onFilterChange({ categoryId: String(cat.id) })}
                  className={`w-full text-start text-sm py-1.5 px-0 rounded-sm transition-colors ${
                    String(cat.id) === filter.categoryId ? 'text-[#D4AF37] font-medium' : 'text-[#2D2D2D]/80 hover:text-[#2D2D2D]'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price accordion */}
      <div className="border-b border-[#F0EDE8] pb-4 mb-4">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2D2D2D] py-2"
        >
          <span>محدودهٔ قیمت</span>
          <ChevronDown
            className={`w-4 h-4 text-[#2D2D2D]/60 transition-transform duration-200 ${priceOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {priceOpen && (
          <div className="mt-3 space-y-4">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`کم‌ترین ${priceRange.min}`}
                value={filter.priceMin}
                onChange={handlePriceMin}
                className="w-full px-3 py-2 border border-[#E5E0D9] rounded-sm text-sm text-[#2D2D2D] bg-[#FDFBF7] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-colors"
              />
              <span className="text-[#2D2D2D]/50 shrink-0">–</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`بیش‌ترین ${priceRange.max}`}
                value={filter.priceMax}
                onChange={handlePriceMax}
                className="w-full px-3 py-2 border border-[#E5E0D9] rounded-sm text-sm text-[#2D2D2D] bg-[#FDFBF7] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-colors"
              />
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
              value={high}
              onChange={(e) => onFilterChange({ priceMax: e.target.value })}
              className="range-gold w-full"
            />
          </div>
        )}
      </div>

      {/* Material accordion – circular swatches */}
      <div className="border-b border-[#F0EDE8] pb-4 mb-4">
        <button
          type="button"
          onClick={() => setMaterialOpen(!materialOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2D2D2D] py-2"
        >
          <span>جنس</span>
          <ChevronDown
            className={`w-4 h-4 text-[#2D2D2D]/60 transition-transform duration-200 ${materialOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {materialOpen && (
          <div className="mt-3 flex flex-wrap gap-3">
            {MATERIAL_SWATCHES.map((opt) => (
              <button
                key={opt.value || 'all'}
                type="button"
                onClick={() => onFilterChange({ material: opt.value })}
                className="flex flex-col items-center gap-1.5 group"
                title={opt.label}
              >
                <span
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${opt.swatch}
                    ${filter.material === opt.value
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-[#E5E0D9] group-hover:border-[#2D2D2D]/30'
                    }
                  `}
                />
                <span className={`text-xs ${filter.material === opt.value ? 'text-[#2D2D2D] font-medium' : 'text-[#2D2D2D]/70'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <button
          type="button"
          onClick={() => setAvailabilityOpen(!availabilityOpen)}
          className="flex items-center justify-between w-full text-start font-medium text-[#2D2D2D] py-2"
        >
          <span>موجودی</span>
          <ChevronDown
            className={`w-4 h-4 text-[#2D2D2D]/60 transition-transform duration-200 ${availabilityOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {availabilityOpen && (
          <label className="flex items-center gap-2 mt-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filter.availability}
              onChange={(e) => onFilterChange({ availability: e.target.checked })}
              className="w-4 h-4 rounded border-[#E5E0D9] text-[#D4AF37] focus:ring-[#D4AF37]/30"
            />
            <span className="text-sm text-[#2D2D2D]/80 group-hover:text-[#2D2D2D]">فقط موجود</span>
          </label>
        )}
      </div>
    </aside>
  )
}
