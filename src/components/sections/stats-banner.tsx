'use client'

import { ShoppingBag, TrendingUp, Star, Clock } from 'lucide-react'

const STATS = [
  {
    icon: ShoppingBag,
    label: 'Scripts Sold',
    value: '12,400+',
  },
  {
    icon: TrendingUp,
    label: 'Active Servers',
    value: '2,800+',
  },
  {
    icon: Star,
    label: 'Average Rating',
    value: '4.9 / 5',
  },
  {
    icon: Clock,
    label: 'Support Response',
    value: '< 30 min',
  },
]

export function StatsBanner() {
  return (
    <section className="py-12 sm:py-16 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
