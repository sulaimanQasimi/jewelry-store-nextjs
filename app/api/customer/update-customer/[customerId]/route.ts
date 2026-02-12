import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params
    const { customerName, phone, email, address } = await request.json()

    if (!customerId) {
      return NextResponse.json({ success: false, message: 'مشتری انتخاب نشد' })
    }

    const newUpdatedCustomer = await prisma.customer.update({
      where: { id: parseInt(customerId) },
      data: { customerName, phone, email, address }
    })

    return NextResponse.json({
      success: true,
      message: 'اطلاعات مشتری آپدیت شد',
      newUpdatedCustomer
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
