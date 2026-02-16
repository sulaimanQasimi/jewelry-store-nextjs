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

    const { cName, cId, amount, currency, detail, date } = await request.json()

    if (!cName?.trim() || !cId) {
      return NextResponse.json({ success: false, message: 'نام مشتری و شناسه مشتری الزامی است' }, { status: 400 })
    }

    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ باید عدد مثبت باشد' })
    }

    if (!currency?.trim()) {
      return NextResponse.json({ success: false, message: 'واحد پول الزامی است' })
    }

    if (!detail?.trim()) {
      return NextResponse.json({ success: false, message: 'جزئیات الزامی است' })
    }

    await query(
      'UPDATE loan_reports SET cName = ?, cId = ?, amount = ?, currency = ?, detail = ?, date = ? WHERE id = ?',
      [cName.trim(), parseInt(cId), amt, currency.trim(), detail.trim(), date ? new Date(date) : null, idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'گزارش قرض با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
