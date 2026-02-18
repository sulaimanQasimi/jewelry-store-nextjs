import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { parseJson } from '@/lib/db-sp'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transactionId = parseInt(id, 10)
    if (Number.isNaN(transactionId)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query(
      `SELECT id, customerId, customerName, customerPhone, product, receipt, bellNumber, note, createdAt
       FROM transactions WHERE id = ? LIMIT 1`,
      [transactionId]
    )) as any[]

    if (!rows?.length) {
      return NextResponse.json({ success: false, message: 'فروش یافت نشد' }, { status: 404 })
    }

    const r = rows[0]
    const data = {
      id: r.id,
      customerId: r.customerId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      product: parseJson(r.product),
      receipt: parseJson(r.receipt),
      bellNumber: r.bellNumber,
      note: r.note ?? null,
      createdAt: r.createdAt
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error?.message })
  }
}
