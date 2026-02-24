import { NextRequest, NextResponse } from 'next/server'
import { getAccount, getAccountTransactions } from '@/lib/actions/accounts'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const account = await getAccount(id)
    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 })
    }
    const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '50', 10)))
    const transactions = await getAccountTransactions(id, limit)
    return NextResponse.json({ success: true, data: { account, transactions } })
  } catch (error: unknown) {
    console.error('[accounts/id]', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to get account' },
      { status: 500 }
    )
  }
}
