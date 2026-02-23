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
