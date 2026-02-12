import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const transactions = await prisma.transaction.findMany()

    // Filter transactions with remaining amount > 0
    const loans = transactions
      .filter((trx) => {
        const receipt = trx.receipt as any
        return receipt?.remainingAmount > 0
      })
      .reduce((acc: any, trx) => {
        const receipt = trx.receipt as any
        if (!acc[trx.customerId]) {
          acc[trx.customerId] = {
            customerId: trx.customerId,
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
        acc[trx.customerId].totalAmount += receipt.totalAmount || 0
        acc[trx.customerId].totalLoan += receipt.remainingAmount || 0
        acc[trx.customerId].totalPaid += receipt.paidAmount || 0
        acc[trx.customerId].totalDiscount += receipt.discount || 0
        acc[trx.customerId].transactionsCount += 1
        return acc
      }, {})

    const loansArray = Object.values(loans).sort((a: any, b: any) => b.totalLoan - a.totalLoan)

    if (loansArray.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'هیچ مشتری قرضدار نیست'
      })
    }

    return NextResponse.json({
      success: true,
      loans: loansArray
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
