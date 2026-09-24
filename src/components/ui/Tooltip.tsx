import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useId, useState, type ReactNode } from 'react'
import { baseTransition } from '@/lib/motion'

interface TooltipProps {
  content: ReactNode
  /** Accessible name of the trigger button. */
  label: string
  children: ReactNode
}

/** Hover/focus tooltip. Esc dismisses it without moving focus (WCAG 1.4.13). */
export function Tooltip({ content, label, children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()

  const show = () => {
    setOpen(true)
  }
  const hide = () => {
    setOpen(false)
  }

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={show}
        onBlur={hide}
        onClick={() => {
          setOpen((value) => !value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') hide()
        }}
        className="inline-flex size-6 items-center justify-center rounded-full text-faint transition-colors hover:text-fg"
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <m.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={baseTransition}
            className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-xl border border-line-strong bg-surface-3 px-3.5 py-3 text-left text-[0.8125rem] leading-snug font-normal tracking-normal text-fg normal-case shadow-[0_12px_32px_-12px_rgb(0_0_0/0.7)]"
          >
            {content}
          </m.span>
        )}
      </AnimatePresence>
    </span>
  )
}
