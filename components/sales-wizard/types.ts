export const WIZARD_STEPS = [
  { id: 1, key: 'products', label: 'انتخاب محصول' },
  { id: 2, key: 'customer', label: 'مشخصات مشتری' },
  { id: 3, key: 'payment', label: 'پرداخت' },
  { id: 4, key: 'success', label: 'تکمیل' }
] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id']

export interface CustomerOption {
  id: number
  customerName: string
  phone: string
}

export interface PaymentFormData {
  bellNumber: string
  receiptDate: string
  paidAmount: string
  note: string
  /** Account to deposit the sale payment into (optional). */
  depositAccountId: string
}

export interface TransactionResult {
  customerName: string
  customerPhone: string
  product: Array<{
    productName?: string
    barcode?: string
    gram?: number
    karat?: number
    salePrice?: { price: number; currency: string }
  }>
  receipt: { totalAmount: number; paidAmount: number; remainingAmount: number }
  bellNumber: number
  createdAt: string
  note: string | null
}

export interface WizardState {
  step: WizardStepId
  selectedCustomer: CustomerOption | null
  payment: PaymentFormData
  transactionResult: TransactionResult | null
}

/** Persisted in sessionStorage (step, customer, payment only; no transactionResult) */
export const WIZARD_PERSIST_KEY = 'salesWizardState'

export interface PersistedWizardState {
  step: WizardStepId
  selectedCustomer: CustomerOption | null
  payment: PaymentFormData
  persistedAt: number
}
