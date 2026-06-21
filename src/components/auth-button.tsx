'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export function AuthButton() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-1">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-xs">
          <User className="h-3 w-3 text-primary" />
          <span className="max-w-[100px] truncate">{session.user.email}</span>
        </div>
        <button
          onClick={async () => {
            setLoading(true)
            await signOut({ callbackUrl: '/' })
          }}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Sign out"
          disabled={loading}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary border border-border hover:border-primary/40 transition-colors"
    >
      <LogIn className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  )
}
