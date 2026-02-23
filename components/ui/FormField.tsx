'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  /** When true, shows a red asterisk next to the label (for required fields). */
  required?: boolean
}

export default function FormField({ label, children, required }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-red-500 ms-0.5" aria-hidden>*</span>}
      </label>
      {children}
    </div>
  )
}
