'use client'

import React from 'react'
import Modal from '@/components/ui/Modal'
import ExpenseForm from './ExpenseForm'
import type { ExpenseFormData } from '@/types/expense'

interface ExpenseFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: ExpenseFormData | null
  onSuccess: () => void
}

export default function ExpenseFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: ExpenseFormModalProps) {
  const title = mode === 'edit' ? 'ویرایش مصرف' : 'افزودن مصرف'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <ExpenseForm
        mode={mode}
        initialData={initialData}
        onSuccess={() => {
          onSuccess()
          onClose()
        }}
        onCancel={onClose}
        cancelLabel="لغو"
      />
    </Modal>
  )
}
