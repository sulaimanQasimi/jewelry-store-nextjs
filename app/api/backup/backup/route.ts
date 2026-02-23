import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'
import { query } from '@/lib/db'

/** Tables to export, in restore-safe order (no FKs violated if restored in this order) */
const BACKUP_TABLES = [
  'companies',
  'currency_rates',
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

export async function POST() {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (!user?.role) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      )
    }

    const backup: Record<string, unknown[]> = {
      _meta: [
        {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          tables: [...BACKUP_TABLES]
        }
      ] as unknown[]
    }

    for (const table of BACKUP_TABLES) {
      try {
        // Table name is from our constant list - safe to interpolate
        const rows = (await query(`SELECT * FROM \`${table}\``)) as unknown[]
        backup[table] = Array.isArray(rows) ? rows : []
      } catch (e) {
        console.warn(`Backup: skip table ${table}`, e)
        backup[table] = []
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `jewelry-store-backup-${timestamp}.json`
    const backupDir = join(process.cwd(), 'backups')

    try {
      await mkdir(backupDir, { recursive: true })
      const filepath = join(backupDir, filename)
      await writeFile(filepath, JSON.stringify(backup, null, 0), 'utf-8')
    } catch (err) {
      console.error('Backup write error:', err)
      return NextResponse.json(
        { success: false, message: 'Could not save backup file. Check server storage.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `پشتیبان با موفقیت ذخیره شد: ${filename}`
    })
  } catch (err) {
    console.error('Backup error:', err)
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد پشتیبان' },
      { status: 500 }
    )
  }
}
