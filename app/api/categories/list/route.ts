import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const data = (await query(
      'SELECT id, name, createdAt FROM categories ORDER BY name',
      []
    )) as { id: number; name: string; createdAt?: string }[]

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
