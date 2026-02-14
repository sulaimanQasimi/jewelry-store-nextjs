import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function toPlainCustomer(r: Record<string, unknown>): Record<string, unknown> {
  return {
    id: r.id,
    customerName: r.customerName ?? r.customername,
    phone: r.phone,
    email: r.email ?? null,
    address: r.address ?? null,
    date: r.date,
    image: r.image ?? null,
    secondaryPhone: r.secondaryPhone ?? r.secondaryphone ?? null,
    companyName: r.companyName ?? r.companyname ?? null,
    notes: r.notes ?? null,
    birthDate: r.birthDate ?? r.birthdate ?? null,
    nationalId: r.nationalId ?? r.nationalid ?? null,
    facebookUrl: r.facebookUrl ?? r.facebookurl ?? null,
    instagramUrl: r.instagramUrl ?? r.instagramurl ?? null,
    whatsappUrl: r.whatsappUrl ?? r.whatsappurl ?? null,
    telegramUrl: r.telegramUrl ?? r.telegramurl ?? null
  }
}

export async function GET(request: NextRequest) {
  try {
    const urlQuery = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(urlQuery.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(urlQuery.get('limit') || '10', 10)))
    const search = urlQuery.get('search')?.trim() || ''
    const offset = (page - 1) * limit

    const countResult = await query(
      search
        ? 'SELECT COUNT(*) AS total FROM customers WHERE customerName LIKE ? OR phone LIKE ?'
        : 'SELECT COUNT(*) AS total FROM customers',
      search ? [`%${search}%`, `%${search}%`] : []
    ) as { total: number }[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const whereClause = search ? 'WHERE customerName LIKE ? OR phone LIKE ?' : ''
    const whereParams = search ? [`%${search}%`, `%${search}%`] : []
    // LIMIT/OFFSET as literals to avoid "Incorrect arguments to mysqld_stmt_execute" (limit/offset are already sanitized integers)
    const sql = `SELECT * FROM customers ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
    const rows = (await query(sql, whereParams)) as Record<string, unknown>[]
    const list = Array.isArray(rows) ? rows.map((r) => toPlainCustomer(r)) : []

    return NextResponse.json({
      success: true,
      data: list,
      customers: list,
      total,
      page,
      limit
    })
  } catch (error: unknown) {
    console.error('registered-customers error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در بارگذاری مشتریان',
        data: [],
        customers: [],
        total: 0,
        page: 1,
        limit: 10
      },
      { status: 200 }
    )
  }
}
