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

    const { date, usdToAfn } = await request.json()

    if (!date?.trim()) {
      return NextResponse.json({ success: false, message: 'تاریخ الزامی است' }, { status: 400 })
    }

    const rate = parseFloat(usdToAfn)
    if (isNaN(rate) || rate <= 0) {
      return NextResponse.json({ success: false, message: 'نرخ ارز باید عدد مثبت باشد' })
    }

    await query(
      'UPDATE currency_rates SET date = ?, usdToAfn = ? WHERE id = ?',
      [date.trim(), rate, idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'نرخ ارز با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
