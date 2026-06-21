'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'rle-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      // Delay appearance for better UX
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Cookie className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold">We use cookies</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We use cookies to enhance your browsing experience, personalize content, and
              analyze our traffic. By clicking &ldquo;Accept&rdquo; you consent to our use of
              cookies.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-8 text-xs"
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border text-xs rounded-lg h-8"
            onClick={handleDismiss}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}
