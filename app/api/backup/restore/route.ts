import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { query } from '@/lib/db'

/** Same order as backup route – restore-safe (parent tables before children) */
const RESTORE_TABLES = [
  'companies',
  'currencies',
  'storages',
  'users',
  'suppliers',
  'customers',
  'products',
  'fragments',
  'purchases',
  'purchase_items',
  'expenses',
  'loan_reports',
  'transactions',
  'supplier_products'
] as const

const VALID_COLUMN = /^[a-zA-Z0-9_]+$/

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (!user?.role) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      )
    }

    const contentType = request.headers.get('content-type') ?? ''
    let backup: Record<string, unknown[]>

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json(
          { success: false, message: 'فایل پشتیبان ارسال نشده است' },
          { status: 400 }
        )
      }
      const text = await file.text()
      backup = JSON.parse(text) as Record<string, unknown[]>
    } else {
      backup = (await request.json()) as Record<string, unknown[]>
    }

    if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
      return NextResponse.json(
        { success: false, message: 'فرمت پشتیبان نامعتبر است' },
        { status: 400 }
      )
    }

    await query('SET FOREIGN_KEY_CHECKS = 0')

    try {
      for (const table of RESTORE_TABLES) {
        const rows = backup[table]
        if (!Array.isArray(rows) || rows.length === 0) continue

        const first = rows[0] as Record<string, unknown>
        const columns = Object.keys(first).filter((c) => VALID_COLUMN.test(c))
        if (columns.length === 0) continue

        await query(`DELETE FROM \`${table}\``)

        for (const row of rows as Record<string, unknown>[]) {
          const values = columns.map((col) => row[col])
          const placeholders = columns.map(() => '?').join(', ')
          const colsList = columns.map((c) => `\`${c}\``).join(', ')
          await query(
            `INSERT INTO \`${table}\` (${colsList}) VALUES (${placeholders})`,
            values
          )
        }
      }
    } finally {
      await query('SET FOREIGN_KEY_CHECKS = 1')
    }

    return NextResponse.json({
      success: true,
      message: 'بازیابی پشتیبان با موفقیت انجام شد'
    })
  } catch (err) {
    console.error('Restore error:', err)
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'خطا در بازیابی پشتیبان' },
      { status: 500 }
    )
  }
}
