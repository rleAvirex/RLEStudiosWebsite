import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'rle_admin_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

function getSecret(): string {
  return process.env.ADMIN_SECRET || 'fallback_secret_change_me_immediately'
}

function createToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', iat: Date.now(), exp: Date.now() + COOKIE_MAX_AGE * 1000 })
  ).toString('base64url')
  const sig = createHmac('sha256', getSecret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function verifyToken(token: string): boolean {
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return false
  const payload = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)
  const expectedSig = createHmac('sha256', getSecret()).update(payload).digest('base64url')

  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) return false
  if (!timingSafeEqual(sigBuf, expectedBuf)) return false

  // Check expiry
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.role === 'admin' && data.exp > Date.now()
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin auth not configured' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = createToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ authenticated: false })
  return NextResponse.json({ authenticated: verifyToken(token) })
}
