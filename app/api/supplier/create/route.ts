import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, address } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        address: address || null
      }
    })

    return NextResponse.json({ success: true, message: 'ذخیره شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
