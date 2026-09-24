import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useTweenedNumber } from '@/hooks/useTweenedNumber'
import { numberPop } from '@/lib/motion'

interface AnimatedNumberProps {
  value: number
  format: (value: number) => string
  className?: string
}

/**
 * Tweens between values and gives the settled number a small lift. Screen
 * readers get the final value only, never the intermediate frames.
 */
export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion() ?? false
  const displayed = useTweenedNumber(value, { disabled: reduceMotion })

  return (
    <span className={className}>
      <span className="sr-only">{format(value)}</span>
      <m.span
        key={value}
        aria-hidden="true"
        className="inline-block"
        {...(reduceMotion ? {} : numberPop)}
      >
        {format(displayed)}
      </m.span>
    </span>
  )
}
