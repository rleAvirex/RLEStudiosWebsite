'use client'

import {
  ShoppingCart,
  Star,
  Code,
  Check,
  Heart,
  Tag,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  onQuickView?: (product: Product) => void
  featured?: boolean
  onCartOpen?: () => void
}

export function ProductCard({ product, onViewDetail, onQuickView, featured, onCartOpen }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => s.ids.includes(product.id))
  const currency = useCurrencyStore((s) => s.currency)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
      action: onCartOpen
        ? (
            <ToastAction altText="View Cart" onClick={onCartOpen}>
              View Cart
            </ToastAction>
          )
        : undefined,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product)
    toast({
      title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    })
  }


  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <Card
      className={`group cursor-pointer bg-card border-border hover:border-primary/30 transition-all duration-300 overflow-hidden ${
        featured
          ? 'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
          : 'hover:shadow-md hover:shadow-primary/5'
      }`}
      onClick={() => onViewDetail(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <ImageWithShimmer
          src={product.image}
          alt={product.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent pointer-events-none" />

        {/* Top-left: Featured badge */}
        <div className="absolute top-3 left-3">
          {product.isFeatured && (
            <Badge className="accent-gradient text-white text-xs w-fit border-0">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Top-right: Category badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 text-xs bg-card/80 backdrop-blur-sm"
        >
          {product.category}
        </Badge>

        {/* Quick View overlay button — center, appears on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuickView(product)
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-card/90 backdrop-blur-md text-foreground text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-lg"
            aria-label="Quick view"
            title="Quick view"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </button>
        )}

        {/* Action buttons - bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isInWishlist
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/80 text-muted-foreground hover:text-primary'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            title="Wishlist"
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-primary font-bold text-base sm:text-lg whitespace-nowrap">
              {formatPrice(product.price, currency)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice!, currency)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Framework & Version */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            {product.framework}
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            v{product.version}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {product.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground flex items-center gap-0.5"
              >
                <Tag className="h-2 w-2" />
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{product.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <Button
          size="sm"
          className="w-full btn-gradient-slide btn-gradient-slide-sm mt-2 rounded-lg"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
