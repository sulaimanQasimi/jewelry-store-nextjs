import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query(
      'SELECT id, name, phone, address, isActive FROM suppliers WHERE id = ?',
      [id]
    )) as Record<string, unknown>[]

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'تمویل‌کننده یافت نشد' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
