'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Zap, Star, ShieldCheck, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/animated-counter'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const floatingCard = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.4 + i * 0.15, ease: 'easeOut' as const },
  }),
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-background" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
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
          <motion.div
            className="lg:col-span-7 text-center lg:text-left"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-6"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Premium FiveM Resources</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Elevate Your{' '}
              <span className="text-primary">FiveM</span>
              <br />
              Server
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              High-quality, optimized scripts for ESX &amp; QBCore frameworks.
              Built by developers, for developers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
            >
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
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
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
            </motion.div>
          </motion.div>

          {/* Right: Floating preview cards */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative h-[460px]">
              {/* Main preview card */}
              <motion.div
                custom={0}
                variants={floatingCard}
                initial="hidden"
                animate="show"
                className="absolute top-0 right-0 w-72 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-black/40"
              >
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
              </motion.div>

              {/* Bottom-left floating card */}
              <motion.div
                custom={1}
                variants={floatingCard}
                initial="hidden"
                animate="show"
                className="absolute bottom-12 left-0 w-56 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-black/40"
              >
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
              </motion.div>

              {/* Floating discount badge */}
              <motion.div
                custom={2}
                variants={floatingCard}
                initial="hidden"
                animate="show"
                className="absolute top-32 left-6 px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 text-center"
              >
                <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                  Save up to
                </div>
                <div className="text-lg font-bold leading-tight">30% OFF</div>
              </motion.div>

              {/* Floating rating bubble */}
              <motion.div
                custom={3}
                variants={floatingCard}
                initial="hidden"
                animate="show"
                className="absolute bottom-0 right-12 px-3 py-2 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold">4.9 / 5</div>
                  <div className="text-[10px] text-muted-foreground">2,800+ reviews</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 lg:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto lg:mx-0"
        >
          <div className="text-center lg:text-left">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              <AnimatedCounter value={50} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Scripts</div>
          </div>
          <div className="text-center lg:text-left border-y lg:border-y-0 lg:border-x border-border py-2 lg:py-0 lg:px-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              <AnimatedCounter value={2000} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Customers</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Support</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => {
          document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors hidden sm:block"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </section>
  )
}
