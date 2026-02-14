import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { type, detail, price, currency, date } = await request.json()

    if (!type || !detail || !price || !currency) {
      return NextResponse.json({ success: false, message: 'لطفا خانه های خالی را پر نمایید' })
    }

    await query(
      'INSERT INTO expenses (type, detail, price, currency, date) VALUES (?, ?, ?, ?, ?)',
      [type, detail, Number(price), currency, date ? new Date(date) : new Date()]
    )

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
