import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { password, email, username } = await request.json()

    // Support both email and username login
    const loginIdentifier = email || username

    if (!loginIdentifier || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'لطفا ایمیل/نام کاربری و رمز عبور را وارد کنید' 
      })
    }

    // First check database users table
    const users = await query(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [loginIdentifier, loginIdentifier, password]
    ) as any[]

    if (users && users.length > 0) {
      const user = users[0]
      const token = jwt.sign(
        `${user.email}${user.password}`,
        process.env.JWT_SECRET || 'galaxy'
      )
      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      })
    }

    // Fallback to environment variables for backward compatibility
    if (
      loginIdentifier === process.env.ADMIN_EMAIL && 
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        loginIdentifier + password,
        process.env.JWT_SECRET || 'galaxy'
      )
      return NextResponse.json({ success: true, token })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'ایمیل/نام کاربری یا رمز عبور نادرست است' 
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'خطا در ورود به سیستم' 
    })
  }
}
