'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import Barcode from 'react-barcode'
import Modal from '@/components/ui/Modal'
import QRCodeBlock from '@/components/ui/QRCodeBlock'

export interface LabelPrintProduct {
  id: number
  productName: string
  barcode: string
  gram: number
  karat: number
}

interface LabelPrintModalProps {
  open: boolean
  onClose: () => void
  product: LabelPrintProduct | null
}

function LabelContent({ product }: { product: LabelPrintProduct }) {
  const qrValue =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/product/search-barcode/${encodeURIComponent(product.barcode)}`
      : product.barcode

  return (
    <div
      className="w-[5cm] min-h-[3.5cm] p-3 border border-amber-200 rounded-xl bg-[#FDFBF7] dark:bg-slate-800 flex flex-col items-center justify-between gap-2"
      style={{ direction: 'rtl' }}
    >
      <p className="text-sm font-bold text-slate-800 dark:text-white font-stat text-center leading-tight">
        {product.productName}
      </p>
      <div className="flex items-center gap-4 w-full justify-center">
        <div className="flex-shrink-0">
          <Barcode
            value={product.barcode}
            format="CODE128"
            width={0.8}
            height={36}
            displayValue={true}
            fontSize={10}
            margin={0}
          />
        </div>
        <QRCodeBlock value={qrValue} size={80} label="اسکن برای مشاهده" className="shrink-0 print:block" />
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-stat">
        {product.gram} گرام · {product.karat} عیار
      </div>
    </div>
  )
}

export default function LabelPrintModal({ open, onClose, product }: LabelPrintModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: product ? `برچسب - ${product.productName}` : 'برچسب جنس',
    onAfterPrint: () => onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title="چاپ برچسب" size="default">
      <div className="space-y-6" dir="rtl">
        {product ? (
          <>
            <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div ref={printRef}>
                <LabelContent product={product} />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              با کلیک روی چاپ، تنها بخش برچسب چاپ می‌شود. در صورت نیاز ناوبر و منو را در تنظیمات چاپ مخفی کنید.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handlePrint()}
                className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-stat"
              >
                چاپ
              </button>
            </div>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center">محصولی انتخاب نشده است.</p>
        )}
      </div>
    </Modal>
  )
}
