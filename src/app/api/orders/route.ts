import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface OrderItemInput {
  productId: string
  name: string
  price: number
  quantity: number
}

interface OrderRequestBody {
  email: string
  name: string
  items: OrderItemInput[]
  totalPrice: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody

    if (!body.email || !body.name || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, items' },
        { status: 400 }
      )
    }

    const order = await db.order.create({
      data: {
        email: body.email,
        name: body.name,
        totalPrice: body.totalPrice,
        status: 'completed',
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // Increment salesCount for each purchased product
    for (const item of body.items) {
      try {
        await db.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: item.quantity } },
        })
      } catch {
        // Skip if product not found
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
