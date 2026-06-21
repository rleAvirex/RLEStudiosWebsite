'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // Use resolvedTheme which reflects the actual applied theme
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-muted-foreground hover:text-primary overflow-hidden"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      suppressHydrationWarning
    >
      <div className="relative w-5 h-5">
        <Sun
          className="absolute inset-0 h-5 w-5 transition-all duration-300 dark:opacity-0 dark:rotate-90 dark:scale-0 opacity-100 rotate-0 scale-100"
        />
        <Moon
          className="absolute inset-0 h-5 w-5 transition-all duration-300 dark:opacity-100 dark:rotate-0 dark:scale-100 opacity-0 -rotate-90 scale-0"
        />
      </div>
    </Button>
  )
}
