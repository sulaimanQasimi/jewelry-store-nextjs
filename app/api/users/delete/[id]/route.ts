import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { query } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const currentUser = session?.user as { id?: string; role?: string } | undefined
    if (!currentUser?.role || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    if (String(currentUser.id) === String(idNum)) {
      return NextResponse.json(
        { success: false, message: 'امکان حذف خودتان وجود ندارد' },
        { status: 400 }
      )
    }

    await query('UPDATE users SET is_active = 0 WHERE id = ?', [idNum])

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت غیرفعال شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
