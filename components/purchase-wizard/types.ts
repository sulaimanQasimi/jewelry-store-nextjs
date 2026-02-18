import { z } from 'zod'

export const PURCHASE_WIZARD_STEPS = [
  { id: 1, key: 'supplier', label: 'تمویل‌کننده و بل' },
  { id: 2, key: 'items', label: 'اقلام' },
  { id: 3, key: 'payment', label: 'پرداخت' },
  { id: 4, key: 'review', label: 'بررسی' }
] as const

export type PurchaseStepId = (typeof PURCHASE_WIZARD_STEPS)[number]['id']

export const categoryOptions = [
  { value: 'طلا', label: 'طلا' },
  { value: 'الماس', label: 'الماس' },
  { value: 'نقره', label: 'نقره' },
  { value: 'سایر', label: 'سایر' }
] as const

export const paymentModeOptions = [
  { value: 'cash', label: 'نقد' },
  { value: 'bank', label: 'انتقال بانکی' },
  { value: 'credit', label: 'اعتبار' }
] as const

export type PaymentMode = (typeof paymentModeOptions)[number]['value']

export const supplierSchema = z.object({
  id: z.number().min(1, 'تمویل‌کننده را انتخاب کنید'),
  name: z.string().min(1, 'نام تمویل‌کننده الزامی است')
})

export const step1Schema = z.object({
  supplierId: z.number().min(1, 'تمویل‌کننده را انتخاب کنید'),
  supplierName: z.string().min(1, 'نام تمویل‌کننده الزامی است'),
  billNumber: z.string().min(1, 'شماره بل الزامی است'),
  purchaseDate: z.string().min(1, 'تاریخ الزامی است'),
  invoiceFile: z.instanceof(File).optional().nullable()
})

export const itemSchema = z.object({
  name: z.string().min(1, 'نام آیتم الزامی است'),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  weight: z.number().min(0, 'وزن نمی‌تواند منفی باشد'),
  carat: z.number().min(0).optional(),
  purchaseRate: z.number().min(0, 'نرخ خرید نمی‌تواند منفی باشد'),
  total: z.number().min(0)
})

export const step2Schema = z.object({
  items: z.array(itemSchema).min(1, 'حداقل یک آیتم اضافه کنید')
})

export const step3Schema = z.object({
  paymentMode: z.enum(['cash', 'bank', 'credit']),
  amountPaid: z.number().min(0, 'مبلغ پرداختی نمی‌تواند منفی باشد'),
  balanceDue: z.number().min(0)
})

export interface SupplierOption {
  id: number
  name: string
}

export interface PurchaseItemRow {
  id: string
  name: string
  category: string
  weight: number
  carat: number
  purchaseRate: number
  total: number
}

export interface PurchaseWizardState {
  step: PurchaseStepId
  supplierId: number
  supplierName: string
  billNumber: string
  purchaseDate: string
  invoiceFile: File | null
  items: PurchaseItemRow[]
  paymentMode: PaymentMode
  amountPaid: number
  balanceDue: number
}

export const defaultPurchaseState: PurchaseWizardState = {
  step: 1,
  supplierId: 0,
  supplierName: '',
  billNumber: '',
  purchaseDate: typeof window !== 'undefined' ? new Date().toISOString().slice(0, 10) : '',
  invoiceFile: null,
  items: [{ id: `row-${Date.now()}`, name: '', category: '', weight: 0, carat: 0, purchaseRate: 0, total: 0 }],
  paymentMode: 'cash',
  amountPaid: 0,
  balanceDue: 0
}

function getDefaultDate() {
  if (typeof window === 'undefined') return ''
  return new Date().toISOString().slice(0, 10)
}

export function getInitialState(): PurchaseWizardState {
  return {
    ...defaultPurchaseState,
    purchaseDate: getDefaultDate(),
    items: [{ id: `row-${Date.now()}`, name: '', category: '', weight: 0, carat: 0, purchaseRate: 0, total: 0 }]
  }
}
