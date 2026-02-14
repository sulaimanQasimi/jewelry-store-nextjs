import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export default {
  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET || 'galaxy',
  providers: [],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (pathname === '/' || pathname === '/login') return true
      if (pathname.startsWith('/api/auth')) return true
      if (pathname.startsWith('/_next')) return true
      if (pathname.startsWith('/api/')) {
        if (!session?.user) {
          return NextResponse.json(
            { success: false, message: 'Not Authorized Login Again' },
            { status: 401 }
          )
        }
        return true
      }
      if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string
        (session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
