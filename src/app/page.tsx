'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { ProductDetailDialog } from '@/components/product-detail-dialog'
import { CartSheet } from '@/components/cart-sheet'
import { Footer } from '@/components/footer'
import { type Product } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['All', 'Vehicle', 'UI', 'Economy', 'Property', 'Job', 'Core']

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    async function init() {
      try {
        // Seed the database
        await fetch('/api/seed', { method: 'POST' })
        // Fetch products
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
        setFeatured(data.filter((p: Product) => p.isFeatured))
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const openDetail = (product: Product) => {
    setSelectedProduct(product)
    setDetailOpen(true)
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Hero />

        {/* Featured Section */}
        {featured.length > 0 && (
          <section id="featured" className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-bold">Featured Scripts</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featured.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={openDetail}
                    featured
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Scripts Section */}
        <section id="scripts" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold">All Scripts</h2>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts..."
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
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No scripts found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={openDetail}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Overlays */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
