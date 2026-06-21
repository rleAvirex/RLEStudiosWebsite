import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'rle_admin_auth'

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET || 'fallback_secret_change_me'
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return false

  const payload = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)

  // HMAC-SHA256 via Web Crypto API (Edge Runtime compatible)
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigData = encoder.encode(payload)
  const expectedSigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, sigData)
  const expectedSig = btoa(String.fromCharCode(...new Uint8Array(expectedSigBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  // Constant-time comparison
  if (sig.length !== expectedSig.length) return false
  let result = 0
  for (let i = 0; i < sig.length; i++) {
    result |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
  }
  if (result !== 0) return false

  // Check expiry
  try {
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return data.role === 'admin' && data.exp > Date.now()
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const isAuthenticated = token ? await verifyToken(token) : false

  // If NOT authenticated and NOT already on login page → redirect to login
  if (!isAuthenticated && pathname !== '/admin/login') {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and on login page → redirect to admin dashboard
  if (isAuthenticated && pathname === '/admin/login') {
    const from = request.nextUrl.searchParams.get('from') || '/admin'
    return NextResponse.redirect(new URL(from, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
