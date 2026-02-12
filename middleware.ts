import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  // Skip auth for login page and API login endpoint
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/api/admin/login'
  ) {
    return NextResponse.next()
  }

  // Check for API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const token = request.headers.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not Authorized Login Again' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'galaxy')
      const expectedValue = (process.env.ADMIN_EMAIL || '') + (process.env.ADMIN_PASSWORD || '')
      
      if (decoded !== expectedValue) {
        return NextResponse.json(
          { success: false, message: 'Not Authorized Login Again' },
          { status: 401 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Not Authorized Login Again' },
        { status: 401 }
      )
    }
  }

  // Check for protected pages
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname !== '/login') {
    const token = request.cookies.get('token')?.value || request.headers.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'galaxy')
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
