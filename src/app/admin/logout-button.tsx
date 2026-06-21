'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
    } catch {
      // ignore
    }
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive rounded-lg h-8 px-2"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="h-3.5 w-3.5 mr-1" />
      <span className="text-xs">{loading ? '...' : 'Logout'}</span>
    </Button>
  )
}
