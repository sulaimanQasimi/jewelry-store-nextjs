import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, personId, amount, currency, detail } = await request.json()

    if (!name?.trim() || !personId) {
      return NextResponse.json({ success: false, message: 'نام و شخص الزامی است' })
    }

    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ باید عدد مثبت باشد' })
    }

    if (!currency?.trim()) {
      return NextResponse.json({ success: false, message: 'واحد پول الزامی است' })
    }

    const result = (await query(
      'INSERT INTO personal_expenses (name, personId, amount, currency, detail) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), parseInt(personId), amt, currency.trim(), detail?.trim() || null]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'مصرف شخصی با موفقیت ثبت شد',
      data: { id: result.insertId }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
