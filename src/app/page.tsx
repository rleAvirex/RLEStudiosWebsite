'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { ProductDetailDialog } from '@/components/product-detail-dialog'
import { CartSheet } from '@/components/cart-sheet'
import { WishlistSheet } from '@/components/wishlist-sheet'
import { CheckoutDialog } from '@/components/checkout-dialog'
import { CompareSheet } from '@/components/compare-sheet'
import { MyOrdersSheet } from '@/components/my-orders-sheet'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { DiscordWidget } from '@/components/discord-widget'
import { AnnouncementBar } from '@/components/announcement-bar'
import { CookieConsent } from '@/components/cookie-consent'
import { SocialProofNotifications } from '@/components/social-proof-notifications'
import { ScrollProgress } from '@/components/scroll-progress'
import { LiveChatWidget } from '@/components/live-chat-widget'
import { SkeletonGrid } from '@/components/skeleton-card'
import { Features } from '@/components/sections/features'
import { Testimonials } from '@/components/sections/testimonials'
import { FAQ } from '@/components/sections/faq'
import { Newsletter } from '@/components/sections/newsletter'
import { CTABanner } from '@/components/sections/cta-banner'
import { StatsBanner } from '@/components/sections/stats-banner'
import { RecentlyViewed } from '@/components/sections/recently-viewed'
import { BundleDeals } from '@/components/sections/bundle-deals'
import { type Product, type Review, useRecentlyViewedStore, useWishlistStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  Sparkles,
  ArrowDownUp,
  Flame,
  Clock,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['All', 'Vehicle', 'UI', 'Economy', 'Property', 'Job', 'Core']

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating'
type QuickFilter = 'all' | 'trending' | 'new'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  popular: 'Most Popular',
  rating: 'Top Rated',
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<SortOption>('popular')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add)
  const wishlistToggle = useWishlistStore((s) => s.toggleItem)

  useEffect(() => {
    async function init() {
      try {
        await fetch('/api/seed', { method: 'POST' })
        await fetch('/api/promo-codes', { method: 'POST' })
        await fetch('/api/reviews/seed', { method: 'POST' })

        const [productsRes, reviewsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/reviews'),
        ])
        const productsData = await productsRes.json()
        const reviewsData = await reviewsRes.json()
        setProducts(productsData)
        setFeatured(productsData.filter((p: Product) => p.isFeatured))
        setReviews(reviewsData)

        // Parse ?wishlist= URL param and populate wishlist
        try {
          const urlParams = new URLSearchParams(window.location.search)
          const wishlistParam = urlParams.get('wishlist')
          if (wishlistParam) {
            const ids = wishlistParam.split(',').filter(Boolean)
            for (const id of ids) {
              const product = productsData.find((p: Product) => p.id === id)
              if (product) {
                wishlistToggle(product)
              }
            }
            // Clean URL — remove the wishlist param after processing
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
          }
        } catch {
          // ignore URL parsing errors
        }
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [wishlistToggle])

  // Build review count map
  const reviewCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of reviews) {
      counts[r.productId] = (counts[r.productId] ?? 0) + 1
    }
    return counts
  }, [reviews])

  // "New arrivals" = the 3 most recently created products
  const newArrivalIds = useMemo(() => {
    return new Set(
      [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map((p) => p.id)
    )
  }, [products])

  // "Trending" = top 4 by salesCount * rating
  const trendingIds = useMemo(() => {
    return new Set(
      [...products]
        .sort((a, b) => b.salesCount * b.rating - a.salesCount * a.rating)
        .slice(0, 4)
        .map((p) => p.id)
    )
  }, [products])

  const openDetail = (product: Product) => {
    setSelectedProduct(product)
    setDetailOpen(true)
    addRecentlyViewed(product)
  }

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
      const matchesCategory = category === 'All' || p.category === category
      const matchesQuick =
        quickFilter === 'all' ||
        (quickFilter === 'trending' && trendingIds.has(p.id)) ||
        (quickFilter === 'new' && newArrivalIds.has(p.id))
      return matchesSearch && matchesCategory && matchesQuick
    })
    .sort((a, b) => {
      switch (sort) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'popular':
          return b.salesCount - a.salesCount
        case 'rating':
          return b.rating - a.rating
        case 'newest':
        default:
          return 0
      }
    })

  const scrollToScripts = () => {
    document.getElementById('scripts')?.scrollIntoView({ behavior: 'smooth' })
  }

  const QUICK_FILTERS: { id: QuickFilter; label: string; icon: typeof Flame }[] = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'new', label: 'New Arrivals', icon: Clock },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onOrdersOpen={() => setOrdersOpen(true)}
        onCompareOpen={() => setCompareOpen(true)}
        products={products}
        onProductClick={openDetail}
      />

      <main className="flex-1">
        <Hero />

        {/* Stats banner right after hero */}
        <StatsBanner />

        {/* Featured Section */}
        {featured.length > 0 && (
          <section id="featured" className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                      Hand-picked
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Featured Scripts</h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Our most popular and best-rated scripts, chosen by the community.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary self-start sm:self-auto"
                  onClick={scrollToScripts}
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featured.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={openDetail}
                    featured
                    reviewCount={reviewCounts[product.id] ?? 0}
                    onCartOpen={() => setCartOpen(true)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features / Why Choose Us */}
        <Features />

        {/* Bundle Deals */}
        <BundleDeals products={products} onBrowse={scrollToScripts} />

        {/* All Scripts Section */}
        <section id="scripts" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                    Catalog
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">All Scripts</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Browse our full library of premium FiveM resources.
                </p>
              </div>
              {/* Sort dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger className="w-[180px] h-10 bg-card border-border rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {SORT_LABELS[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick filter tabs */}
            <div className="flex items-center gap-2 mb-5 p-1 bg-card rounded-xl border border-border w-fit">
              {QUICK_FILTERS.map((qf) => {
                const Icon = qf.icon
                return (
                  <button
                    key={qf.id}
                    onClick={() => setQuickFilter(qf.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      quickFilter === qf.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {qf.label}
                  </button>
                )
              })}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, description, or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border rounded-xl h-10"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-lg text-xs ${
                      category === cat
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <SkeletonGrid count={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  No scripts found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl border-border"
                  onClick={() => {
                    setSearch('')
                    setCategory('All')
                    setQuickFilter('all')
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-4">
                  Showing {filteredProducts.length} of {products.length} scripts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetail={openDetail}
                      reviewCount={reviewCounts[product.id] ?? 0}
                      onCartOpen={() => setCartOpen(true)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <CTABanner onBrowse={scrollToScripts} />

        {/* Testimonials */}
        <Testimonials />

        {/* Recently Viewed */}
        <RecentlyViewed onViewDetail={openDetail} />

        {/* FAQ */}
        <FAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />

      {/* Floating elements */}
      <ScrollProgress />
      <BackToTop />
      <DiscordWidget />
      <CookieConsent />
      <SocialProofNotifications />
      <LiveChatWidget />

      {/* Overlays */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <WishlistSheet
        open={wishlistOpen}
        onOpenChange={setWishlistOpen}
        onViewDetail={openDetail}
      />
      <CompareSheet
        open={compareOpen}
        onOpenChange={setCompareOpen}
        onViewDetail={openDetail}
      />
      <MyOrdersSheet open={ordersOpen} onOpenChange={setOrdersOpen} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        reviewCounts={reviewCounts}
        onCartOpen={() => setCartOpen(true)}
      />
    </div>
  )
}
