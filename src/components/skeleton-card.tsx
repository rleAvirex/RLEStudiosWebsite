'use client'

import { Card, CardContent } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
          <div className="h-5 bg-muted rounded animate-pulse w-12" />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 bg-muted rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 bg-muted rounded animate-pulse w-20" />
          <div className="h-3 bg-muted rounded animate-pulse w-12" />
        </div>
        <div className="h-8 bg-muted rounded-lg animate-pulse w-full" />
      </CardContent>
    </Card>
  )
}

interface SkeletonGridProps {
  count?: number
}

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
