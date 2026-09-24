import type { Transition, Variants } from 'motion/react'

/** Durations in seconds, shared by Motion and the number tween. */
export const DURATION = {
  fast: 0.15,
  base: 0.2,
  number: 0.22,
  reveal: 0.5,
} as const

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const easeOutCubic = (progress: number): number => 1 - (1 - progress) ** 3

export const baseTransition: Transition = { duration: DURATION.base, ease: EASE_OUT }

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE_OUT } },
}

export const numberPop = {
  initial: { opacity: 0.55, y: 3, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: DURATION.base, ease: EASE_OUT },
} as const
