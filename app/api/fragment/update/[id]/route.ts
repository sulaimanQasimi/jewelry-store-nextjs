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

    const { gram, wareHouse, changedToPasa, remain, amount, detail, isCompleted } = await request.json()

    const g = parseFloat(gram)
    const amt = parseFloat(amount)
    if (isNaN(g) || g <= 0) {
      return NextResponse.json({ success: false, message: 'وزن باید عدد مثبت باشد' })
    }
    if (isNaN(amt) || amt < 0) {
      return NextResponse.json({ success: false, message: 'مبلغ نامعتبر است' })
    }

    await query(
      `UPDATE fragments SET gram = ?, wareHouse = ?, changedToPasa = ?, remain = ?, amount = ?, detail = ?, isCompleted = ? WHERE id = ?`,
      [
        g,
        parseFloat(wareHouse) || 0,
        parseFloat(changedToPasa) || 0,
        remain != null ? parseFloat(remain) : null,
        amt,
        detail?.trim() || null,
        isCompleted ? 1 : 0,
        idNum
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'شکسته با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
