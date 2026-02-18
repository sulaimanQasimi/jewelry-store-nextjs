import type { PurchaseWizardState, PurchaseItemRow, PurchaseStepId, PaymentMode } from './types'

export type PurchaseWizardAction =
  | { type: 'SET_STEP'; payload: PurchaseStepId }
  | { type: 'SET_SUPPLIER'; payload: { supplierId: number; supplierName: string } }
  | { type: 'SET_BILL'; payload: { billNumber: string; purchaseDate: string } }
  | { type: 'SET_INVOICE_FILE'; payload: File | null }
  | { type: 'SET_ITEMS'; payload: PurchaseItemRow[] }
  | { type: 'ADD_ITEM' }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; patch: Partial<PurchaseItemRow> } }
  | { type: 'SET_PAYMENT'; payload: { paymentMode: PaymentMode; amountPaid: number; balanceDue: number } }
  | { type: 'RESET' }

function nextId(): string {
  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function purchaseWizardReducer(state: PurchaseWizardState, action: PurchaseWizardAction): PurchaseWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_SUPPLIER':
      return { ...state, supplierId: action.payload.supplierId, supplierName: action.payload.supplierName }
    case 'SET_BILL':
      return { ...state, billNumber: action.payload.billNumber, purchaseDate: action.payload.purchaseDate }
    case 'SET_INVOICE_FILE':
      return { ...state, invoiceFile: action.payload }
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'ADD_ITEM':
      return {
        ...state,
        items: [
          ...state.items,
          { id: nextId(), name: '', category: '', weight: 0, carat: 0, purchaseRate: 0, total: 0 }
        ]
      }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.id !== action.payload)
      return { ...state, items: items.length ? items : [{ id: nextId(), name: '', category: '', weight: 0, carat: 0, purchaseRate: 0, total: 0 }] }
    }
    case 'UPDATE_ITEM': {
      const items = state.items.map((i) =>
        i.id === action.payload.id ? { ...i, ...action.payload.patch } : i
      )
      return { ...state, items }
    }
    case 'SET_PAYMENT':
      return {
        ...state,
        paymentMode: action.payload.paymentMode,
        amountPaid: action.payload.amountPaid,
        balanceDue: action.payload.balanceDue
      }
    case 'RESET':
      return {
        ...state,
        step: 1,
        supplierId: 0,
        supplierName: '',
        billNumber: '',
        purchaseDate: typeof window !== 'undefined' ? new Date().toISOString().slice(0, 10) : state.purchaseDate,
        invoiceFile: null,
        items: [{ id: nextId(), name: '', category: '', weight: 0, carat: 0, purchaseRate: 0, total: 0 }],
        paymentMode: 'cash',
        amountPaid: 0,
        balanceDue: 0
      }
    default:
      return state
  }
}
