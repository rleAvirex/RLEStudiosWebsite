import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Seed sample reviews for each product
const SAMPLE_REVIEWS = [
  // Garage
  { match: 'garage', reviews: [
    { name: 'Marcus K.', rating: 5, title: 'Best garage system on the market', comment: 'Setup took 10 minutes. The impound system works flawlessly and players love the vehicle preview. Highly recommend for any serious server.' },
    { name: 'ServerAdmin Pro', rating: 5, title: 'Well worth the price', comment: 'The admin panel alone is worth it. Managing garages is finally easy. Performance is great even with 200+ players online.' },
    { name: 'DevSarah', rating: 4, title: 'Great script, minor docs issue', comment: 'Script works perfectly but the documentation could be clearer for the shared garage config. Dev team helped me on Discord quickly.' },
  ]},
  // HUD
  { match: 'hud', reviews: [
    { name: 'NovaRP', rating: 5, title: 'Cleanest HUD I have used', comment: 'Players constantly compliment the new HUD. The voice indicator is a nice touch. Customization options are extensive.' },
    { name: 'HexDev', rating: 5, title: 'Perfect out of the box', comment: 'Worked immediately after install. The stress system integration is clever. No performance impact at all.' },
    { name: 'Mia T.', rating: 4, title: 'Looks amazing, small bug fixed fast', comment: 'Had a minor issue with the seatbelt indicator but the team pushed a fix within hours. Beautiful design overall.' },
  ]},
  // Drugs
  { match: 'drugs', reviews: [
    { name: 'Carlos P.', rating: 5, title: 'Added so much RP value', comment: 'The territory system creates actual conflict between gangs. Police detection makes it tense. Best economy script we have.' },
    { name: 'ZetaRP', rating: 4, title: 'Solid system', comment: 'Processing animations are smooth. Would love to see more drug types added in future updates but what is there is great.' },
  ]},
  // Banking
  { match: 'banking', reviews: [
    { name: 'Aiden R.', rating: 5, title: 'Backbone of our economy', comment: 'The loan system with interest is genius. Wire transfers work perfectly. NUI is beautiful and responsive.' },
    { name: 'FiveRP', rating: 5, title: 'Replaced 3 scripts with this one', comment: 'We had separate ATM, bank, and transfer scripts. This replaced all of them and works better. Money well spent.' },
  ]},
  // Housing
  { match: 'housing', reviews: [
    { name: 'Dmitri V.', rating: 4, title: 'Great housing system', comment: 'Shell interiors look good. Furniture placement is intuitive. Would be 5 stars with more shell options.' },
    { name: 'PropertyPro', rating: 5, title: 'Finally a housing system that works', comment: 'Key management is well thought out. Storage integration is seamless. Players actually use housing now.' },
  ]},
  // MDT
  { match: 'mdt', reviews: [
    { name: 'PoliceChief', rating: 5, title: 'MDT is incredible', comment: 'Our officers actually want to use this. The dispatch integration is seamless. Reports are easy to file and search.' },
    { name: 'LAW_DEV', rating: 5, title: 'Worth every cent', comment: 'The warrant system alone transformed our roleplay. Vehicle records lookup is fast. 10/10 would buy again.' },
    { name: 'Sarah L.', rating: 5, title: 'Best MDT available', comment: 'Tried 3 other MDT scripts before this one. None compare. The staff management features are a bonus.' },
  ]},
  // Inventory
  { match: 'inventory', reviews: [
    { name: 'InvMaster', rating: 5, title: 'Finally a clean inventory', comment: 'Drag and drop works smoothly. Weight system is balanced. Hotbar with keybinds is exactly what we needed.' },
    { name: 'QBCore User', rating: 4, title: 'Good replacement for default', comment: 'Much better than the default qb-inventory. Crafting system is a nice addition. Could use more documentation.' },
  ]},
  // Ambulance
  { match: 'ambulance', reviews: [
    { name: 'EMS Lead', rating: 5, title: 'EMS finally fun to play', comment: 'The injury system makes revives meaningful. CPR animations add RP value. Stretcher system is awesome.' },
    { name: 'MedicMike', rating: 4, title: 'Solid EMS overhaul', comment: 'Hospital check-in flow is smooth. Medical items work well. Would like to see more injury types in future.' },
  ]},
  // Carwash
  { match: 'carwash', reviews: [
    { name: 'SmallServer', rating: 4, title: 'Simple and works', comment: 'Does exactly what it says. Animations are clean. Pricing config is flexible. Great value for the price.' },
    { name: 'CarWashOwner', rating: 5, title: 'Perfect little addition', comment: 'Players actually use car washes now. Dirt accumulation over time is a nice touch. Easy to set up multiple locations.' },
  ]},
]

export async function POST() {
  try {
    const existing = await db.review.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Reviews already seeded', count: existing })
    }

    const products = await db.product.findMany()
    let seeded = 0

    for (const product of products) {
      const reviewSet = SAMPLE_REVIEWS.find((r) => product.image.includes(r.match))
      if (!reviewSet) continue

      for (const r of reviewSet.reviews) {
        await db.review.create({
          data: {
            productId: product.id,
            name: r.name,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
          },
        })
        seeded++
      }
    }

    return NextResponse.json({ message: 'Reviews seeded', count: seeded })
  } catch (error) {
    console.error('Error seeding reviews:', error)
    return NextResponse.json({ error: 'Failed to seed reviews' }, { status: 500 })
  }
}
