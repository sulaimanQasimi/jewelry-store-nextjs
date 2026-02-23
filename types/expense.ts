/** Predefined expense type options including salary payment. */
export const EXPENSE_TYPE_OTHER = 'سایر'

export const EXPENSE_TYPES = [
  { value: 'پرداخت معاش', label: 'پرداخت معاش' },
  { value: 'اجاره', label: 'اجاره' },
  { value: 'برق و آب', label: 'برق و آب' },
  { value: 'حمل و نقل', label: 'حمل و نقل' },
  { value: 'ملزومات', label: 'ملزومات' },
  { value: 'تبلیغات', label: 'تبلیغات' },
  { value: 'تعمیرات', label: 'تعمیرات' },
  { value: EXPENSE_TYPE_OTHER, label: 'سایر' }
] as const

/**
 * Shared model for expense (مصارف).
 */
export interface Expense {
  id: number
  type: string
  detail: string
  price: number
  currency: string
  date: string
  account_id?: string | null
}

/** Form payload for create/edit. */
export interface ExpenseFormData {
  id?: number
  type: string
  detail: string
  price: number
  currency: string
  date?: string
  account_id?: string | null
}
