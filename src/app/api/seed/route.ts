import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const SAMPLE_PRODUCTS = [
  {
    name: 'Advanced Garage System',
    description:
      'A fully featured garage system with impound lot, shared garages, and vehicle customization preview. Supports both ESX and QBCore frameworks with seamless integration. Includes admin panel for managing garages and vehicles.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'Vehicle',
    image: '/products/garage.jpg',
    features: JSON.stringify([
      'Multiple garage locations',
      'Impound system with fees',
      'Shared/gang garages',
      'Vehicle preview before spawn',
      'Admin management panel',
      'Custom garage configs',
      'Performance optimized',
    ]),
    isFeatured: true,
    version: '2.3.1',
    framework: 'ESX / QBCore',
    rating: 4.9,
    salesCount: 1248,
    lastUpdated: '2 days ago',
  },
  {
    name: 'Custom HUD UI',
    description:
      'Modern, sleek HUD replacement with health, armor, hunger, thirst, stamina, and stress indicators. Fully customizable layout with mini-map integration and voice chat indicator.',
    price: 19.99,
    originalPrice: 27.99,
    category: 'UI',
    image: '/products/hud.jpg',
    features: JSON.stringify([
      'Clean minimalistic design',
      'Health, armor, hunger, thirst bars',
      'Stress & stamina indicators',
      'Voice chat proximity indicator',
      'Mini-map integration',
      'Customizable layout & colors',
      'Seatbelt & engine status',
    ]),
    isFeatured: true,
    version: '3.1.0',
    framework: 'ESX / QBCore',
    rating: 4.8,
    salesCount: 2156,
    lastUpdated: '5 days ago',
  },
  {
    name: 'Drug Processing System',
    description:
      'Complete drug economy system with processing, selling, and territory control. Features realistic processing animations and police detection mechanics.',
    price: 29.99,
    originalPrice: null,
    category: 'Economy',
    image: '/products/drugs.jpg',
    features: JSON.stringify([
      'Multiple drug types',
      'Processing & refinement',
      'Territory-based selling',
      'Police detection system',
      'Realistic animations',
      'Dynamic pricing',
      'Gang territory control',
    ]),
    isFeatured: true,
    version: '1.8.2',
    framework: 'QBCore',
    rating: 4.7,
    salesCount: 893,
    lastUpdated: '1 week ago',
  },
  {
    name: 'Advanced Banking',
    description:
      'Full-featured banking system with savings accounts, loans, wire transfers, and ATM interactions. Includes a beautiful NUI interface and admin management tools.',
    price: 34.99,
    originalPrice: 44.99,
    category: 'Economy',
    image: '/products/banking.jpg',
    features: JSON.stringify([
      'Savings & checking accounts',
      'Loan system with interest',
      'Wire transfers',
      'ATM interactions',
      'Transaction history',
      'Admin management panel',
      'Beautiful NUI interface',
    ]),
    isFeatured: false,
    version: '2.0.0',
    framework: 'ESX / QBCore',
    rating: 4.9,
    salesCount: 1567,
    lastUpdated: '3 days ago',
  },
  {
    name: 'Player Housing System',
    description:
      'Comprehensive player housing with interior customization, storage, and property management. Buy, rent, or sell properties with realistic shell interiors.',
    price: 27.99,
    originalPrice: null,
    category: 'Property',
    image: '/products/housing.jpg',
    features: JSON.stringify([
      'Buy & rent properties',
      'Interior customization',
      'Furniture placement',
      'Storage systems',
      'Key management',
      'Property listings',
      'Shell interiors included',
    ]),
    isFeatured: false,
    version: '1.5.3',
    framework: 'QBCore',
    rating: 4.6,
    salesCount: 734,
    lastUpdated: '4 days ago',
  },
  {
    name: 'Police MDT System',
    description:
      'Advanced Mobile Data Terminal for law enforcement with bulletins, reports, warrant management, and real-time dispatch integration.',
    price: 39.99,
    originalPrice: 49.99,
    category: 'Job',
    image: '/products/mdt.jpg',
    features: JSON.stringify([
      'Citizen lookup & profiles',
      'Incident reports',
      'Warrant management',
      'Bolo bulletin system',
      'Dispatch integration',
      'Vehicle & weapon records',
      'Staff management',
    ]),
    isFeatured: true,
    version: '4.2.0',
    framework: 'ESX / QBCore',
    rating: 5.0,
    salesCount: 1892,
    lastUpdated: '1 day ago',
  },
  {
    name: 'Advanced Inventory',
    description:
      'Weight-based inventory system with drag & drop, hotbar, and item crafting. Includes weapon attachment system and drop/pickup mechanics.',
    price: 22.99,
    originalPrice: null,
    category: 'Core',
    image: '/products/inventory.jpg',
    features: JSON.stringify([
      'Drag & drop interface',
      'Weight-based system',
      'Hotbar with keybinds',
      'Item crafting',
      'Weapon attachments',
      'Drop & pickup items',
      'Shop integration',
    ]),
    isFeatured: false,
    version: '2.1.0',
    framework: 'ESX / QBCore',
    rating: 4.8,
    salesCount: 1342,
    lastUpdated: '6 days ago',
  },
  {
    name: 'Ambulance Job Enhanced',
    description:
      'Complete EMS job overhaul with revive mechanics, hospital visits, injury system, and medical items. Features realistic CPR animations and stretcher system.',
    price: 17.99,
    originalPrice: 24.99,
    category: 'Job',
    image: '/products/ambulance.jpg',
    features: JSON.stringify([
      'Revive & heal mechanics',
      'Injury detection system',
      'Hospital check-in',
      'Medical items & equipment',
      'CPR animations',
      'Stretcher system',
      'On-duty notifications',
    ]),
    isFeatured: false,
    version: '1.3.0',
    framework: 'ESX / QBCore',
    rating: 4.7,
    salesCount: 612,
    lastUpdated: '1 week ago',
  },
  {
    name: 'Car Wash Script',
    description:
      'Simple but polished car wash system with animated cleaning, pricing, and dirt accumulation over time. Supports multiple locations.',
    price: 9.99,
    originalPrice: null,
    category: 'Vehicle',
    image: '/products/carwash.jpg',
    features: JSON.stringify([
      'Animated wash sequence',
      'Dirt accumulation over time',
      'Multiple wash locations',
      'Configurable pricing',
      'Clean NUI interface',
      'Progress indicators',
    ]),
    isFeatured: false,
    version: '1.1.0',
    framework: 'ESX / QBCore',
    rating: 4.5,
    salesCount: 423,
    lastUpdated: '2 weeks ago',
  },
]

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const force = url.searchParams.get('force') === 'true'

    if (force) {
      // Delete existing products to allow re-seed with new fields
      await db.product.deleteMany({})
    }

    const existing = await db.product.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Products already seeded', count: existing })
    }

    const products = await db.product.createMany({
      data: SAMPLE_PRODUCTS,
    })

    return NextResponse.json({ message: 'Products seeded successfully', count: products.count })
  } catch (error) {
    console.error('Error seeding products:', error)
    return NextResponse.json({ error: 'Failed to seed products' }, { status: 500 })
  }
}
