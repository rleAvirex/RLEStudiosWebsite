import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const SAMPLE_PROMO_CODES = [
  {
    code: 'WELCOME10',
    description: '10% off your order — welcome to RLE Studios',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 0,
    maxUses: 0,
  },
  {
    code: 'FIVEM20',
    description: '20% off orders over €50',
    discountType: 'percent',
    discountValue: 20,
    minOrder: 50,
    maxUses: 0,
  },
  {
    code: 'SAVE5',
    description: '€5 off any order',
    discountType: 'fixed',
    discountValue: 5,
    minOrder: 0,
    maxUses: 0,
  },
  {
    code: 'BUNDLE30',
    description: '30% off — auto-applied for 3+ featured scripts (try this code too)',
    discountType: 'percent',
    discountValue: 30,
    minOrder: 0,
    maxUses: 0,
  },
]

export async function POST() {
  try {
    const existing = await db.promoCode.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Promo codes already seeded', count: existing })
    }

    await db.promoCode.createMany({
      data: SAMPLE_PROMO_CODES,
    })

    return NextResponse.json({ message: 'Promo codes seeded', count: SAMPLE_PROMO_CODES.length })
  } catch (error) {
    console.error('Error seeding promo codes:', error)
    return NextResponse.json({ error: 'Failed to seed promo codes' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Don't expose actual discount values publicly — return only active codes' descriptions
    const codes = await db.promoCode.findMany({
      where: { isActive: true },
      select: {
        code: true,
        description: true,
        discountType: true,
        minOrder: true,
      },
    })
    return NextResponse.json(codes)
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 })
  }
}
