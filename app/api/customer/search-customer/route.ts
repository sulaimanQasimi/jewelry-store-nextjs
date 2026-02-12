import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json({ success: false, message: 'لطفا چیزی بنویسید' })
    }

    const result = await prisma.customer.findMany({
      where: {
        customerName: {
          contains: q,
          mode: 'insensitive'
        }
      }
    })

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
