import { NextRequest, NextResponse } from 'next/server'
import { submitAccountTransaction } from '@/lib/actions/accounts'
import type { TransactionType } from '@/lib/actions/accounts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const accountId = body.accountId ?? body.account_id
    const type = (body.type === 'debit' ? 'debit' : 'credit') as TransactionType
    const amount = parseFloat(body.amount)
    const description = body.description?.trim() || null

    if (!accountId || typeof accountId !== 'string') {
      return NextResponse.json({ success: false, message: 'Account ID required' }, { status: 400 })
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Valid positive amount required' }, { status: 400 })
    }

    const result = await submitAccountTransaction(accountId, amount, type, description)
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error ?? 'Transaction failed' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[accounts/transaction]', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Transaction failed' },
      { status: 500 }
    )
  }
}
