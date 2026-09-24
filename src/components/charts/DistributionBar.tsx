import { cn } from '@/lib/utils'

export interface DistributionSegment {
  key: string
  label: string
  value: number
  /** Tailwind background class; the legend repeats it next to a text label. */
  colorClass: string
}

interface DistributionBarProps {
  segments: readonly DistributionSegment[]
  label: string
  className?: string
}

/**
 * Proportional bar: vertical on phones, horizontal from `sm`. Flex-grow does
 * the math, and tiny segments keep a minimum size so a 0,4% slice is still
 * visible instead of rounding away to nothing.
 */
export function DistributionBar({ segments, label, className }: DistributionBarProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'flex h-60 w-16 flex-col-reverse gap-[3px] sm:h-16 sm:w-full sm:flex-row',
        className,
      )}
    >
      {segments.map((segment) => (
        <div
          key={segment.key}
          className={cn(
            'min-h-1.5 rounded-md transition-[flex-grow] duration-500 ease-out-soft sm:min-h-0 sm:min-w-1.5',
            segment.colorClass,
          )}
          style={{ flexGrow: segment.value, flexBasis: 0 }}
        />
      ))}
    </div>
  )
}
