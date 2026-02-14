import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const id = parseInt(customerId, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const rows = (await query(
      `SELECT id, customerName, phone, email, address, date, image, secondaryPhone,
       companyName, notes, birthDate, nationalId, facebookUrl, instagramUrl, whatsappUrl, telegramUrl
       FROM customers WHERE id = ?`,
      [id]
    )) as any[]

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'مشتری یافت نشد' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
