import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const { name, personId, amount, currency, detail } = await request.json()

    if (!name?.trim() || !personId) {
      return NextResponse.json({ success: false, message: 'نام و شخص الزامی است' }, { status: 400 })
    }

    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ باید عدد مثبت باشد' })
    }

    if (!currency?.trim()) {
      return NextResponse.json({ success: false, message: 'واحد پول الزامی است' })
    }

    await query(
      'UPDATE personal_expenses SET name = ?, personId = ?, amount = ?, currency = ?, detail = ? WHERE id = ?',
      [name.trim(), parseInt(personId), amt, currency.trim(), detail?.trim() || null, idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'مصرف شخصی با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
