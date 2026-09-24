import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'neutral' | 'money' | 'accent' | 'danger'

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-line-strong text-muted',
  money: 'border-money/30 bg-money-soft text-money',
  accent: 'border-accent/30 bg-accent-soft text-accent',
  danger: 'border-danger/30 bg-danger-soft text-[#fca5a5]',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] font-medium tracking-wide uppercase',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
