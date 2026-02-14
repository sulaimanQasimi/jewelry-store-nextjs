import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const urlQuery = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(urlQuery.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(urlQuery.get('limit') || '10', 10)))
    const search = urlQuery.get('search')?.trim() || ''
    const supplierIdParam = urlQuery.get('supplierId')?.trim()
    const offset = (page - 1) * limit

    const countConditions: string[] = []
    const countParams: (string | number)[] = []
    if (supplierIdParam) {
      const sid = parseInt(supplierIdParam, 10)
      if (!isNaN(sid)) {
        countConditions.push('supplierId = ?')
        countParams.push(sid)
      }
    }
    if (search) {
      countConditions.push('(name LIKE ? OR type LIKE ? OR supplierName LIKE ?)')
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    const whereSql = countConditions.length ? `WHERE ${countConditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM supplier_products ${whereSql}`,
      countParams
    )) as { total: number }[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const listConditions = [...countConditions]
    const listParams = [...countParams]
    const listWhereSql = listConditions.length ? `WHERE ${listConditions.join(' AND ')}` : ''
    const sql = `SELECT id, supplierId, supplierName, name, type, karat, weight, registeredWeight, remainWeight,
      pasa, pasaReceipt, pasaRemaining, wagePerGram, totalWage, wageReceipt, wageRemaining, bellNumber, detail, createdAt, updatedAt
      FROM supplier_products ${listWhereSql} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
    const rows = (await query(sql, listParams)) as Record<string, unknown>[]
    const list = Array.isArray(rows) ? rows.map((r) => ({ ...r })) : []

    return NextResponse.json({
      success: true,
      data: list,
      total,
      page,
      limit
    })
  } catch (error: unknown) {
    console.error('supplier-product list error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در بارگذاری',
        data: [],
        total: 0,
        page: 1,
        limit: 10
      },
      { status: 200 }
    )
  }
}
