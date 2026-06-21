'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, Trash2, Share2, Check, Link2 } from 'lucide-react'
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
  const [copied, setCopied] = useState(false)

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: product.name,
    })
  }

  const handleShare = async () => {
    if (items.length === 0) return
    const ids = items.map((p) => p.id).join(',')
    const url = `${window.location.origin}?wishlist=${ids}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: 'Wishlist link copied!',
        description: 'Share it with your friends.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Please copy the URL manually.',
        variant: 'destructive',
      })
    }
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
            <Button
              variant="outline"
              className="rounded-xl border-border"
              onClick={() => onOpenChange(false)}
            >
              Browse Scripts
            </Button>
          </div>
        ) : (
          <>
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
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <Button
                variant="outline"
                className="w-full rounded-xl border-border hover:border-primary/40"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Wishlist
                  </>
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                <Link2 className="h-2.5 w-2.5" />
                Copy a link with your saved items
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
