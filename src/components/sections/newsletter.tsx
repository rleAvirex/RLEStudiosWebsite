'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setSubscribed(true)
        toast({
          title: 'Subscribed!',
          description: 'You will receive updates on new scripts and exclusive deals.',
        })
        setEmail('')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to subscribe. Try again later.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network error. Try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-bold">
                Get notified about new releases
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join our newsletter for early access to new scripts, exclusive discount codes,
                and update announcements. No spam, unsubscribe anytime.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                <Check className="h-4 w-4" />
                You are subscribed. Welcome to the family!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background/80 border-border rounded-xl h-11"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Subscribe
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
