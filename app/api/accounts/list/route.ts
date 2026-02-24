import { NextResponse } from 'next/server'
import { getAccounts } from '@/lib/actions/accounts'

export async function GET() {
  try {
    const accounts = await getAccounts()
    return NextResponse.json({ success: true, data: accounts })
  } catch (error: unknown) {
    console.error('[accounts/list]', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to list accounts' },
      { status: 500 }
    )
  }
}
