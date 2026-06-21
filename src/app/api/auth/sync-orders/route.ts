import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Sync guest localStorage orders to DB when user logs in
// Expects: { email, orders: [...] } in body
// The user's session is identified by the NextAuth JWT cookie

export async function POST(request: Request) {
  try {
    const { email, orders } = await request.json()

    if (!email || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ synced: 0 })
    }

    // Find the user
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ synced: 0 })

    let synced = 0

    for (const order of orders) {
      // Check if this order already exists in DB (by orderId)
      const existing = await db.order.findUnique({
        where: { id: order.orderId },
      })
      if (existing) continue

      // Re-create the order in DB linked to the user
      await db.order.create({
        data: {
          id: order.orderId,
          email: email.toLowerCase(),
          name: order.name || 'Guest',
          totalPrice: order.totalPrice,
          subtotal: order.subtotal || order.totalPrice,
          discount: order.discount || 0,
          promoCode: order.promoCode || null,
          status: 'completed',
          userId: user.id,
          items: {
            create: order.items.map((item: { productId: string; name: string; price: number; quantity: number }) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      })
      synced++
    }

    return NextResponse.json({ synced })
  } catch (error) {
    console.error('Error syncing orders:', error)
    return NextResponse.json({ error: 'Failed to sync orders' }, { status: 500 })
  }
}
