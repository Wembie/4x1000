import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatProps {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
  emphasis?: boolean
  className?: string
}

/** Label/value row rendered as a description-list pair for screen readers. */
export function Stat({ label, value, hint, emphasis = false, className }: StatProps) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-3', className)}>
      <dt className={cn('text-sm', emphasis ? 'font-medium text-fg' : 'text-muted')}>
        {label}
        {hint && <span className="mt-0.5 block text-xs text-faint">{hint}</span>}
      </dt>
      <dd
        className={cn(
          'text-right tabular',
          emphasis ? 'text-lg font-semibold text-fg' : 'text-[0.9375rem] font-medium text-fg',
        )}
      >
        {value}
      </dd>
    </div>
  )
}
