import { GMF_LABELS } from '@/features/gmf/utils/labels'
import { cn } from '@/lib/utils'

const RATE_LABEL = GMF_LABELS.rate

/**
 * Typographic mark. On hover/focus it completes the equation
 * "4 × 1000 = 0,4%" — the whole product in one line.
 */
export function Logo({ className, href = '#' }: { className?: string; href?: string }) {
  return (
    <a href={href} className={cn('group inline-flex items-baseline rounded-md text-fg', className)}>
      <span className="tabular text-[1.0625rem] font-semibold tracking-[-0.04em]">
        4<span className="mx-[0.06em] text-accent">×</span>1000
        <span className="sr-only">, inicio</span>
      </span>
      <span
        aria-hidden="true"
        className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out-soft group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]"
      >
        <span className="overflow-hidden">
          <span className="inline-block translate-y-1 pl-1.5 font-mono tabular text-xs whitespace-nowrap text-muted opacity-0 transition-[opacity,translate] delay-75 duration-300 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            = {RATE_LABEL}
          </span>
        </span>
      </span>
    </a>
  )
}
