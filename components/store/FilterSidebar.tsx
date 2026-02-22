'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toPersianDigits } from '@/lib/persian-format'

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
  { value: '', label: 'همهٔ جنس‌ها', gradient: 'from-[#E5E0D9] to-[#E5E0D9]' },
  { value: 'Gold', label: 'طلا', gradient: 'from-[#F5E6C8] via-[#D4AF37] to-[#B8962E]' },
  { value: 'Silver', label: 'نقره', gradient: 'from-[#E8E8E8] via-[#C0C0C0] to-[#A0A0A0]' },
  { value: 'Platinum', label: 'پلاتین', gradient: 'from-[#F0EEEA] via-[#E5E4E2] to-[#D0CEC9]' },
] as const

interface FilterSidebarProps {
  categories: CategoryOption[]
  filter: FilterState
  onFilterChange: (next: Partial<FilterState>) => void
  priceRange: { min: number; max: number }
  onClearFilters: () => void
  categoryCounts?: Record<number, number>
  className?: string
}

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

function hasActiveFilters(filter: FilterState): boolean {
  return (
    filter.categoryId !== '' ||
    filter.priceMin !== '' ||
    filter.priceMax !== '' ||
    filter.material !== '' ||
    filter.availability === false
  )
}

export default function FilterSidebar({
  categories,
  filter,
  onFilterChange,
  priceRange,
  onClearFilters,
  categoryCounts = {},
  className = '',
}: FilterSidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [materialOpen, setMaterialOpen] = useState(true)
  const [availabilityOpen, setAvailabilityOpen] = useState(false)
  const [sliderTooltip, setSliderTooltip] = useState<{ type: 'min' | 'max'; value: number } | null>(null)

  const showClearAll = hasActiveFilters(filter)

  const minNum = useMemo(() => {
    const v = filter.priceMin !== '' ? Number(filter.priceMin) : priceRange.min
    return isNaN(v) ? priceRange.min : Math.max(priceRange.min, Math.min(priceRange.max, v))
  }, [filter.priceMin, priceRange])
  const maxNum = useMemo(() => {
    const v = filter.priceMax !== '' ? Number(filter.priceMax) : priceRange.max
    return isNaN(v) ? priceRange.max : Math.min(priceRange.max, Math.max(priceRange.min, v))
  }, [filter.priceMax, priceRange])
  const clampedMin = Math.min(minNum, maxNum - 1)
  const clampedMax = Math.max(maxNum, clampedMin + 1)

  const handlePriceMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      const n = parseInt(v, 10)
      if (!isNaN(n) && n >= clampedMax) onFilterChange({ priceMin: String(clampedMax - 1), priceMax: String(clampedMax) })
      else onFilterChange({ priceMin: v })
    },
    [onFilterChange, clampedMax]
  )
  const handlePriceMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      const n = parseInt(v, 10)
      if (!isNaN(n) && n <= clampedMin) onFilterChange({ priceMax: String(clampedMin + 1), priceMin: String(clampedMin) })
      else onFilterChange({ priceMax: v })
    },
    [onFilterChange, clampedMin]
  )

  const step = Math.max(1, Math.floor((priceRange.max - priceRange.min) / 200))
  const minPercent = ((clampedMin - priceRange.min) / (priceRange.max - priceRange.min)) * 100
  const maxPercent = ((clampedMax - priceRange.min) / (priceRange.max - priceRange.min)) * 100

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        sticky top-24 overflow-y-auto luxury-scrollbar
        w-full rounded-xl p-6
        bg-[#FDFBF7]/80 backdrop-blur-md
        border border-gold-100/30
        shadow-[0_4px_24px_rgba(45,45,45,0.04)]
        ${className}
      `}
    >
      {/* Header + Clear All (only when filters active) */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-[#2D2D2D] font-semibold text-base tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-vazirmatn), Vazirmatn, sans-serif' }}
        >
          فیلترها
        </h2>
        <AnimatePresence>
          {showClearAll && (
            <motion.button
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={onClearFilters}
              className="text-[#D4AF37] hover:text-[#B8962E] text-sm font-normal italic overflow-hidden whitespace-nowrap"
            >
              پاک کردن فیلترها
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Category accordion */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="border-b border-gold-100/30 pb-5 mb-5"
      >
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full text-start py-2.5 group"
        >
          <span
            className="text-[#2D2D2D] font-medium tracking-[0.15em] text-sm"
            style={{ fontFamily: 'var(--font-vazirmatn), Vazirmatn, sans-serif' }}
          >
            دسته‌بندی
          </span>
          <motion.span
            animate={{ rotate: categoryOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[#2D2D2D]/60 group-hover:text-[#D4AF37]"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {categoryOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-2 space-y-0.5 overflow-hidden"
            >
              <li>
                <button
                  type="button"
                  onClick={() => onFilterChange({ categoryId: '' })}
                  className="w-full text-start text-sm py-2 px-0 rounded-sm transition-colors flex items-center gap-2 group/link"
                >
                  {filter.categoryId === '' && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />}
                  <span
                    className={`border-b border-transparent group-hover/link:border-[#2D2D2D]/20 ${
                      filter.categoryId === '' ? 'text-[#D4AF37] font-medium border-[#D4AF37]/50' : 'text-[#2D2D2D]/75'
                    }`}
                  >
                    همه
                  </span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = categoryCounts[cat.id]
                const isActive = String(cat.id) === filter.categoryId
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onFilterChange({ categoryId: String(cat.id) })}
                      className="w-full text-start text-sm py-2 px-0 rounded-sm transition-colors flex items-center gap-2 group/link"
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />}
                      <span
                        className={`border-b border-transparent group-hover/link:border-[#2D2D2D]/20 ${
                          isActive ? 'text-[#D4AF37] font-medium border-[#D4AF37]/50' : 'text-[#2D2D2D]/75'
                        }`}
                      >
                        {cat.name}
                        {count !== undefined && (
                          <span className="text-[#2D2D2D]/50 font-normal ms-1">({toPersianDigits(count)})</span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Price accordion – dual range + tooltip */}
      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="border-b border-gold-100/30 pb-5 mb-5"
      >
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full text-start py-2.5 group"
        >
          <span
            className="text-[#2D2D2D] font-medium tracking-[0.15em] text-sm"
            style={{ fontFamily: 'var(--font-vazirmatn), Vazirmatn, sans-serif' }}
          >
            محدودهٔ قیمت
          </span>
          <motion.span
            animate={{ rotate: priceOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[#2D2D2D]/60 group-hover:text-[#D4AF37]"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {priceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 pt-1">
                <div className="relative pt-6 pb-1">
                  {/* Floating tooltip above slider */}
                  {sliderTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 top-0 -translate-x-1/2 px-2.5 py-1.5 rounded-md bg-[#2D2D2D] text-[#FDFBF7] text-xs font-medium shadow-lg z-30"
                    >
                      {toPersianDigits(sliderTooltip.value)} افغانی
                    </motion.div>
                  )}
                  <div
                    className="relative h-1.5 rounded-full bg-[#F0EDE8]"
                    onMouseLeave={() => setSliderTooltip(null)}
                  >
                    <div
                      className="absolute inset-y-0 rounded-full bg-[#D4AF37]/90"
                      style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                    />
                    {/* Min thumb – receives pointer when thumb is on left half */}
                    <input
                      type="range"
                      min={priceRange.min}
                      max={Math.max(priceRange.min, clampedMax - step)}
                      step={step}
                      value={clampedMin}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        onFilterChange({ priceMin: String(v) })
                      }}
                      onMouseDown={() => setSliderTooltip({ type: 'min', value: clampedMin })}
                      onMouseUp={() => setSliderTooltip(null)}
                      onTouchStart={() => setSliderTooltip({ type: 'min', value: clampedMin })}
                      onTouchEnd={() => setSliderTooltip(null)}
                      onInput={(e) => setSliderTooltip({ type: 'min', value: Number((e.target as HTMLInputElement).value) })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      style={{ direction: 'ltr' }}
                    />
                    {/* Max thumb – on top so it receives pointer when on right half */}
                    <input
                      type="range"
                      min={Math.min(priceRange.max, clampedMin + step)}
                      max={priceRange.max}
                      step={step}
                      value={clampedMax}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        onFilterChange({ priceMax: String(v) })
                      }}
                      onMouseDown={() => setSliderTooltip({ type: 'max', value: clampedMax })}
                      onMouseUp={() => setSliderTooltip(null)}
                      onTouchStart={() => setSliderTooltip({ type: 'max', value: clampedMax })}
                      onTouchEnd={() => setSliderTooltip(null)}
                      onInput={(e) => setSliderTooltip({ type: 'max', value: Number((e.target as HTMLInputElement).value) })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      style={{ direction: 'ltr' }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={filter.priceMin || ''}
                    onChange={handlePriceMin}
                    placeholder={`${priceRange.min}`}
                    className="w-full px-3 py-2 border border-gold-100/40 rounded-md text-sm text-[#2D2D2D] bg-[#FDFBF7]/90 focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-colors"
                  />
                  <span className="text-[#2D2D2D]/40 shrink-0">–</span>
                  <input
                    type="number"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={filter.priceMax || ''}
                    onChange={handlePriceMax}
                    placeholder={`${priceRange.max}`}
                    className="w-full px-3 py-2 border border-gold-100/40 rounded-md text-sm text-[#2D2D2D] bg-[#FDFBF7]/90 focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Material accordion – metallic swatches + ring when selected */}
      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="border-b border-gold-100/30 pb-5 mb-5"
      >
        <button
          type="button"
          onClick={() => setMaterialOpen(!materialOpen)}
          className="flex items-center justify-between w-full text-start py-2.5 group"
        >
          <span
            className="text-[#2D2D2D] font-medium tracking-[0.15em] text-sm"
            style={{ fontFamily: 'var(--font-vazirmatn), Vazirmatn, sans-serif' }}
          >
            جنس
          </span>
          <motion.span
            animate={{ rotate: materialOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[#2D2D2D]/60 group-hover:text-[#D4AF37]"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {materialOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap gap-4">
                {MATERIAL_SWATCHES.map((opt) => {
                  const isActive = filter.material === opt.value
                  return (
                    <button
                      key={opt.value || 'all'}
                      type="button"
                      onClick={() => onFilterChange({ material: opt.value })}
                      className="flex flex-col items-center gap-2 group"
                      title={opt.label}
                    >
                      <span
                        className={`
                          w-9 h-9 rounded-full bg-gradient-to-br ${opt.gradient}
                          border-2 transition-all duration-200
                          shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]
                          ${isActive
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 ring-offset-2 ring-offset-[#FDFBF7]'
                            : 'border-[#E5E0D9]/80 group-hover:border-[#2D2D2D]/20'
                          }
                        `}
                      />
                      <span
                        className={`text-xs transition-colors ${
                          isActive ? 'text-[#2D2D2D] font-medium' : 'text-[#2D2D2D]/60'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Availability */}
      <motion.div
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          type="button"
          onClick={() => setAvailabilityOpen(!availabilityOpen)}
          className="flex items-center justify-between w-full text-start py-2.5 group"
        >
          <span
            className="text-[#2D2D2D] font-medium tracking-[0.15em] text-sm"
            style={{ fontFamily: 'var(--font-vazirmatn), Vazirmatn, sans-serif' }}
          >
            موجودی
          </span>
          <motion.span
            animate={{ rotate: availabilityOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[#2D2D2D]/60 group-hover:text-[#D4AF37]"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {availabilityOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filter.availability}
                  onChange={(e) => onFilterChange({ availability: e.target.checked })}
                  className="w-4 h-4 rounded border-gold-100/50 text-[#D4AF37] focus:ring-[#D4AF37]/30"
                />
                <span className="text-sm text-[#2D2D2D]/80 group-hover:text-[#2D2D2D]">فقط موجود</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  )
}
