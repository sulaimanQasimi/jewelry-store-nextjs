import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { parseJson } from '@/lib/db-sp'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const returnId = parseInt(id, 10)
    if (Number.isNaN(returnId)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query(
      `SELECT id, transactionId, productId, customerName, customerPhone, bellNumber,
              productSnapshot, note, returnedAt
       FROM returns WHERE id = ? LIMIT 1`,
      [returnId]
    )) as any[]

    if (!rows?.length) {
      return NextResponse.json({ success: false, message: 'مرجوعیه یافت نشد' }, { status: 404 })
    }

    const r = rows[0]
    const data = {
      id: r.id,
      transactionId: r.transactionId,
      productId: r.productId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      bellNumber: r.bellNumber,
      productSnapshot: parseJson(r.productSnapshot),
      note: r.note ?? null,
      returnedAt: r.returnedAt
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error?.message })
  }
}
