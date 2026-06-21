import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface HelpfulBody {
  reviewId: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HelpfulBody

    if (!body.reviewId) {
      return NextResponse.json({ error: 'reviewId is required' }, { status: 400 })
    }

    const review = await db.review.findUnique({
      where: { id: body.reviewId },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const updated = await db.review.update({
      where: { id: body.reviewId },
      data: { helpful: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      helpful: updated.helpful,
    })
  } catch (error) {
    console.error('Error updating helpful count:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
