'use client'

import {
  ShoppingCart,
  Code,
  Check,
  Star,
  FileCode,
  Heart,
  Clock,
  TrendingUp,
  ShieldCheck,
  Download,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Product, useCartStore, useWishlistStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface ProductDetailDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) =>
    product ? s.ids.includes(product.id) : false
  )

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
    toast({
      title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    })
  }

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) * 100
      )
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          {product.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="absolute top-4 right-4 bg-red-500/90 text-white">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold leading-tight">
                  {product.name}
                </DialogTitle>
                {/* Rating row */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {product.salesCount.toLocaleString()} sales
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-primary">
                  €{product.price.toFixed(2)}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-muted-foreground line-through">
                    €{product.originalPrice!.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Meta chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{product.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
              <Code className="h-3 w-3" />
              {product.framework}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
              <Check className="h-3 w-3 text-green-500" />
              v{product.version}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
              <Clock className="h-3 w-3" />
              Updated {product.lastUpdated}
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
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/40"
                  >
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Guarantee strip */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
            <div className="flex flex-col items-center gap-1 text-center">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">Instant Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">Lifetime Updates</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">Secure Checkout</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart — €{product.price.toFixed(2)}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`rounded-xl px-4 ${
                isInWishlist
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground hover:text-primary hover:border-primary/40'
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
