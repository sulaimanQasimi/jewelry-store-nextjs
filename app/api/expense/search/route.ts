import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.trim()

    let expense: any[]

    if (search) {
      expense = (await query(
        'SELECT * FROM expenses WHERE type LIKE ?',
        [`%${search}%`]
      )) as any[]
    } else {
      expense = (await query('SELECT * FROM expenses')) as any[]
    }

    return NextResponse.json({
      success: true,
      data: expense
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
