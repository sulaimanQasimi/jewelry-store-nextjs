'use client'

import React from 'react'
import Modal from '@/components/ui/Modal'
import ProductFormContent from './ProductFormContent'

export interface ProductFormData {
  id?: number
  productName: string
  type: string
  gram: number
  karat: number
  purchasePriceToAfn?: number
  bellNumber?: number | null
  wage?: number | null
  auns?: number | null
  pricing_mode?: 'fixed' | 'gold_based'
  wage_per_gram?: number | null
  barcode?: string
  image?: string | null
  isSold?: boolean
  categoryIds?: number[]
}

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: ProductFormData | null
  onSuccess: () => void
}

export default function ProductFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: ProductFormModalProps) {
  const title = mode === 'create' ? 'افزودن جنس' : 'ویرایش جنس'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <ProductFormContent
        mode={mode}
        initialData={initialData}
        onSuccess={() => { onSuccess(); onClose() }}
        onCancel={onClose}
      />
    </Modal>
  )
}
