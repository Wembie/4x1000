import { useEffect, useRef, useState } from 'react'
import { DURATION, easeOutCubic } from '@/lib/motion'

const MS_PER_SECOND = 1000

/**
 * Glides a number toward `target` with requestAnimationFrame. Hand-rolled
 * instead of a Motion value so the hero number stays out of the lazy-loaded
 * animation bundle and renders on first paint.
 */
export function useTweenedNumber(
  target: number,
  { duration = DURATION.number, disabled = false } = {},
): number {
  const [value, setValue] = useState(target)
  const currentRef = useRef(target)

  useEffect(() => {
    if (disabled) {
      currentRef.current = target
      return
    }

    const from = currentRef.current
    if (from === target) return

    const durationMs = duration * MS_PER_SECOND
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs)
      const next = from + (target - from) * easeOutCubic(progress)
      currentRef.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [target, duration, disabled])

  return disabled ? target : value
}
