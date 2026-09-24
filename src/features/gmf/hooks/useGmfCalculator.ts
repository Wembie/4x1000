import { useCallback, useMemo, useState } from 'react'
import { CALCULATOR_CONFIG } from '@/config/calculator.config'
import type { GmfBreakdown } from '@/domain/gmf/types'
import { normalizeAmountText } from '@/lib/amount-input'
import { formatDigits } from '@/lib/formatters'
import { activeGmfRules } from '../services/rules.service'
import { evaluateAmountText } from '../utils/evaluate-amount'
import type { AmountIssue } from '../utils/messages'

export interface GmfCalculatorState {
  inputText: string
  /** Last value that could be computed; `null` while the input is empty or invalid. */
  breakdown: GmfBreakdown | null
  issue: AmountIssue | null
  setInputText: (text: string) => void
  setAmount: (amount: number) => void
  clear: () => void
}

export function useGmfCalculator(
  initialAmount: number = CALCULATOR_CONFIG.initialAmount,
): GmfCalculatorState {
  const [inputText, setRawText] = useState(() => formatDigits(initialAmount))

  const evaluation = useMemo(() => evaluateAmountText(inputText, activeGmfRules), [inputText])

  const setInputText = useCallback((text: string) => {
    setRawText(normalizeAmountText(text))
  }, [])

  const setAmount = useCallback((amount: number) => {
    setRawText(formatDigits(amount))
  }, [])

  const clear = useCallback(() => {
    setRawText('')
  }, [])

  return useMemo(
    () => ({
      inputText,
      breakdown: evaluation.status === 'ok' ? evaluation.breakdown : null,
      issue: evaluation.status === 'issue' ? evaluation.issue : null,
      setInputText,
      setAmount,
      clear,
    }),
    [inputText, evaluation, setInputText, setAmount, clear],
  )
}
