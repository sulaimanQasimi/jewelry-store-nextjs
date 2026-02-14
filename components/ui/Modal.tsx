'use client'

import React, { useEffect, useCallback } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'default' | 'xl'
}

export default function Modal({ open, onClose, title, children, size = 'default' }: ModalProps) {
  const maxWidthClass = size === 'xl' ? 'max-w-4xl' : 'max-w-2xl'
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`card-luxury bg-white rounded-2xl w-full ${maxWidthClass} max-h-[90vh] overflow-hidden flex flex-col shadow-[0_24px_48px_-12px_rgba(28,28,28,0.18)] transition-transform duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="shrink-0 px-6 py-4 border-b border-gold-200 bg-gold-50/50">
            <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
