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

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
  totalSavings: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
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
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      totalSavings: () =>
        get().items.reduce((sum, item) => {
          const orig = item.product.originalPrice ?? item.product.price
          return sum + (orig - item.product.price) * item.quantity
        }, 0),
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
