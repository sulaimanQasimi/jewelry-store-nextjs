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

    const { name, phone } = await request.json()

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ success: false, message: 'نام و شماره تماس الزامی است' }, { status: 400 })
    }

    await query(
      'UPDATE persons SET name = ?, phone = ? WHERE id = ?',
      [name.trim(), phone.trim(), idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'شخص با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
