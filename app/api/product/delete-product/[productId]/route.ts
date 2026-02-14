import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const id = parseInt(productId, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }
    const result = (await query('DELETE FROM products WHERE id = ?', [id])) as { affectedRows?: number }
    if (!result?.affectedRows || result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'محصول حذف شد' })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
