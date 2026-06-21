'use client'

import { ShoppingCart, Menu, X, Heart, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavbarSearch } from '@/components/navbar-search'
import { CurrencySwitcher } from '@/components/currency-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  useCartStore,
  useWishlistStore,
  useCompareStore,
  type Product,
} from '@/lib/store'
import { useState, useEffect } from 'react'

interface NavbarProps {
  onCartOpen: () => void
  onWishlistOpen: () => void
  onOrdersOpen: () => void
  onCompareOpen: () => void
  products: Product[]
  onProductClick: (product: Product) => void
}

export function Navbar({
  onCartOpen,
  onWishlistOpen,
  onOrdersOpen,
  onCompareOpen,
  products,
  onProductClick,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const wishlistCount = useWishlistStore((s) => s.ids.length)
  const compareCount = useCompareStore((s) => s.ids.length)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const cartBadge = totalItems > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 accent-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
      {totalItems}
    </span>
  )

  const wishlistBadge = wishlistCount > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 accent-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
      {wishlistCount}
    </span>
  )

  const compareBadge = compareCount > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 accent-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
      {compareCount}
    </span>
  )

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center font-bold text-white text-sm group-hover:scale-110 transition-transform">
              R
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:inline">
              RLE <span className="accent-gradient-text">Studios</span>
            </span>
          </button>

          {/* Desktop Search - center */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <NavbarSearch
              products={products}
              onProductClick={onProductClick}
              onFocus={() => {}}
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <button
              onClick={() => scrollTo('scripts')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Scripts
            </button>
            <button
              onClick={() => scrollTo('featured')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Featured
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <CurrencySwitcher />
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary"
                onClick={onCompareOpen}
                aria-label="Compare"
              >
                <Package className="h-5 w-5" />
                {compareBadge}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary"
                onClick={onOrdersOpen}
                aria-label="My orders"
              >
                <Package className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary"
                onClick={onWishlistOpen}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistBadge}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary"
                onClick={onCartOpen}
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartBadge}
              </Button>
            </div>
          </div>

          {/* Mobile: Search toggle + cart + menu */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary"
              onClick={onWishlistOpen}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistBadge}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary"
              onClick={onCartOpen}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartBadge}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search row - always visible on mobile */}
        <div className="md:hidden pb-3">
          <NavbarSearch
            products={products}
            onProductClick={onProductClick}
            onFocus={() => {}}
          />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <button
              onClick={() => scrollTo('scripts')}
              className="block w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Scripts
            </button>
            <button
              onClick={() => scrollTo('featured')}
              className="block w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Featured
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="block w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="block w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <div className="border-t border-border pt-2 mt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-border"
                onClick={() => {
                  onCompareOpen()
                  setMobileMenuOpen(false)
                }}
              >
                <Package className="h-4 w-4 mr-1.5" />
                Compare
                {compareCount > 0 && (
                  <span className="ml-1.5 accent-gradient text-white text-xs rounded-full px-1.5 py-0.5">
                    {compareCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-border"
                onClick={() => {
                  onOrdersOpen()
                  setMobileMenuOpen(false)
                }}
              >
                <Package className="h-4 w-4 mr-1.5" />
                My Orders
              </Button>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Currency</span>
              <CurrencySwitcher />
            </div>
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
