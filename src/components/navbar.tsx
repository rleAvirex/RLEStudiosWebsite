'use client'

import { ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useState, useEffect } from 'react'

interface NavbarProps {
  onCartOpen: () => void
  onWishlistOpen: () => void
}

export function Navbar({ onCartOpen, onWishlistOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const wishlistCount = useWishlistStore((s) => s.ids.length)

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
    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
      {totalItems}
    </span>
  )

  const wishlistBadge = wishlistCount > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
      {wishlistCount}
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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm group-hover:scale-110 transition-transform">
              R
            </div>
            <span className="text-lg font-bold tracking-tight">
              RLE <span className="text-primary">Studios</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
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
            <button
              onClick={() => scrollTo('about')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <div className="flex items-center gap-1">
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

          {/* Mobile Menu Button + Cart */}
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
          </div>
        )}
      </div>
    </nav>
  )
}
