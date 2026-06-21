'use client'

import { Heart, ShoppingCart, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useWishlistStore, useCartStore, type Product } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface WishlistSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewDetail: (product: Product) => void
}

export function WishlistSheet({ open, onOpenChange, onViewDetail }: WishlistSheetProps) {
  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: product.name,
    })
  }

  const handleRemove = (productId: string) => {
    removeItem(productId)
    toast({
      title: 'Removed from wishlist',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Wishlist
            {items.length > 0 && (
              <span className="text-sm text-muted-foreground font-normal">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Save scripts you love for later
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl bg-background border border-border"
              >
                <button
                  className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted cursor-pointer"
                  onClick={() => {
                    onViewDetail(product)
                    onOpenChange(false)
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <p className="text-primary font-semibold text-sm mt-0.5">
                    €{product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="h-7 px-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-md"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
