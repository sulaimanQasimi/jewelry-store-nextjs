import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const purchaseRows = (await query('SELECT * FROM purchases WHERE id = ?', [idNum])) as any[]
    if (!purchaseRows?.length) {
      return NextResponse.json({ success: false, message: 'خرید یافت نشد' }, { status: 404 })
    }

    const items = (await query('SELECT * FROM purchase_items WHERE purchaseId = ?', [idNum])) as any[]
    const purchase = { ...purchaseRows[0], items }

    return NextResponse.json({ success: true, data: purchase })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
