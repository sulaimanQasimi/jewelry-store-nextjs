import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { type, detail, quantity, sum, currency, rate, date } = await request.json()

    const newUpdatedSpent = await prisma.expenses.update({
      where: { id: parseInt(id) },
      data: { type, detail, price: sum, currency, date: date ? new Date(date) : undefined }
    })

    return NextResponse.json({
      success: true,
      message: 'موفقانه آپدیت شده است',
      newUpdatedSpent
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
