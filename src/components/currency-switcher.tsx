'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCurrencyStore, type Currency } from '@/lib/store'

const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: 'EUR', symbol: '€', label: 'EUR' },
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
]

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore()
  const [open, setOpen] = useState(false)

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  // Suppress hydration mismatch warning by ensuring consistent first render
  const current = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
        aria-label={`Currency: ${current.label}`}
        aria-expanded={open}
      >
        <span className="font-semibold">{current.symbol}</span>
        <span>{current.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full right-0 mt-1 min-w-[100px] bg-card border border-border rounded-lg shadow-xl shadow-black/20 overflow-hidden z-50">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors ${
                  c.code === currency ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold w-3">{c.symbol}</span>
                  {c.label}
                </span>
                {c.code === currency && <span className="text-primary">●</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
