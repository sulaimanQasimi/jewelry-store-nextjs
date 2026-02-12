import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { password, email } = await request.json()

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        email + password,
        process.env.JWT_SECRET || 'galaxy'
      )
      return NextResponse.json({ success: true, token })
    } else {
      return NextResponse.json({ success: false, message: 'invalid credentials' })
    }
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
