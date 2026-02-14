import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    await query('DELETE FROM supplier_products WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'جنس تمویل حذف شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
