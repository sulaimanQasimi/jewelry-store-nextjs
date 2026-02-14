import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const id = parseInt(customerId, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const result = (await query('DELETE FROM customers WHERE id = ?', [id])) as any
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'مشتری یافت نشد' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'مشتری حذف شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
