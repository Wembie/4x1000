import { useCallback, useMemo, type ReactNode } from 'react'
import { AMOUNT_INPUT_ID, SECTION_IDS } from '@/app/routes'
import { CalculatorContext } from '@/features/gmf/hooks/calculator-context'
import { useGmfCalculator } from '@/features/gmf/hooks/useGmfCalculator'
import { scrollToElement } from '@/lib/utils'

/**
 * The hero calculator, the breakdown chart and the example cards all read
 * and write the same amount, which is the one piece of state worth sharing.
 */
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const calculator = useGmfCalculator()

  const focusCalculator = useCallback(() => {
    scrollToElement(SECTION_IDS.calculator)
    document.getElementById(AMOUNT_INPUT_ID)?.focus({ preventScroll: true })
  }, [])

  const value = useMemo(() => ({ ...calculator, focusCalculator }), [calculator, focusCalculator])

  return <CalculatorContext value={value}>{children}</CalculatorContext>
}
