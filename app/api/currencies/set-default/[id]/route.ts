import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query('SELECT id FROM currencies WHERE id = ? AND active = 1', [id])) as any[]
    if (!rows?.length) {
      return NextResponse.json({ success: false, message: 'ارز یافت نشد یا غیرفعال است' }, { status: 404 })
    }

    await query('UPDATE currencies SET is_default = 0')
    await query('UPDATE currencies SET is_default = 1 WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'ارز به عنوان پیش‌فرض تنظیم شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
