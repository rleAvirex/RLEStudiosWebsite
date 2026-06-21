'use client'

import {
  ShoppingCart,
  Star,
  Code,
  Check,
  Heart,
  TrendingUp,
  GitCompare,
  MessageSquare,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  type Product,
  useCartStore,
  useWishlistStore,
  useCompareStore,
  useCurrencyStore,
  formatPrice,
} from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  featured?: boolean
  reviewCount?: number
  onCartOpen?: () => void
}

export function ProductCard({ product, onViewDetail, featured, reviewCount = 0, onCartOpen }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => s.ids.includes(product.id))
  const toggleCompare = useCompareStore((s) => s.toggleItem)
  const isInCompare = useCompareStore((s) => s.ids.includes(product.id))
  const compareCount = useCompareStore((s) => s.ids.length)
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

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInCompare && compareCount >= 3) {
      toast({
        title: 'Compare list full',
        description: 'Remove an item from compare to add another (max 3).',
        variant: 'destructive',
      })
      return
    }
    toggleCompare(product)
    toast({
      title: isInCompare ? 'Removed from compare' : 'Added to compare',
      description: product.name,
    })
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? 'fill-primary text-primary'
                  : i < rating
                  ? 'fill-primary/50 text-primary/50'
                  : 'text-muted-foreground/40'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        {reviewCount > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            (<MessageSquare className="h-2.5 w-2.5" />
            {reviewCount})
          </span>
        )}
      </div>
    )
  }

  return (
    <Card
      className={`group cursor-pointer bg-card border-border hover:border-primary/30 transition-all duration-300 overflow-hidden ${
        featured
          ? 'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
          : 'hover:shadow-md hover:shadow-primary/5'
      } ${isInCompare ? 'ring-1 ring-primary/40' : ''}`}
      onClick={() => onViewDetail(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />

        {/* Top-left: Featured badge OR discount badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <Badge className="bg-primary text-primary-foreground text-xs w-fit">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-red-500/90 text-white text-xs w-fit">-{discountPercent}%</Badge>
          )}
        </div>

        {/* Top-right: Category badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 text-xs bg-card/80 backdrop-blur-sm"
        >
          {product.category}
        </Badge>

        {/* Action buttons - bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleToggleCompare}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isInCompare
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/80 text-muted-foreground hover:text-primary'
            }`}
            aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
            title="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
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

        {/* Sales count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-card/80 backdrop-blur-sm text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3 text-primary" />
          {product.salesCount.toLocaleString()} sold
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

        {/* Rating */}
        {renderStars(product.rating)}

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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2 rounded-lg"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
