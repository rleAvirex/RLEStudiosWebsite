'use client'

import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Marcus "FiveRP" K.',
    role: 'Server Owner — 200 players',
    rating: 5,
    text: 'The Police MDT system is hands down the best I have used. The dev team is super responsive and the script runs flawlessly. Worth every cent.',
    avatar: 'F',
  },
  {
    name: 'Sarah "Nova" L.',
    role: 'Community Manager',
    rating: 5,
    text: 'Switched our entire server over to RLE scripts. The HUD is gorgeous and the inventory system is rock solid. Our players love the new look.',
    avatar: 'S',
  },
  {
    name: 'Dmitri V.',
    role: 'Server Owner — 80 players',
    rating: 5,
    text: 'The garage system was easy to install and configure. Documentation is on point. Saved me hours of development time. Highly recommend.',
    avatar: 'D',
  },
  {
    name: 'Aiden "Hex" R.',
    role: 'Lead Developer',
    rating: 5,
    text: 'Code quality is excellent — well structured, optimized, and easy to extend. The banking system became the backbone of our economy overnight.',
    avatar: 'A',
  },
  {
    name: 'Mia T.',
    role: 'Server Owner — 350 players',
    rating: 5,
    text: 'The drug processing system added so much roleplay value to our server. Players actually want to engage with the mechanics now. Brilliant work.',
    avatar: 'M',
  },
  {
    name: 'Carlos "Zeta" P.',
    role: 'Admin — 120 players',
    rating: 5,
    text: 'Support is genuinely 24/7. Had an issue at 3 AM and got a fix within 20 minutes. These guys care about their product. 10/10.',
    avatar: 'C',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">
            Customer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Loved by server owners
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Join thousands of FiveM communities who trust RLE Studios to power their servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-primary/30" />
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
