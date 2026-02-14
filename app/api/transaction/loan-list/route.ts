import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''

    const rows = (await query(
      'SELECT id, customerId, customerName, customerPhone, receipt, createdAt FROM transactions ORDER BY id DESC'
    )) as any[]

    const receiptMap: Record<number, any> = {}
    for (const trx of rows || []) {
      const receipt = typeof trx.receipt === 'string' ? JSON.parse(trx.receipt || '{}') : trx.receipt || {}
      const remaining = Number(receipt.remainingAmount) || 0
      if (remaining <= 0) continue

      const cid = trx.customerId
      if (!receiptMap[cid]) {
        receiptMap[cid] = {
          customerId: cid,
          transactionId: trx.id,
          customerName: trx.customerName,
          customerPhone: trx.customerPhone,
          totalAmount: 0,
          totalLoan: 0,
          totalPaid: 0,
          totalDiscount: 0,
          transactionsCount: 0
        }
      }
      receiptMap[cid].totalAmount += Number(receipt.totalAmount) || 0
      receiptMap[cid].totalLoan += remaining
      receiptMap[cid].totalPaid += Number(receipt.paidAmount) || 0
      receiptMap[cid].totalDiscount += Number(receipt.discount) || 0
      receiptMap[cid].transactionsCount += 1
    }

    let loansArray = Object.values(receiptMap).sort((a: any, b: any) => b.totalLoan - a.totalLoan)

    if (search) {
      const term = search.toLowerCase()
      loansArray = loansArray.filter(
        (l: any) =>
          String(l.customerName || '').toLowerCase().includes(term) ||
          String(l.customerPhone || '').toLowerCase().includes(term)
      )
    }

    const total = loansArray.length
    const start = (page - 1) * limit
    const data = loansArray.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      data,
      loans: data,
      total,
      page,
      limit
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
