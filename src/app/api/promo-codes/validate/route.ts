import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface ValidateBody {
  code: string
  subtotal: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidateBody
    const code = (body.code || '').trim().toUpperCase()
    const subtotal = Number(body.subtotal) || 0

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const promo = await db.promoCode.findUnique({
      where: { code },
    })

    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired promo code' },
        { status: 200 }
      )
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This promo code has expired' },
        { status: 200 }
      )
    }

    if (promo.maxUses > 0 && promo.usesCount >= promo.maxUses) {
      return NextResponse.json(
        { valid: false, error: 'This promo code has reached its usage limit' },
        { status: 200 }
      )
    }

    if (subtotal < promo.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order of €${promo.minOrder.toFixed(2)} required for this code`,
        },
        { status: 200 }
      )
    }

    let discount = 0
    if (promo.discountType === 'percent') {
      discount = (subtotal * promo.discountValue) / 100
    } else {
      discount = promo.discountValue
    }
    // Don't allow discount to exceed subtotal
    discount = Math.min(discount, subtotal)

    return NextResponse.json({
      valid: true,
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount,
      newTotal: Math.max(0, subtotal - discount),
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 })
  }
}
