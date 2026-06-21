'use client'

import { useState } from 'react'

interface ImageWithShimmerProps {
  src: string
  alt: string
  className?: string
}

export function ImageWithShimmer({ src, alt, className = '' }: ImageWithShimmerProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 shimmer rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
