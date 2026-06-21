'use client'

import { useState } from 'react'
import {
  ShoppingCart,
  Star,
  Code,
  Check,
  Heart,
  Eye,
  X,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  type Product,
  useCartStore,
  useWishlistStore,
  useCurrencyStore,
  formatPrice,
} from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { ImageWithShimmer } from '@/components/image-with-shimmer'

interface QuickViewDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewFullDetail: (product: Product) => void
  onCartOpen?: () => void
}

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
  onViewFullDetail,
  onCartOpen,
}: QuickViewDialogProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => (product ? s.ids.includes(product.id) : false))
  const currency = useCurrencyStore((s) => s.currency)

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: product.name,
      action: onCartOpen ? (
        <ToastAction altText="View Cart" onClick={onCartOpen}>
          View Cart
        </ToastAction>
      ) : undefined,
    })
    onOpenChange(false)
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
    toast({
      title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    })
  }


  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative aspect-square sm:aspect-auto bg-muted overflow-hidden">
            <ImageWithShimmer
              src={product.image}
              alt={product.name}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
            {product.isFeatured && (
              <Badge className="absolute top-3 left-3 accent-gradient text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="absolute top-3 right-3 bg-red-500/90 text-white">
                -{discountPercent}%
              </Badge>
            )}
            {/* Quick view label */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-card/80 backdrop-blur-sm text-[10px] text-muted-foreground flex items-center gap-1">
              <Eye className="h-2.5 w-2.5" />
              Quick View
            </div>
          </div>

          {/* Info side */}
          <div className="p-5 flex flex-col gap-3">
            {/* Close button for mobile */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-3 sm:hidden w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Category + Title */}
            <div>
              <Badge variant="secondary" className="text-[10px] mb-1.5">
                {product.category}
              </Badge>
              <h2 className="text-lg font-bold leading-tight">{product.name}</h2>
            </div>

            {/* Framework */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Code className="h-3 w-3" />
              {product.framework}
              <span>·</span>
              <Check className="h-3 w-3 text-green-500" />
              v{product.version}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price, currency)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!, currency)}
                </span>
              )}
            </div>

            {/* Description (short) */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                {product.framework}
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                v{product.version}
              </span>
            </div>

            {/* Top features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Top Features
                </p>
                <ul className="space-y-0.5">
                  {product.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-2 pt-2">
              <Button
                className="w-full btn-gradient-slide rounded-xl h-10"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart — {formatPrice(product.price, currency)}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:border-primary/40 rounded-lg h-9 text-xs"
                  onClick={() => {
                    onOpenChange(false)
                    onViewFullDetail(product)
                  }}
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-lg h-9 w-9 ${
                    isInWishlist ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  }`}
                  onClick={handleToggleWishlist}
                  title="Wishlist"
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
