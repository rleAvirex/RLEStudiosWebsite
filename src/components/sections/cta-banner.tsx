'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CTABannerProps {
  onBrowse: () => void
}

export function CTABanner({ onBrowse }: CTABannerProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-12">
          {/* Background grid + glow */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Sparkles className="h-3 w-3" />
                Limited Time Bundle Deal
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Save up to <span className="accent-gradient-text">30%</span> on featured scripts
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
                Bundle any 3 featured scripts and get an automatic 30% discount at checkout.
                Limited time only — upgrade your server today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                size="lg"
                className="btn-gradient-slide rounded-xl h-12 px-7 font-semibold"
                onClick={onBrowse}
              >
                Browse Scripts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
