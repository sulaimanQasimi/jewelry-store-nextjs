import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const isSold = searchParams.get('isSold')
    const type = searchParams.get('type')?.trim() || ''
    const gramMin = searchParams.get('gramMin')
    const gramMax = searchParams.get('gramMax')
    const karatMin = searchParams.get('karatMin')
    const karatMax = searchParams.get('karatMax')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const dateFrom = searchParams.get('dateFrom')?.trim() || ''
    const dateTo = searchParams.get('dateTo')?.trim() || ''
    const isFragment = searchParams.get('isFragment')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (isSold !== undefined && isSold !== '') {
      const sold = isSold === 'true' ? 1 : 0
      conditions.push('isSold = ?')
      countParams.push(sold)
      listParams.push(sold)
    }
    if (isFragment !== undefined && isFragment !== '') {
      const frag = isFragment === 'true' ? 1 : 0
      conditions.push('isFragment = ?')
      countParams.push(frag)
      listParams.push(frag)
    }
    if (search) {
      conditions.push('(productName LIKE ? OR type LIKE ? OR barcode LIKE ?)')
      const term = `%${search}%`
      countParams.push(term, term, term)
      listParams.push(term, term, term)
    }
    if (type) {
      conditions.push('type LIKE ?')
      const typeTerm = `%${type}%`
      countParams.push(typeTerm)
      listParams.push(typeTerm)
    }
    if (gramMin != null && gramMin !== '') {
      const v = parseFloat(gramMin)
      if (!isNaN(v)) {
        conditions.push('gram >= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (gramMax != null && gramMax !== '') {
      const v = parseFloat(gramMax)
      if (!isNaN(v)) {
        conditions.push('gram <= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (karatMin != null && karatMin !== '') {
      const v = parseFloat(karatMin)
      if (!isNaN(v)) {
        conditions.push('karat >= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (karatMax != null && karatMax !== '') {
      const v = parseFloat(karatMax)
      if (!isNaN(v)) {
        conditions.push('karat <= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (priceMin != null && priceMin !== '') {
      const v = parseFloat(priceMin)
      if (!isNaN(v)) {
        conditions.push('purchasePriceToAfn >= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (priceMax != null && priceMax !== '') {
      const v = parseFloat(priceMax)
      if (!isNaN(v)) {
        conditions.push('purchasePriceToAfn <= ?')
        countParams.push(v)
        listParams.push(v)
      }
    }
    if (dateFrom) {
      conditions.push('DATE(createdAt) >= ?')
      countParams.push(dateFrom)
      listParams.push(dateFrom)
    }
    if (dateTo) {
      conditions.push('DATE(createdAt) <= ?')
      countParams.push(dateTo)
      listParams.push(dateTo)
    }

    const validSortColumns = ['createdAt', 'productName', 'gram', 'karat', 'purchasePriceToAfn', 'bellNumber']
    const sortCol = validSortColumns.includes(sortBy) ? sortBy : 'createdAt'
    const sortDir = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM products ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    // LIMIT/OFFSET must be literals (mysql2 prepared statement limitation)
    const data = (await query(
      `SELECT * FROM products ${whereSql} ORDER BY ${sortCol} ${sortDir} LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
