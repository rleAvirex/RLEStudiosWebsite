'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

export function DiscordWidget() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 1000)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (dismissed || !visible) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[280px] animate-in slide-in-from-left-4 duration-300">
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-4">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Need help choosing?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Join our Discord for instant support, demos, and exclusive deals.
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Join Discord
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
