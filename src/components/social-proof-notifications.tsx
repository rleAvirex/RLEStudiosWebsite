'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ShoppingBag, MapPin } from 'lucide-react'

interface SocialProof {
  productName: string
  productImage: string
  location: string
  timeAgo: string
}

const SOCIAL_PROOFS: SocialProof[] = [
  { productName: 'Police MDT System', productImage: '/products/mdt.jpg', location: 'Berlin, Germany', timeAgo: '2 minutes ago' },
  { productName: 'Custom HUD UI', productImage: '/products/hud.jpg', location: 'London, UK', timeAgo: '5 minutes ago' },
  { productName: 'Advanced Garage System', productImage: '/products/garage.jpg', location: 'Paris, France', timeAgo: '8 minutes ago' },
  { productName: 'Advanced Banking', productImage: '/products/banking.jpg', location: 'Amsterdam, Netherlands', timeAgo: '12 minutes ago' },
  { productName: 'Drug Processing System', productImage: '/products/drugs.jpg', location: 'Madrid, Spain', timeAgo: '15 minutes ago' },
  { productName: 'Advanced Inventory', productImage: '/products/inventory.jpg', location: 'Stockholm, Sweden', timeAgo: '18 minutes ago' },
  { productName: 'Player Housing System', productImage: '/products/housing.jpg', location: 'Rome, Italy', timeAgo: '22 minutes ago' },
  { productName: 'Ambulance Job Enhanced', productImage: '/products/ambulance.jpg', location: 'Vienna, Austria', timeAgo: '25 minutes ago' },
  { productName: 'Police MDT System', productImage: '/products/mdt.jpg', location: 'Warsaw, Poland', timeAgo: 'just now' },
  { productName: 'Custom HUD UI', productImage: '/products/hud.jpg', location: 'Lisbon, Portugal', timeAgo: '3 minutes ago' },
]

export function SocialProofNotifications() {
  const [currentProof, setCurrentProof] = useState<SocialProof | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (dismissed) return

    // Show first notification after 8 seconds
    const initialDelay = setTimeout(() => {
      setCurrentProof(SOCIAL_PROOFS[0])
      setVisible(true)
    }, 8000)

    return () => clearTimeout(initialDelay)
  }, [dismissed])

  useEffect(() => {
    if (!visible || !currentProof) return

    // Auto-hide after 6 seconds
    const hideTimeout = setTimeout(() => {
      setVisible(false)
      // Show next one after 15 seconds
      timeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % SOCIAL_PROOFS.length)
        setCurrentProof(SOCIAL_PROOFS[(index + 1) % SOCIAL_PROOFS.length])
        setVisible(true)
      }, 15000)
    }, 6000)

    return () => {
      clearTimeout(hideTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [visible, currentProof, index])

  if (dismissed || !currentProof) return null

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-[300px] transition-all duration-400 ${
        visible ? 'animate-slide-in-left' : 'animate-slide-out-left'
      }`}
    >
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-3 flex items-center gap-3">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
          aria-label="Dismiss notifications"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
          <img
            src={currentProof.productImage}
            alt={currentProof.productName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
            <ShoppingBag className="h-2.5 w-2.5 text-primary" />
            <span className="font-medium">Someone just bought</span>
          </div>
          <p className="text-xs font-semibold truncate">{currentProof.productName}</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate">{currentProof.location}</span>
            <span>·</span>
            <span className="shrink-0">{currentProof.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
