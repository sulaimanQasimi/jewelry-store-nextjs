import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    let supplier: any[]
    if (search && search.trim()) {
      supplier = await query(
        'SELECT id, name, phone, address, isActive FROM suppliers WHERE isActive = 1 AND name LIKE ? ORDER BY name LIMIT 10',
        [`%${search.trim()}%`]
      ) as any[]
    } else {
      supplier = await query(
        'SELECT id, name, phone, address, isActive FROM suppliers WHERE isActive = 1 ORDER BY name LIMIT 10'
      ) as any[]
    }

    if (!supplier || supplier.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    return NextResponse.json({ success: true, supplier })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
