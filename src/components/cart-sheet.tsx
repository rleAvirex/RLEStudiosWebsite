'use client'

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Download,
  RefreshCw,
  Tag,
  Gift,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useCurrencyStore, formatPrice } from '@/lib/store'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout: () => void
}

export function CartSheet({ open, onOpenChange, onCheckout }: CartSheetProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    totalSavings,
    bundleDiscount,
    hasBundleDeal,
    promo,
    setPromo,
    finalTotal,
    clearCart,
  } = useCartStore()
  const currency = useCurrencyStore((s) => s.currency)

  const handleCheckout = () => {
    if (items.length === 0) return
    onOpenChange(false)
    onCheckout()
  }

  const featuredCount = items.filter((i) => i.product.isFeatured).length
  const featuredNeeded = Math.max(0, 3 - featuredCount)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Shopping Cart
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
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our scripts and add some to your cart
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-border hover:border-primary/40"
              onClick={() => onOpenChange(false)}
            >
              Browse Scripts
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-background border border-border"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-primary font-semibold text-sm">
                      {formatPrice(item.product.price, currency)}
                      </span>
                      {item.product.originalPrice &&
                        item.product.originalPrice > item.product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.product.originalPrice, currency)}
                          </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-md border-border"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-md border-border"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle deal indicator */}
            <div className="pt-2">
              {hasBundleDeal ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs">
                  <Gift className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Bundle deal applied! 30% off {featuredCount} featured scripts
                    (−{formatPrice(bundleDiscount(), currency)})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary text-xs">
                  <Gift className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Add {featuredNeeded} more featured script{featuredNeeded > 1 ? 's' : ''} to
                    unlock 30% bundle discount!
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4">
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground py-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Secure payment
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-primary" />
                  Instant delivery
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 text-primary" />
                  Lifetime updates
                </span>
              </div>

              <Separator className="bg-border" />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal(), currency)}</span>
                </div>
                {totalSavings() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Product savings</span>
                    <span className="text-green-500 font-medium">
                      −{formatPrice(totalSavings(), currency)}
                    </span>
                  </div>
                )}
                {bundleDiscount() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 flex items-center gap-1">
                      <Gift className="h-3 w-3" /> Bundle deal (30%)
                    </span>
                    <span className="text-green-500 font-medium">
                      −{formatPrice(bundleDiscount(), currency)}
                    </span>
                  </div>
                )}
                {promo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Promo {promo.code}
                      <button
                        onClick={() => setPromo(null)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                        aria-label="Remove promo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                    <span className="text-green-500 font-medium">
                      −{formatPrice(promo.discount, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-1">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal(), currency)}</span>
                </div>
                {currency !== 'EUR' && (
                  <p className="text-[10px] text-muted-foreground italic">
                    * Prices include currency conversion. Final charge in EUR at checkout.
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                onClick={handleCheckout}
              >
                Checkout — {formatPrice(finalTotal(), currency)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
