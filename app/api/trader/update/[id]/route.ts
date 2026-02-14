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
    const { name, phone, address } = body

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, message: 'نام و شماره تماس الزامی است' },
        { status: 400 }
      )
    }

    await query(
      'UPDATE traders SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name.trim(), phone.trim(), address?.trim() || null, id]
    )

    return NextResponse.json({
      success: true,
      message: 'معامله‌دار با موفقیت به‌روزرسانی شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
