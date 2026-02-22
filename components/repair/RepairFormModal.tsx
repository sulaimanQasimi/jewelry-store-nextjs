'use client'

import React from 'react'
import Modal from '@/components/ui/Modal'
import RepairFormContent from './RepairFormContent'
import type { RepairFormData } from './RepairFormContent'

interface RepairFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData: RepairFormData | null
  onSuccess: () => void
}

export default function RepairFormModal({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}: RepairFormModalProps) {
  const title = mode === 'edit' ? 'ویرایش تعمیر' : 'ثبت تعمیر جدید'

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <RepairFormContent
        mode={mode}
        initialData={initialData}
        onSuccess={() => {
          onSuccess()
          onClose()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}
