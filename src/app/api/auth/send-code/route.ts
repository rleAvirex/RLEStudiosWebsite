import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendMagicCodeEmail, isEmailConfigured } from '@/lib/email'

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

    const emailConfigured = isEmailConfigured()

    if (emailConfigured) {
      const sent = await sendMagicCodeEmail({ to: normalizedEmail, code })
      if (!sent) {
        return NextResponse.json(
          { error: 'Failed to send login code. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Show the code on screen only when email is NOT actually being delivered:
    //   - dev mode (NODE_ENV !== 'production'), or
    //   - no API key configured (so local dev / unconfigured deploys still work)
    const showCodeOnScreen =
      process.env.NODE_ENV !== 'production' || !emailConfigured

    return NextResponse.json({
      success: true,
      message: emailConfigured
        ? 'Code sent. Check your email.'
        : 'Email not configured — see code below (dev only).',
      ...(showCodeOnScreen && { code }),
    })
  } catch (error) {
    console.error('Error sending code:', error)
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }
}
