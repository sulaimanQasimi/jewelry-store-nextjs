import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const expenses = await prisma.expenses.findMany()

    // Group by type and currency
    const grouped = expenses.reduce((acc: any, expense) => {
      const key = `${expense.type}-${expense.currency}`
      if (!acc[key]) {
        acc[key] = {
          _id: { type: expense.type, currency: expense.currency },
          price: 0
        }
      }
      acc[key].price += expense.price
      return acc
    }, {})

    const total = Object.values(grouped)

    if (total.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    return NextResponse.json({ success: true, total })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
