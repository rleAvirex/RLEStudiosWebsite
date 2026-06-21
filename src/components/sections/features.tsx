'use client'

import { Zap, ShieldCheck, RefreshCw, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Delivery',
    description:
      'Get your scripts immediately after purchase. No waiting, no delays — automated digital delivery.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    description:
      'Safe encrypted payments. Your data stays private. Multiple payment methods supported.',
  },
  {
    icon: RefreshCw,
    title: 'Lifetime Updates',
    description:
      'Free updates for life on every purchase. We continuously improve and patch our scripts.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description:
      'Dedicated Discord support channel. Quick responses from developers who built the scripts.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Built for serious server owners
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Every script is tested, optimized, and supported by developers who actually play
            FiveM. Quality you can count on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
