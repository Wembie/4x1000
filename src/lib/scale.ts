import { clamp } from './utils'

export interface LogScaleOptions {
  min: number
  max: number
  steps: number
  /** Significant digits kept when snapping; enough to never collapse two steps. */
  significantDigits: number
}

export interface LogScale {
  toAmount: (position: number) => number
  toPosition: (amount: number) => number
  steps: number
}

export function roundToSignificant(value: number, digits: number): number {
  if (value <= 0) return 0
  const magnitude = Math.floor(Math.log10(value))
  const step = 10 ** Math.max(0, magnitude - digits + 1)
  return Math.round(value / step) * step
}

/**
 * Money is perceived logarithmically: going from $100.000 to $200.000 feels
 * like the same jump as $5M to $10M. A linear slider would spend almost all
 * of its travel on amounts nobody moves.
 */
export function createLogScale({ min, max, steps, significantDigits }: LogScaleOptions): LogScale {
  const logMin = Math.log(min)
  const logRange = Math.log(max) - logMin

  return {
    steps,
    toAmount: (position) => {
      const ratio = clamp(position, 0, steps) / steps
      const raw = Math.exp(logMin + ratio * logRange)
      return clamp(roundToSignificant(raw, significantDigits), min, max)
    },
    toPosition: (amount) => {
      if (amount <= min) return 0
      if (amount >= max) return steps
      return Math.round(((Math.log(amount) - logMin) / logRange) * steps)
    },
  }
}
