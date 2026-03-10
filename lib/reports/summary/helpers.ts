import type { ReportsSummaryFilters } from './types'

export function clampDateRange(dateFrom: Date, dateTo: Date): { dateFrom: Date; dateTo: Date } {
  const from = new Date(dateFrom)
  const to = new Date(dateTo)
  if (Number.isNaN(from.getTime())) throw new Error('Invalid dateFrom')
  if (Number.isNaN(to.getTime())) throw new Error('Invalid dateTo')
  from.setHours(0, 0, 0, 0)
  to.setHours(23, 59, 59, 999)
  if (from > to) {
    const tmp = new Date(from)
    from.setTime(to.getTime())
    to.setTime(tmp.getTime())
  }
  return { dateFrom: from, dateTo: to }
}

export function parseFiltersFromSearchParams(sp: URLSearchParams): ReportsSummaryFilters {
  const today = new Date().toISOString().slice(0, 10)
  const dateFrom = (sp.get('dateFrom')?.trim() || '').slice(0, 10) || today
  const dateTo = (sp.get('dateTo')?.trim() || '').slice(0, 10) || today

  const customerId = safeInt(sp.get('customerId'))
  const supplierId = safeInt(sp.get('supplierId'))
  const categoryId = safeInt(sp.get('categoryId'))
  const productType = (sp.get('productType')?.trim() || '').slice(0, 100) || undefined

  return {
    dateFrom,
    dateTo,
    customerId: customerId || undefined,
    supplierId: supplierId || undefined,
    categoryId: categoryId || undefined,
    productType
  }
}

export function safeInt(v: string | null): number {
  if (!v) return 0
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function roundMoney(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.round(n)
}

export function normalizeCurrencyCode(code: string | null | undefined): string {
  const c = (code || '').trim()
  if (!c) return 'AFN'
  if (c === 'دالر') return 'USD'
  if (c === 'افغانی') return 'AFN'
  return c.toUpperCase()
}

export function toAfn(amount: number, currencyCode: string, usdRate: number): number {
  const c = normalizeCurrencyCode(currencyCode)
  if (!Number.isFinite(amount)) return 0
  if (c === 'USD') return amount * (usdRate || 1)
  return amount
}

export function isProbablyCashAccount(name: string): boolean {
  const n = (name || '').toLowerCase()
  return n.includes('cash') || n.includes('نقد') || n.includes('صندوق')
}

