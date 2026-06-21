import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing codes for this email
    await db.verificationCode.deleteMany({ where: { email: normalizedEmail } })

    // Store the new code
    await db.verificationCode.create({
      data: {
        email: normalizedEmail,
        code,
        expiresAt,
      },
    })

    // In dev mode, return the code so it can be displayed on screen
    // In production, you'd send this via email (Resend, Postmark, etc.)
    const isDev = process.env.NODE_ENV !== 'production'

    return NextResponse.json({
      success: true,
      message: 'Code sent. Check your email.',
      // Only include code in dev mode
      ...(isDev && { code }),
    })
  } catch (error) {
    console.error('Error sending code:', error)
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }
}
