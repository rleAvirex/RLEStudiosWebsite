'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X, TrendingUp, Clock, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { type Product } from '@/lib/store'

interface NavbarSearchProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onFocus: () => void
}

const RECENT_SEARCHES_KEY = 'rle-recent-searches'
const MAX_RECENT = 5

export function NavbarSearch({ products, onProductClick, onFocus }: NavbarSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize recent searches from localStorage (client-only, avoids effect)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Compute suggestions via useMemo — no setState in effect
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      )
      .slice(0, 5)
  }, [query, products])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const clearRecent = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {
      // ignore
    }
  }

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const handleSelect = (product: Product) => {
    saveRecentSearch(product.name)
    onProductClick(product)
    setQuery('')
    setOpen(false)
  }

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim())
      // Find first matching product and open it
      const first = suggestions[0]
      if (first) {
        handleSelect(first)
      } else {
        setOpen(false)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-44 lg:w-56">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search scripts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            onFocus()
          }}
          onFocus={() => {
            setOpen(true)
            onFocus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearchSubmit()
            }
          }}
          className="pl-8 pr-7 h-9 text-xs sm:text-sm bg-muted/50 border-border rounded-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50">
          {/* Recent searches (only when no query) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="py-1">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  Recent Searches
                </span>
                <button
                  onClick={clearRecent}
                  className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                  Clear
                </button>
              </div>
              {recentSearches.map((term) => (
                <div
                  key={term}
                  className="flex items-center group"
                >
                  <button
                    onClick={() => {
                      setQuery(term)
                    }}
                    className="flex-1 flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 transition-colors text-left text-xs"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{term}</span>
                  </button>
                  <button
                    onClick={() => removeRecent(term)}
                    className="px-2 py-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="border-t border-border" />
            </div>
          )}

          {/* Search suggestions */}
          {query.trim() ? (
            suggestions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No scripts found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="py-1 max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{product.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {product.category}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">
                        €{product.price.toFixed(2)}
                      </div>
                      {product.salesCount > 1000 && (
                        <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                          <TrendingUp className="h-2.5 w-2.5" />
                          Hot
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  )
}
