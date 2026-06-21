'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  renderValue?: (value: number) => string
}

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  renderValue,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const hasAnimatedRef = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimatedRef.current) return

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * value))
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(value)
        }
      }
      requestAnimationFrame(animate)
    }

    // Check if element is already visible on mount (before setting up observer)
    const rect = el.getBoundingClientRect()
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )

    if (isInViewport) {
      // Use a small delay to avoid synchronous state update in effect
      const raf = requestAnimationFrame(startAnimation)
      return () => cancelAnimationFrame(raf)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [value, duration])

  const displayValue = renderValue ? renderValue(count) : count.toLocaleString()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
