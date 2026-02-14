'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-charcoal">{label}</label>
      {children}
    </div>
  )
}
