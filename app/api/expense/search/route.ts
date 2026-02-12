import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    let where: any = {}

    if (search) {
      where.type = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const expense = await prisma.expenses.findMany({
      where
    })

    return NextResponse.json({
      success: true,
      data: expense
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
