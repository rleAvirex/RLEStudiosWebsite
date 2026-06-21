import Link from 'next/link'
import { Home, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* 404 number */}
        <div className="relative inline-block mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-primary leading-none">404</h1>
          <div className="absolute -top-2 -right-4 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold animate-bounce">
            LOL
          </div>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Looks like this script doesn&apos;t exist — or maybe it got patched out.
          Let&apos;s get you back to the good stuff.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-11 w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/#scripts">
            <Button
              variant="outline"
              className="border-border hover:border-primary/40 rounded-xl px-6 h-11 w-full sm:w-auto"
            >
              <Zap className="h-4 w-4 mr-2" />
              Browse Scripts
            </Button>
          </Link>
        </div>

        {/* Footer text */}
        <p className="text-xs text-muted-foreground mt-12">
          © {new Date().getFullYear()} RLE Studios. All rights reserved.
        </p>
      </div>
    </div>
  )
}
