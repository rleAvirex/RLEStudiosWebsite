'use client'

import { Clock } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { useRecentlyViewedStore, type Product } from '@/lib/store'

interface RecentlyViewedProps {
  onViewDetail: (product: Product) => void
}

export function RecentlyViewed({ onViewDetail }: RecentlyViewedProps) {
  const items = useRecentlyViewedStore((s) => s.items)

  if (items.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
