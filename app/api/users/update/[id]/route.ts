import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { query } from '@/lib/db'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function PUT(
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

    const isSelf = String(currentUser.id) === String(idNum)

    const body = await request.json()
    const { username, email, role, is_active, password } = body
    const usernameTrim = typeof username === 'string' ? username.trim() : undefined
    const emailTrim = typeof email === 'string' ? email.trim() : undefined
    const validRole = role === 'user' ? 'user' : role === 'admin' ? 'admin' : undefined
    const activeBool = typeof is_active === 'boolean' ? is_active : undefined

    if (emailTrim && !EMAIL_REGEX.test(emailTrim)) {
      return NextResponse.json(
        { success: false, message: 'فرمت ایمیل نامعتبر است' },
        { status: 400 }
      )
    }

    if (usernameTrim !== undefined || emailTrim !== undefined) {
      const orParts: string[] = []
      const condParams: any[] = [idNum]
      if (usernameTrim !== undefined) {
        orParts.push('username = ?')
        condParams.push(usernameTrim)
      }
      if (emailTrim !== undefined) {
        orParts.push('email = ?')
        condParams.push(emailTrim)
      }
      const existing = (await query(
        `SELECT id FROM users WHERE id != ? AND (${orParts.join(' OR ')}) LIMIT 1`,
        condParams
      )) as any[]
      if (existing?.length) {
        return NextResponse.json(
          { success: false, message: 'نام کاربری یا ایمیل قبلاً استفاده شده است' },
          { status: 400 }
        )
      }
    }

    const updates: string[] = []
    const values: any[] = []

    if (usernameTrim !== undefined) {
      updates.push('username = ?')
      values.push(usernameTrim)
    }
    if (emailTrim !== undefined) {
      updates.push('email = ?')
      values.push(emailTrim)
    }
    if (validRole !== undefined) {
      updates.push('role = ?')
      values.push(validRole)
    }
    if (activeBool !== undefined && !isSelf) {
      updates.push('is_active = ?')
      values.push(activeBool ? 1 : 0)
    } else if (activeBool === false && isSelf) {
      return NextResponse.json(
        { success: false, message: 'امکان غیرفعال کردن خودتان وجود ندارد' },
        { status: 400 }
      )
    }
    if (password && String(password).length > 0) {
      const password_hash = await bcrypt.hash(String(password), 10)
      updates.push('password_hash = ?')
      values.push(password_hash)
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'تغییری اعمال نشد' })
    }

    values.push(idNum)
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
