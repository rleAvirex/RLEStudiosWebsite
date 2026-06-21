'use client'

import { ArrowDown, Zap, Star, ShieldCheck, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[80px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>Premium FiveM Resources</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Elevate Your{' '}
              <span className="text-primary">FiveM</span>
              <br />
              Server
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              High-quality, optimized scripts for ESX &amp; QBCore frameworks.
              Built by developers, for developers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold rounded-xl w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('scripts')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Browse Scripts
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:border-primary/50 px-8 h-12 text-base rounded-xl w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5 text-primary" />
                Instant delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-primary" />
                4.9 / 5 rating
              </span>
            </div>
          </div>

          {/* Right: Floating preview cards */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative h-[460px]">
              {/* Main preview card */}
              <div className="absolute top-0 right-0 w-72 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-black/40">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src="/products/mdt.jpg"
                    alt="Featured script preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-primary">Police MDT System</span>
                    <span className="text-xs text-muted-foreground">Job</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">5.0</span>
                    </div>
                    <span className="text-sm font-bold text-primary">€39.99</span>
                  </div>
                </div>
              </div>

              {/* Bottom-left floating card */}
              <div className="absolute bottom-12 left-0 w-56 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-black/40">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src="/products/hud.jpg"
                    alt="Featured HUD"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-1.5">
                  <span className="text-xs font-semibold text-primary">Custom HUD UI</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">UI</span>
                    <span className="text-sm font-bold text-primary">€19.99</span>
                  </div>
                </div>
              </div>

              {/* Floating discount badge */}
              <div className="absolute top-32 left-6 px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 text-center">
                <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                  Save up to
                </div>
                <div className="text-lg font-bold leading-tight">30% OFF</div>
              </div>

              {/* Floating rating bubble */}
              <div className="absolute bottom-0 right-12 px-3 py-2 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold">4.9 / 5</div>
                  <div className="text-[10px] text-muted-foreground">2,800+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto lg:mx-0">
          <div className="text-center lg:text-left">
            <div className="text-2xl sm:text-3xl font-bold text-primary">50+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Scripts</div>
          </div>
          <div className="text-center lg:text-left border-x border-border px-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary">2K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Customers</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Support</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => {
          document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce hidden sm:block"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </section>
  )
}
