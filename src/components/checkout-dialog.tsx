'use client'

import { useState } from 'react'
import { Loader2, Check, ShieldCheck, Download, Mail, User, CreditCard } from 'lucide-react'
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
import { useCartStore } from '@/lib/store'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'details' | 'processing' | 'success'

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, totalPrice, totalSavings, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('details')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')

  const reset = () => {
    setStep('details')
    setEmail('')
    setName('')
    setOrderId('')
    setError('')
  }

  const handleClose = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      // Delay reset to allow close animation
      setTimeout(reset, 200)
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
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          totalPrice: totalPrice(),
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

      setOrderId(data.orderId)
      clearCart()
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process order')
      setStep('details')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-border p-0 overflow-hidden">
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
                        {item.product.name} <span className="text-xs">×{item.quantity}</span>
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="bg-border" />
                {totalSavings() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">You save</span>
                    <span className="text-green-500 font-medium">
                      −€{totalSavings().toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">€{totalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="space-y-3">
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
                Complete Purchase — €{totalPrice().toFixed(2)}
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
                  Your scripts are on their way to <span className="text-foreground">{email}</span>
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
