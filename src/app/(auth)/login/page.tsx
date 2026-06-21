'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, KeyRound, ArrowRight, AlertCircle, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send code')
        return
      }

      // In dev mode, show the code for easy testing
      if (data.code) {
        setDevCode(data.code)
      }
      setStep('code')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('magic-code', {
        email,
        code,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid or expired code. Try again.')
        return
      }

      // Sync any guest orders to DB
      try {
        const stored = localStorage.getItem('rle-orders')
        if (stored) {
          const { orders } = JSON.parse(stored)
          if (orders?.length > 0) {
            await fetch('/api/auth/sync-orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, orders }),
            })
          }
        }
      } catch {
        // Non-critical: order sync failure shouldn't block login
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 group mb-6"
          >
            <img
              src="/Logo.png"
              alt="RLE Studios"
              className="h-11 w-11 rounded-xl object-cover group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight">
              RLE <span className="accent-gradient-text">Studios</span>
            </span>
          </button>

          <h1 className="text-2xl font-bold">
            {step === 'email' ? 'Welcome back' : 'Check your email'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {step === 'email'
              ? 'Sign in to access your order history across devices.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 bg-card border-border rounded-xl h-12"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-gradient-slide rounded-xl h-12 font-semibold"
              disabled={sending || !email}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Send Code
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              No account needed — we&apos;ll create one automatically.
            </p>
          </form>
        )}

        {/* Step 2: Code verification */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {/* Dev mode code display */}
            {devCode && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-1">
                <p className="text-xs text-muted-foreground">Dev mode — your code:</p>
                <p className="text-3xl font-mono font-bold text-primary tracking-[0.3em]">
                  {devCode}
                </p>
              </div>
            )}

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="pl-10 bg-card border-border rounded-xl h-12 text-center text-2xl tracking-[0.3em] font-mono"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-gradient-slide rounded-xl h-12 font-semibold"
              disabled={loading || code.length < 6}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <button
              type="button"
              className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={() => { setStep('email'); setCode(''); setError(''); }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          © {new Date().getFullYear()} RLE Studios. All rights reserved.
        </p>
      </div>
    </div>
  )
}
