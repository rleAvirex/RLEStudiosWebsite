'use client'

import { ShoppingCart, X, Code, Check, Star, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Product, useCartStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface ProductDetailDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const addItem = useCartStore((s) => s.addItem)

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          {product.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{product.name}</span>
              <span className="text-primary">€{product.price.toFixed(2)}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">{product.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Code className="h-3.5 w-3.5" />
              {product.framework}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-green-500" />
              v{product.version}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl mt-4"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart — €{product.price.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
