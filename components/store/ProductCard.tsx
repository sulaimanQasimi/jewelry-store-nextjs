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
}

function toImgSrc(path: string | null | undefined): string | null {
  if (!path) return null
  return path.startsWith('/') ? path : `/${path}`
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isHover, setIsHover] = useState(false)
  const price = product.purchasePriceToAfn ?? (product as Record<string, unknown>).purchasePriceToAfn
  const imgSrc = toImgSrc(product.image)
  const imgSecondary = toImgSrc(product.imageSecondary)

  return (
    <article
      className={`
        group relative overflow-hidden
        bg-[#FDFBF7] rounded-sm
        transition-all duration-500 ease-out
        shadow-[0_1px_3px_rgba(45,45,45,0.06)]
        hover:shadow-[0_12px_40px_rgba(45,45,45,0.08)]
        ${className}
      `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link
        href={`/shop/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 rounded-sm"
      >
        <div className="aspect-[3/4] relative bg-[#F0EDE8]/50 overflow-hidden">
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
            <div className="absolute inset-0 flex items-center justify-center text-[#2D2D2D]/20">
              <span className="text-5xl">◆</span>
            </div>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            aria-hidden
          />
        </div>
        <div className="p-5">
          <h3 className="text-[#2D2D2D] font-semibold text-base mb-1 line-clamp-2 leading-snug">
            {product.productName}
          </h3>
          {product.categories?.length ? (
            <p className="text-sm text-[#2D2D2D]/60 mb-3">
              {product.categories.map((c) => c.name).join(', ')}
            </p>
          ) : null}
          <p className="text-[#D4AF37] font-semibold text-lg tracking-tight mb-4">
            {formatPriceAfn(Number(price))}
          </p>
          <span
            className="
              inline-flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium
              rounded-sm border border-[#2D2D2D]/20 text-[#2D2D2D]
              bg-transparent hover:bg-[#2D2D2D] hover:text-[#FDFBF7] hover:border-[#2D2D2D]
              transition-all duration-300
            "
          >
            مشاهدهٔ جزئیات
            <Eye className="w-4 h-4 shrink-0" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  )
}
