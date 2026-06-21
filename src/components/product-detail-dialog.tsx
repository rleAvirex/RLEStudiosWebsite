'use client'

import { useState } from 'react'
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
  GitCompare,
  MessageSquare,
  Tag,
  Sparkles,
  Play,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { ReviewsSection } from '@/components/reviews-section'

interface ProductDetailDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  reviewCounts?: Record<string, number>
  onCartOpen?: () => void
  allProducts?: Product[]
}

// Build gallery images from a single product image
// (In production, each product would have multiple images; here we simulate with variations)
function getGalleryImages(image: string): string[] {
  const baseImage = image
  // We only have one image per product, so return it 3 times for the gallery UI
  // In a real app this would be [image, image2, image3]
  return [baseImage, baseImage, baseImage]
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  reviewCounts = {},
  onCartOpen,
  allProducts = [],
}: ProductDetailDialogProps) {
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => (product ? s.ids.includes(product.id) : false))
  const toggleCompare = useCompareStore((s) => s.toggleItem)
  const isInCompare = useCompareStore((s) => (product ? s.ids.includes(product.id) : false))
  const compareCount = useCompareStore((s) => s.ids.length)
  const currency = useCurrencyStore((s) => s.currency)

  if (!product) return null

  const galleryImages = getGalleryImages(product.image)

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
      action: onCartOpen ? (
        <ToastAction altText="View Cart" onClick={onCartOpen}>
          View Cart
        </ToastAction>
      ) : undefined,
    })
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
    toast({
      title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    })
  }

  const handleToggleCompare = () => {
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

  const reviewCount = reviewCounts[product.id] ?? 0

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) setActiveImage(0)
      }}
    >
      <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Image gallery */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-background/50">
          {/* Thumbnails - left on desktop, bottom on mobile */}
          <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === i
                    ? 'border-primary scale-105'
                    : 'border-border opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main image */}
          <div className="relative aspect-video flex-1 rounded-xl overflow-hidden bg-muted order-1 sm:order-2">
            <img
              src={galleryImages[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
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
            {/* Image counter */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-card/80 backdrop-blur-sm text-[10px] text-muted-foreground">
              {activeImage + 1} / {galleryImages.length}
            </div>
            {/* Preview video play button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toast({
                  title: 'Preview video',
                  description: 'Video preview would play here in production.',
                })
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-all"
              aria-label="Play preview video"
              title="Play preview video"
            >
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </button>
          </div>
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
                    <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {product.salesCount.toLocaleString()} sales
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price, currency)}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!, currency)}
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Tag className="h-3 w-3" />
                Tags:
              </span>
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-muted text-[11px] text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
              Add to Cart — {formatPrice(product.price, currency)}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`rounded-xl px-4 ${
                isInCompare
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground hover:text-primary hover:border-primary/40'
              }`}
              onClick={handleToggleCompare}
              title="Compare"
            >
              <GitCompare className="h-5 w-5" />
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
              title="Wishlist"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Related Products section */}
          {allProducts.length > 1 && (() => {
            const related = allProducts
              .filter(
                (p) =>
                  p.id !== product.id &&
                  (p.category === product.category ||
                    p.framework === product.framework ||
                    (product.tags && p.tags && p.tags.some((t) => product.tags.includes(t))))
              )
              .slice(0, 3)

            if (related.length === 0) return null

            return (
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Related Scripts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {related.map((rp) => {
                    const rpHasDiscount = rp.originalPrice && rp.originalPrice > rp.price
                    return (
                      <button
                        key={rp.id}
                        onClick={() => {
                          onOpenChange(false)
                          setTimeout(() => {
                            // Re-open with the related product
                            const event = new CustomEvent('openProduct', { detail: rp })
                            window.dispatchEvent(event)
                          }, 100)
                        }}
                        className="text-left p-3 rounded-xl bg-muted/40 hover:bg-muted hover:border-primary/30 border border-border transition-all group"
                      >
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={rp.image}
                              alt={rp.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                              {rp.name}
                            </h5>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                              <span className="text-[10px] text-muted-foreground">
                                {rp.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xs font-bold text-primary">
                                {formatPrice(rp.price, currency)}
                              </span>
                              {rpHasDiscount && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  {formatPrice(rp.originalPrice!, currency)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Reviews section */}
          <ReviewsSection productId={product.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
