'use client'

import { useState } from 'react'
import {
  Loader2,
  Check,
  ShieldCheck,
  Download,
  Mail,
  User,
  CreditCard,
  Tag,
  X,
  Gift,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useMyOrdersStore, useCurrencyStore, formatPrice } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'details' | 'processing' | 'success'

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const {
    items,
    subtotal,
    bundleDiscount,
    hasBundleDeal,
    promo,
    setPromo,
    finalTotal,
    clearCart,
  } = useCartStore()
  const addOrder = useMyOrdersStore((s) => s.addOrder)
  const currency = useCurrencyStore((s) => s.currency)
  const [step, setStep] = useState<Step>('details')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const reset = () => {
    setStep('details')
    setEmail('')
    setName('')
    setOrderId('')
    setError('')
    setPromoInput('')
  }

  const handleClose = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setTimeout(reset, 200)
    }
  }

  const handleApplyPromo = async () => {
    setError('')
    if (!promoInput.trim()) {
      setError('Enter a promo code')
      return
    }
    // Calculate subtotal after bundle discount (promo applies to post-bundle total)
    const afterBundle = subtotal() - bundleDiscount()
    setPromoLoading(true)
    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput,
          subtotal: afterBundle,
        }),
      })
      const data = await res.json()

      if (data.valid) {
        setPromo({
          code: data.code,
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discount: data.discount,
        })
        setPromoInput('')
        toast({
          title: 'Promo applied!',
          description: `${data.code}: ${data.description}`,
        })
      } else {
        setError(data.error || 'Invalid promo code')
      }
    } catch {
      setError('Failed to validate promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setStep('processing')

    try {
      const finalTotalValue = finalTotal()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          totalPrice: finalTotalValue,
          subtotal: subtotal(),
          discount: subtotal() - finalTotalValue,
          promoCode: promo?.code,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      // Save to my orders (localStorage)
      addOrder({
        orderId: data.orderId,
        email,
        name,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: subtotal(),
        discount: subtotal() - finalTotalValue,
        total: finalTotalValue,
        promoCode: promo?.code,
        date: new Date().toISOString(),
      })

      setOrderId(data.orderId)
      clearCart()
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process order')
      setStep('details')
    }
  }

  const afterBundle = subtotal() - bundleDiscount()
  const promoDiscount = promo?.discount ?? 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-border p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {step === 'success' ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  Order Complete
                </>
              ) : step === 'processing' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 text-primary" />
                  Secure Checkout
                </>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order summary */}
              <div className="space-y-3 p-4 rounded-xl bg-background border border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order Summary
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate flex-1 mr-2">
                        {item.product.name}{' '}
                        <span className="text-xs">×{item.quantity}</span>
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal(), currency)}</span>
                </div>
                {totalSavings(items) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Product savings</span>
                    <span className="text-green-500 font-medium">
                      −{formatPrice(totalSavings(items), currency)}
                    </span>
                  </div>
                )}
                {bundleDiscount() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 flex items-center gap-1">
                      <Gift className="h-3 w-3" /> Bundle (30%)
                    </span>
                    <span className="text-green-500 font-medium">
                      −{formatPrice(bundleDiscount(), currency)}
                    </span>
                  </div>
                )}
                {promo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {promo.code}
                      <button
                        type="button"
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
                <Separator className="bg-border" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal(), currency)}</span>
                </div>
              </div>

              {/* Promo code input */}
              {!promo && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Promo Code</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="WELCOME10"
                        className="pl-9 bg-background border-border rounded-lg h-10 uppercase tracking-wider text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-border hover:border-primary/40 rounded-lg h-10 px-4"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                    >
                      {promoLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Try <span className="text-primary font-medium">WELCOME10</span>,{' '}
                    <span className="text-primary font-medium">SAVE5</span>, or{' '}
                    <span className="text-primary font-medium">FIVEM20</span> (min €50)
                  </p>
                </div>
              )}

              {/* Customer info */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-name" className="text-xs">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="checkout-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-9 bg-background border-border rounded-lg h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkout-email" className="text-xs">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 bg-background border-border rounded-lg h-10"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Scripts will be delivered to this email instantly.
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                  {error}
                </div>
              )}

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-primary" />
                  Instant
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-semibold"
              >
                Complete Purchase — {formatPrice(finalTotal(), currency)}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                This is a demo checkout — no real payment will be processed.
              </p>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
              </div>
              <div>
                <p className="font-medium">Processing your order...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please do not close this window.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">Thank you, {name.split(' ')[0]}!</p>
                <p className="text-sm text-muted-foreground">
                  Your scripts are on their way to{' '}
                  <span className="text-foreground">{email}</span>
                </p>
              </div>

              <div className="w-full p-4 rounded-xl bg-background border border-border text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs">{orderId.slice(0, 12)}...</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-500 font-medium">Completed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">View in</span>
                  <span className="text-primary">My Orders</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11"
                onClick={() => handleClose(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to compute totalSavings outside store context
function totalSavings(items: { product: { originalPrice?: number; price: number }; quantity: number }[]) {
  return items.reduce((sum, item) => {
    const orig = item.product.originalPrice ?? item.product.price
    return sum + (orig - item.product.price) * item.quantity
  }, 0)
}
