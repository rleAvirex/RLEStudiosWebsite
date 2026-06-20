'use client'

import { ShoppingCart, Star, Code, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { type Product, useCartStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  featured?: boolean
}

export function ProductCard({ product, onViewDetail, featured }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card
      className={`group cursor-pointer bg-card border-border hover:border-primary/30 transition-all duration-300 overflow-hidden ${
        featured ? 'hover:shadow-lg hover:shadow-primary/5' : ''
      }`}
      onClick={() => onViewDetail(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        {product.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-3 right-3 text-xs bg-card/80 backdrop-blur-sm">
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="text-primary font-bold text-lg whitespace-nowrap">
            €{product.price.toFixed(2)}
          </span>
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
