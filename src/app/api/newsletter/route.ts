import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed', success: true })
    }

    await db.newsletterSubscriber.create({
      data: { email },
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
