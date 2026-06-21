'use client'

import { useState, useEffect } from 'react'
import { X, Zap } from 'lucide-react'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  // Auto-rotate messages
  const messages = [
    { icon: Zap, text: 'Summer Sale: 30% off all featured scripts with code BUNDLE30' },
    { icon: Zap, text: 'New: Police MDT System v4.2.0 just released — check it out!' },
    { icon: Zap, text: 'Buy 3+ featured scripts and get an automatic 30% bundle discount' },
  ]
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [messages.length])

  if (!visible) return null

  const CurrentIcon = messages[msgIndex].icon

  return (
    <div className="accent-gradient text-white text-xs sm:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center relative">
        <CurrentIcon className="h-3.5 w-3.5 shrink-0 animate-pulse" />
        <span key={msgIndex} className="animate-in fade-in slide-in-from-bottom-1 duration-300 font-medium">
          {messages[msgIndex].text}
        </span>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
