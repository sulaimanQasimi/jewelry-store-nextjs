import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const body = await request.json()
    const { type, detail, price, currency, date } = body

    if (!type?.trim() || !detail?.trim() || price == null || !currency?.trim()) {
      return NextResponse.json(
        { success: false, message: 'نوع، جزئیات، مبلغ و واحد پول الزامی است' },
        { status: 400 }
      )
    }

    await query(
      'UPDATE expenses SET type = ?, detail = ?, price = ?, currency = ?, date = ? WHERE id = ?',
      [type.trim(), detail.trim(), Number(price), currency.trim(), date ? new Date(date) : new Date(), id]
    )

    return NextResponse.json({
      success: true,
      message: 'مصرف با موفقیت به‌روزرسانی شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
