import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId')

    if (productId) {
      const reviews = await db.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(reviews)
    }

    const reviews = await db.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

interface ReviewBody {
  productId: string
  name: string
  rating: number
  title: string
  comment: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReviewBody

    if (!body.productId || !body.name || !body.title || !body.comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        productId: body.productId,
        name: body.name.trim().slice(0, 60),
        rating: Math.round(body.rating),
        title: body.title.trim().slice(0, 120),
        comment: body.comment.trim().slice(0, 1000),
      },
    })

    // Optionally update product rating to be an average of all reviews
    const allReviews = await db.review.findMany({
      where: { productId: body.productId },
      select: { rating: true },
    })
    if (allReviews.length > 0) {
      const avg =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await db.product.update({
        where: { id: body.productId },
        data: { rating: Math.round(avg * 10) / 10 },
      })
    }

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
