import { createContext, useContext } from 'react'
import type { GmfCalculatorState } from './useGmfCalculator'

export interface CalculatorContextValue extends GmfCalculatorState {
  /** Scrolls to the calculator and focuses the amount field. */
  focusCalculator: () => void
}

export const CalculatorContext = createContext<CalculatorContextValue | null>(null)

export function useCalculator(): CalculatorContextValue {
  const context = useContext(CalculatorContext)
  if (!context) throw new Error('useCalculator must be used inside <CalculatorProvider>')
  return context
}
