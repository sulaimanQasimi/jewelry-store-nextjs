/**
 * Shared model for supplier product (جنس تمویل).
 * Used by list page, detail page, modal, and API responses.
 */
export interface SupplierProduct {
  id: number
  supplierId: number
  supplierName: string
  name: string
  type: string | null
  karat: number | null
  weight: number
  registeredWeight?: number | null
  remainWeight?: number | null
  pasa: number
  pasaReceipt: number
  pasaRemaining: number
  wagePerGram: number | null
  totalWage: number
  wageReceipt: number
  wageRemaining: number
  bellNumber: number | null
  detail: string | null
  createdAt: string
  updatedAt: string
}

/** Form payload for create/edit (modal and API). */
export interface SupplierProductFormData {
  id?: number
  supplierId: number
  supplierName: string
  name: string
  type?: string | null
  karat?: number | null
  weight: number
  pasa?: number
  pasaReceipt?: number
  pasaRemaining?: number
  wagePerGram?: number | null
  totalWage?: number
  wageReceipt?: number
  wageRemaining?: number
  detail?: string | null
  bellNumber?: number | null
}
