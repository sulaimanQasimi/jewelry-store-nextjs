import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { gram, wareHouse, changedToPasa, remain, amount, detail, isCompleted } = await request.json()

    const g = parseFloat(gram)
    const amt = parseFloat(amount)
    if (isNaN(g) || g <= 0) {
      return NextResponse.json({ success: false, message: 'وزن باید عدد مثبت باشد' })
    }
    if (isNaN(amt) || amt < 0) {
      return NextResponse.json({ success: false, message: 'مبلغ نامعتبر است' })
    }

    const result = (await query(
      `INSERT INTO fragments (gram, wareHouse, changedToPasa, remain, amount, detail, isCompleted)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        g,
        parseFloat(wareHouse) || 0,
        parseFloat(changedToPasa) || 0,
        remain != null ? parseFloat(remain) : null,
        amt,
        detail?.trim() || null,
        isCompleted ? 1 : 0
      ]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'شکسته با موفقیت ثبت شد',
      data: { id: result.insertId }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
