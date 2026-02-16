import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token',
}

export default async function middleware(request: Request) {
  // CORS preflight: return 204 immediately so Flutter web cross-origin requests succeed
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }
  return auth(request as any, {} as any)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
