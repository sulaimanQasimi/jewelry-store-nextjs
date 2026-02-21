'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeBlockProps {
  value: string
  size?: number
  label?: string
  className?: string
}

export default function QRCodeBlock({ value, size = 128, label = 'اسکن برای مشاهده', className = '' }: QRCodeBlockProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-amber-200/50 dark:border-amber-800/50 bg-white dark:bg-slate-800/80 ${className}`} dir="rtl">
      <QRCodeSVG value={value} size={size} level="M" includeMargin={false} />
      {label ? (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 font-stat">{label}</span>
      ) : null}
    </div>
  )
}
