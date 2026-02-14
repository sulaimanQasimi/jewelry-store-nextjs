export const PUBLIC_PATHS = ['/', '/login'] as const
export const API_AUTH_PUBLIC = ['/api/admin/login', '/api/auth/login', '/api/auth/logout', '/api/auth/session'] as const

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => p === pathname)
}

export function isApiAuthPublic(pathname: string): boolean {
  return API_AUTH_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '?'))
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false
  if (pathname.startsWith('/api/')) return false // API handled separately
  if (pathname.startsWith('/_next')) return false
  return true
}
