import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { cName, cId, amount, currency, detail, date } = await request.json()

    if (!cName?.trim() || !cId) {
      return NextResponse.json({ success: false, message: 'نام مشتری و شناسه مشتری الزامی است' })
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

    const result = (await query(
      'INSERT INTO loan_reports (cName, cId, amount, currency, detail, date) VALUES (?, ?, ?, ?, ?, ?)',
      [cName.trim(), parseInt(cId), amt, currency.trim(), detail.trim(), date ? new Date(date) : null]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'گزارش قرض با موفقیت ثبت شد',
      data: { id: result.insertId }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
