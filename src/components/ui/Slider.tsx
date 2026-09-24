import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  id?: string
  value: number
  max: number
  onValueChange: (value: number) => void
  /** Human reading of the value, e.g. "$1.000.000"; the raw position means nothing. */
  valueText: string
  label: string
  className?: string
}

/** Native range input: keyboard, touch and screen-reader support come for free. */
export function Slider({
  id,
  value,
  max,
  onValueChange,
  valueText,
  label,
  className,
}: SliderProps) {
  const fill = `${String((value / max) * 100)}%`

  return (
    <input
      id={id}
      type="range"
      min={0}
      max={max}
      step={1}
      value={value}
      aria-label={label}
      aria-valuetext={valueText}
      onChange={(event) => {
        onValueChange(Number(event.target.value))
      }}
      className={cn('range', className)}
      style={{ '--fill': fill } as CSSProperties}
    />
  )
}
