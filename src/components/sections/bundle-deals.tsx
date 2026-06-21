'use client'

import { Gift, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCurrencyStore, formatPrice, type Product } from '@/lib/store'

interface BundleDealsProps {
  products: Product[]
  onBrowse: () => void
}

interface Bundle {
  name: string
  description: string
  productIds: string[]
  discount: number // percentage
  badge: string
}

export function BundleDeals({ products, onBrowse }: BundleDealsProps) {
  const currency = useCurrencyStore((s) => s.currency)

  // Define 3 curated bundles
  const bundles: Bundle[] = [
    {
      name: 'Starter Pack',
      description: 'Everything you need to launch a new server — HUD, inventory, and banking.',
      productIds: products
        .filter((p) => ['Custom HUD UI', 'Advanced Inventory', 'Advanced Banking'].includes(p.name))
        .map((p) => p.id),
      discount: 25,
      badge: 'Best for New Servers',
    },
    {
      name: 'Roleplay Bundle',
      description: 'Deepen your RP with police, EMS, and housing systems in one package.',
      productIds: products
        .filter((p) => ['Police MDT System', 'Ambulance Job Enhanced', 'Player Housing System'].includes(p.name))
        .map((p) => p.id),
      discount: 30,
      badge: 'Most Popular',
    },
    {
      name: 'Economy Pro',
      description: 'Complete economy overhaul — banking, drugs, and garage for a thriving world.',
      productIds: products
        .filter((p) => ['Advanced Banking', 'Drug Processing System', 'Advanced Garage System'].includes(p.name))
        .map((p) => p.id),
      discount: 35,
      badge: 'Best Value',
    },
  ]

  return (
    <section id="bundles" className="py-16 sm:py-20 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gift className="h-5 w-5 text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">
              Save More
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Bundle Deals</h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Pre-built script bundles at discounted prices. Buy more, save more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {bundles.map((bundle, idx) => {
            const bundleProducts = bundle.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter((p): p is Product => p !== undefined)

            if (bundleProducts.length === 0) return null

            const originalTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0)
            const discountedTotal = originalTotal * (1 - bundle.discount / 100)
            const savings = originalTotal - discountedTotal

            const isHighlighted = idx === 1 // Middle bundle highlighted

            return (
              <div
                key={bundle.name}
                className={`relative rounded-2xl border p-5 flex flex-col ${
                  isHighlighted
                    ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-transparent shadow-lg shadow-primary/5'
                    : 'border-border bg-background'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {bundle.badge}
                  </div>
                )}
                {!isHighlighted && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded-full">
                    {bundle.badge}
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1">{bundle.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {bundle.description}
                </p>

                {/* Product list */}
                <div className="space-y-2 mb-4 flex-1">
                  {bundleProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 truncate text-muted-foreground">{p.name}</span>
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-1.5 mb-4 pt-3 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Regular price</span>
                    <span className="text-muted-foreground line-through">
                      {formatPrice(originalTotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-500">Bundle discount ({bundle.discount}%)</span>
                    <span className="text-green-500 font-medium">−{formatPrice(savings, currency)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-1">
                    <span className="text-sm font-semibold">You pay</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(discountedTotal, currency)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  onClick={onBrowse}
                >
                  Get Bundle
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
