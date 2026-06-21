'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Package, Download, Calendar, Tag, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useMyOrdersStore } from '@/lib/store'

interface DbOrder {
  id: string
  email: string
  name: string
  totalPrice: number
  subtotal: number
  discount: number
  promoCode: string | null
  status: string
  createdAt: string
  items: {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
  }[]
}

interface MyOrdersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MyOrdersSheet({ open, onOpenChange }: MyOrdersSheetProps) {
  const { data: session } = useSession()
  const { orders: localOrders, clear } = useMyOrdersStore()
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([])
  const [dbLoading, setDbLoading] = useState(false)

  // Fetch DB orders when logged in and sheet opens
  useEffect(() => {
    if (!session?.user?.email || !open) return

    let cancelled = false
    const emailParam = encodeURIComponent(session.user.email)

    async function load() {
      setDbLoading(true)
      try {
        const res = await fetch(`/api/orders?email=${emailParam}`)
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) setDbOrders(data)
      } catch {
        // Non-critical: DB orders just won't show
      } finally {
        if (!cancelled) setDbLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [session, open])

  // Use DB orders when logged in, otherwise localStorage
  const orders = session?.user ? dbOrders : localOrders
  const isDbBacked = !!session?.user

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            My Orders
            {orders.length > 0 && (
              <span className="text-sm text-muted-foreground font-normal">
                ({orders.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {dbLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <Package className="h-8 w-8 text-muted-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your purchased scripts will appear here for easy re-download.
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
            {isDbBacked && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-xs font-medium">
                <Globe className="h-3 w-3" />
                Synced across devices
              </div>
            )}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {orders.map((order) => {
                // Handle both DB order shape and localStorage order shape
                const id = (order as DbOrder).id || (order as { orderId: string }).orderId
                const orderName = (order as DbOrder).name || (order as { name: string }).name
                const orderEmail = (order as DbOrder).email || (order as { email?: string }).email
                const total = (order as DbOrder).totalPrice ?? (order as { total: number }).total
                const sub = (order as DbOrder).subtotal ?? (order as { subtotal: number }).subtotal
                const disc = (order as DbOrder).discount ?? (order as { discount: number }).discount
                const promo = (order as DbOrder).promoCode ?? (order as { promoCode?: string }).promoCode
                const dateStr = (order as DbOrder).createdAt || (order as { date: string }).date
                const status = (order as DbOrder).status || 'completed'
                const items = (order as DbOrder).items || (order as { items: { productId: string; name: string; price: number; quantity: number }[] }).items

                return (
                  <div
                    key={id}
                    className="p-4 rounded-xl bg-background border border-border space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dateStr)}
                        </div>
                        <div className="font-mono text-xs mt-0.5 text-muted-foreground">
                          #{id.slice(0, 14)}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[10px] font-medium uppercase tracking-wider">
                        {status === 'completed' ? 'Completed' : status}
                      </span>
                    </div>

                    <Separator className="bg-border" />

                    {/* Items */}
                    <div className="space-y-1.5">
                      {items.map((item, idx) => (
                        <div key={item.id || idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate flex-1 mr-2">
                            {item.name}{' '}
                            <span className="text-xs">×{item.quantity}</span>
                          </span>
                          <span className="font-medium whitespace-nowrap">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-border" />

                    {/* Totals */}
                    <div className="space-y-1 text-xs">
                      {disc > 0 && (
                        <>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>€{sub.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-green-500">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Discount
                              {promo && ` (${promo})`}
                            </span>
                            <span>−€{disc.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between font-semibold text-sm pt-1">
                        <span>Total</span>
                        <span className="text-primary">€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Download button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg border-border hover:border-primary/40 text-xs"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download Scripts ({items.length})
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive"
                onClick={clear}
              >
                Clear Order History
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
