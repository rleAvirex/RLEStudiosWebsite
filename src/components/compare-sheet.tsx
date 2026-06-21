'use client'

import { GitCompare, X, ShoppingCart, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCompareStore, useCartStore, type Product } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface CompareSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewDetail: (product: Product) => void
}

export function CompareSheet({ open, onOpenChange, onViewDetail }: CompareSheetProps) {
  const { items, removeItem, clear } = useCompareStore()
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: product.name,
    })
  }

  // Build rows of comparable attributes
  const rows: { label: string; render: (p: Product) => React.ReactNode; best?: (p: Product) => boolean }[] = [
    {
      label: 'Price',
      render: (p) => <span className="font-bold text-primary">€{p.price.toFixed(2)}</span>,
    },
    {
      label: 'Category',
      render: (p) => p.category,
    },
    {
      label: 'Framework',
      render: (p) => p.framework,
    },
    {
      label: 'Version',
      render: (p) => `v${p.version}`,
    },
    {
      label: 'Rating',
      render: (p) => (
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {p.rating.toFixed(1)}
        </span>
      ),
    },
    {
      label: 'Sales',
      render: (p) => <span>{p.salesCount.toLocaleString()}</span>,
    },
    {
      label: 'Last Updated',
      render: (p) => p.lastUpdated,
    },
    {
      label: 'Featured',
      render: (p) =>
        p.isFeatured ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground/40" />
        ),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border flex flex-col w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Compare Scripts
            {items.length > 0 && (
              <span className="text-sm text-muted-foreground font-normal">
                ({items.length}/3)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <GitCompare className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No scripts to compare</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Click the compare icon on product cards to add up to 3 scripts for side-by-side
                comparison.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-border"
              onClick={() => onOpenChange(false)}
            >
              Browse Scripts
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4">
            {/* Product headers */}
            <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}>
              <div />
              {items.map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        onViewDetail(product)
                        onOpenChange(false)
                      }}
                    />
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove from compare"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold leading-tight line-clamp-2">
                    {product.name}
                  </h4>
                  <Button
                    size="sm"
                    className="w-full h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-md"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>

            <Separator className="bg-border my-3" />

            {/* Comparison rows */}
            <div className="space-y-1">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="grid gap-3 py-2.5 px-2 rounded-md hover:bg-muted/30 text-sm"
                  style={{ gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}
                >
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider self-center">
                    {row.label}
                  </div>
                  {items.map((product) => (
                    <div key={product.id} className="text-xs self-center">
                      {row.render(product)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Features comparison */}
            <Separator className="bg-border my-3" />
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Top Features
              </div>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}
              >
                <div />
                {items.map((product) => (
                  <ul key={product.id} className="space-y-1">
                    {product.features.slice(0, 5).map((f, idx) => (
                      <li
                        key={idx}
                        className="text-[11px] text-muted-foreground flex items-start gap-1.5"
                      >
                        <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive"
                onClick={clear}
              >
                Clear Comparison
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
