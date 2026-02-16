import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query(
      `SELECT pe.*, p.name AS personName, p.phone AS personPhone
       FROM personal_expenses pe
       LEFT JOIN persons p ON pe.personId = p.id
       WHERE pe.id = ?`,
      [idNum]
    )) as any[]

    if (!rows?.length) {
      return NextResponse.json({ success: false, message: 'مصرف شخصی یافت نشد' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
