'use client'

import { Github, MessageCircle, Mail, Heart, ArrowRight, ShieldCheck, CreditCard, Lock } from 'lucide-react'

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center font-bold text-white text-sm">
                R
              </div>
              <span className="text-lg font-bold tracking-tight">
                RLE <span className="accent-gradient-text">Studios</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium FiveM scripts crafted with care. Optimized performance, clean code, and
              reliable support — trusted by thousands of server owners worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Explore</h3>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => document.getElementById('scripts')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left flex items-center gap-1 group"
              >
                <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                All Scripts
              </button>
              <button
                onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left flex items-center gap-1 group"
              >
                <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                Bundle Deals
              </button>
              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left flex items-center gap-1 group"
              >
                <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                FAQ
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Installation Guide
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Refund Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Payment + trust badges */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Multiple Payment Methods
              </span>
            </div>
            {/* Payment method badges */}
            <div className="flex items-center gap-2">
              {['VISA', 'MC', 'PP', 'STRIPE'].map((method) => (
                <div
                  key={method}
                  className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground border border-border"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RLE Studios. All rights reserved. Not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
        </div>
      </div>
    </footer>
  )
}
