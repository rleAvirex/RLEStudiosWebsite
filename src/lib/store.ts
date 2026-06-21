import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  features: string[]
  isFeatured: boolean
  version: string
  framework: string
  rating: number
  salesCount: number
  lastUpdated: string
}

export interface Review {
  id: string
  productId: string
  name: string
  rating: number
  title: string
  comment: string
  helpful: number
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Currency = 'EUR' | 'USD' | 'GBP'

export const CURRENCY_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

export function formatPrice(eurPrice: number, currency: Currency): string {
  const converted = eurPrice * CURRENCY_RATES[currency]
  const symbol = CURRENCY_SYMBOLS[currency]
  return `${symbol}${converted.toFixed(2)}`
}

export interface AppliedPromo {
  code: string
  description: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  discount: number
}

export interface MyOrder {
  orderId: string
  email: string
  name: string
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  date: string
}

// Cart + Promo store
interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
  totalSavings: () => number // from product discounts (originalPrice - price)
  bundleDiscount: () => number // auto-applied 30% off when 3+ featured scripts
  hasBundleDeal: () => boolean
  promo: AppliedPromo | null
  setPromo: (promo: AppliedPromo | null) => void
  finalTotal: () => number
  clearAll: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        })
      },
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },
      clearCart: () => set({ items: [], promo: null }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      totalSavings: () =>
        get().items.reduce((sum, item) => {
          const orig = item.product.originalPrice ?? item.product.price
          return sum + (orig - item.product.price) * item.quantity
        }, 0),
      // Auto bundle: 30% off when 3+ featured scripts in cart (different ones)
      bundleDiscount: () => {
        const items = get().items
        const featuredItems = items.filter((i) => i.product.isFeatured)
        if (featuredItems.length >= 3) {
          const featuredSubtotal = featuredItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          )
          return featuredSubtotal * 0.3
        }
        return 0
      },
      hasBundleDeal: () => {
        const featuredItems = get().items.filter((i) => i.product.isFeatured)
        return featuredItems.length >= 3
      },
      setPromo: (promo: AppliedPromo | null) => set({ promo }),
      finalTotal: () => {
        const sub = get().subtotal()
        const bundle = get().bundleDiscount()
        const promoDiscount = get().promo?.discount ?? 0
        return Math.max(0, sub - bundle - promoDiscount)
      },
      clearAll: () => set({ items: [], promo: null }),
    }),
    {
      name: 'rle-cart',
    }
  )
)

interface WishlistStore {
  ids: string[]
  items: Product[]
  toggleItem: (product: Product) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],
      toggleItem: (product: Product) => {
        set((state) => {
          if (state.ids.includes(product.id)) {
            return {
              ids: state.ids.filter((id) => id !== product.id),
              items: state.items.filter((p) => p.id !== product.id),
            }
          }
          return {
            ids: [...state.ids, product.id],
            items: [...state.items, product],
          }
        })
      },
      removeItem: (productId: string) => {
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
          items: state.items.filter((p) => p.id !== productId),
        }))
      },
      hasItem: (productId: string) => get().ids.includes(productId),
      clear: () => set({ ids: [], items: [] }),
    }),
    {
      name: 'rle-wishlist',
    }
  )
)

interface RecentlyViewedStore {
  items: Product[]
  add: (product: Product) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      add: (product: Product) => {
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id)
          return { items: [product, ...filtered].slice(0, 4) }
        })
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'rle-recent',
    }
  )
)

// Compare store (max 3 products side-by-side)
interface CompareStore {
  ids: string[]
  items: Product[]
  toggleItem: (product: Product) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],
      toggleItem: (product: Product) => {
        set((state) => {
          if (state.ids.includes(product.id)) {
            return {
              ids: state.ids.filter((id) => id !== product.id),
              items: state.items.filter((p) => p.id !== product.id),
            }
          }
          if (state.ids.length >= 3) {
            // Don't add more than 3
            return state
          }
          return {
            ids: [...state.ids, product.id],
            items: [...state.items, product],
          }
        })
      },
      removeItem: (productId: string) => {
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
          items: state.items.filter((p) => p.id !== productId),
        }))
      },
      hasItem: (productId: string) => get().ids.includes(productId),
      clear: () => set({ ids: [], items: [] }),
    }),
    {
      name: 'rle-compare',
    }
  )
)

// My Orders store (saved in localStorage)
interface MyOrdersStore {
  orders: MyOrder[]
  addOrder: (order: MyOrder) => void
  clear: () => void
}

export const useMyOrdersStore = create<MyOrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders].slice(0, 50) })),
      clear: () => set({ orders: [] }),
    }),
    {
      name: 'rle-orders',
    }
  )
)

// Currency store (persisted)
interface CurrencyStore {
  currency: Currency
  setCurrency: (c: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'EUR',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'rle-currency',
    }
  )
)
