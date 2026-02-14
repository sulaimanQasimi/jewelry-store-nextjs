import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const offset = (page - 1) * limit

    if (!supplierId) {
      return NextResponse.json({
        success: false,
        message: 'supplierId ارسال نشده'
      })
    }

    const idNum = Number(supplierId)
    const countConditions = ['supplierId = ?']
    const countParams: any[] = [idNum]
    const listConditions = ['supplierId = ?']
    const listParams: any[] = [idNum]

    if (search) {
      countConditions.push('(name LIKE ? OR type LIKE ?)')
      countParams.push(`%${search}%`, `%${search}%`)
      listConditions.push('(name LIKE ? OR type LIKE ?)')
      listParams.push(`%${search}%`, `%${search}%`)
    }

    const whereSql = `WHERE ${countConditions.join(' AND ')}`
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM supplier_products ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    listParams.push(limit, offset)
    const supplierProducts = (await query(
      `SELECT id, supplierId, supplierName, name, type, karat, weight,
       pasa, pasaReceipt, pasaRemaining, wagePerGram, totalWage,
       wageReceipt, wageRemaining, detail, createdAt, updatedAt
       FROM supplier_products
       WHERE ${listConditions.join(' AND ')}
       ORDER BY createdAt DESC
       LIMIT ? OFFSET ?`,
      listParams
    )) as any[]

    return NextResponse.json({
      success: true,
      data: supplierProducts || [],
      total,
      page,
      limit
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
