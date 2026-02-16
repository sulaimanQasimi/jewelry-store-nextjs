import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.JWT_SECRET || 'galaxy'
)

async function verifyBearerToken(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  if (!token) return false
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

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
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (pathname === '/' || pathname === '/login') return true
      if (pathname.startsWith('/api/auth')) return true
      if (pathname.startsWith('/_next')) return true
      if (pathname.startsWith('/api/')) {
        const bearerValid = await verifyBearerToken(request)
        if (bearerValid) return true
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
