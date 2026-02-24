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

    const rows = (await query('SELECT id, is_default FROM currencies WHERE id = ?', [id])) as any[]
    if (!rows?.length) {
      return NextResponse.json({ success: false, message: 'ارز یافت نشد' }, { status: 404 })
    }
    if (rows[0].is_default) {
      return NextResponse.json(
        { success: false, message: 'ارز پیش‌فرض را نمی‌توان حذف کرد. ابتدا یک ارز دیگر را به عنوان پیش‌فرض تنظیم کنید.' },
        { status: 400 }
      )
    }

    await query('DELETE FROM currencies WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'ارز با موفقیت حذف شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
