'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import { formatPriceAfn } from '@/lib/persian-format'

export interface StoreProduct {
  id: number
  productName: string
  type?: string | null
  gram?: number | null
  karat?: number | null
  purchasePriceToAfn?: number | null
  image?: string | null
  imageSecondary?: string | null
  categories?: { id: number; name: string }[]
}

interface ProductCardProps {
  product: StoreProduct
  className?: string
  variant?: 'light' | 'dark'
}

function toImgSrc(path: string | null | undefined): string | null {
  if (!path) return null
  return path.startsWith('/') ? path : `/${path}`
}

export default function ProductCard({ product, className = '', variant = 'light' }: ProductCardProps) {
  const [isHover, setIsHover] = useState(false)
  const price = product.purchasePriceToAfn ?? (product as unknown as Record<string, unknown>).purchasePriceToAfn
  const imgSrc = toImgSrc(product.image)
  const imgSecondary = toImgSrc(product.imageSecondary)
  const isDark = variant === 'dark'

  return (
    <article
      className={`
        group relative overflow-hidden
        transition-all duration-500 ease-out
        ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#FDFBF7] shadow-[0_1px_3px_rgba(45,45,45,0.06)] hover:shadow-[0_12px_40px_rgba(45,45,45,0.08)]'}
        rounded-none
        ${className}
      `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link
        href={`/shop/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 rounded-none"
      >
        <div className={`aspect-[3/4] relative overflow-hidden ${isDark ? 'bg-white/5' : 'bg-[#F0EDE8]/50'}`}>
          {imgSrc && (
            <>
              <Image
                src={imgSrc}
                alt={product.productName}
                fill
                className={`object-cover transition-all duration-500 ${
                  imgSecondary && isHover ? 'scale-105 opacity-0' : 'group-hover:scale-105'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {imgSecondary && (
                <span className="absolute inset-0 z-10 block">
                  <Image
                    src={imgSecondary}
                    alt=""
                    fill
                    className="object-cover transition-opacity duration-500 scale-105"
                    style={{ opacity: isHover ? 1 : 0 }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </span>
              )}
            </>
          )}
          {!imgSrc && (
            <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'text-white/20' : 'text-[#2D2D2D]/20'}`}>
              <span className="text-5xl">◆</span>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0C0C0C]/60' : 'from-[#2D2D2D]/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            aria-hidden
          />
        </div>
        <div className={isDark ? 'p-5 border border-t-0 border-white/10' : 'p-5'}>
          <h3 className={`font-semibold text-base mb-1 line-clamp-2 leading-snug ${isDark ? 'text-white' : 'text-[#2D2D2D]'}`}>
            {product.productName}
          </h3>
          {product.categories?.length ? (
            <p className={`text-sm mb-3 ${isDark ? 'text-white/60' : 'text-[#2D2D2D]/60'}`}>
              {product.categories.map((c) => c.name).join(', ')}
            </p>
          ) : null}
          <p className="text-[#D4AF37] font-semibold text-lg tracking-tight mb-4">
            {formatPriceAfn(Number(price))}
          </p>
          <span
            className={`
              inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold tracking-widest uppercase
              rounded-none transition-all duration-300
              ${isDark
                ? 'border border-white text-white bg-transparent hover:bg-white hover:text-[#0C0C0C]'
                : 'border border-[#2D2D2D]/20 text-[#2D2D2D] bg-transparent hover:bg-[#2D2D2D] hover:text-[#FDFBF7]'
              }
            `}
          >
            مشاهده
            <Eye className="w-4 h-4 shrink-0" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  )
}
