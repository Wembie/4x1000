import { useCallback, useMemo, useRef, useState } from 'react'
import { CALCULATOR_CONFIG } from '@/config/calculator.config'
import { calculateMonthlyGmf } from '@/domain/gmf/calculator'
import type { ExemptionStatus, MonthlyGmfSummary } from '@/domain/gmf/types'
import { normalizeAmountText } from '@/lib/amount-input'
import { formatDigits } from '@/lib/formatters'
import { activeGmfRules } from '../services/rules.service'
import { evaluateAmountText } from '../utils/evaluate-amount'
import type { AmountIssue } from '../utils/messages'

export interface OperationDraft {
  id: number
  text: string
}

export interface OperationRow extends OperationDraft {
  amount: number | null
  issue: AmountIssue | null
}

const { initialOperations, maxOperations } = CALCULATOR_CONFIG.monthly

export function operationInputId(id: number): string {
  return `operacion-${String(id)}`
}

function createDrafts(amounts: readonly number[]): OperationDraft[] {
  return amounts.map((amount, index) => ({ id: index, text: formatDigits(amount) }))
}

function toRow(draft: OperationDraft): OperationRow {
  const evaluation = evaluateAmountText(draft.text, activeGmfRules)
  if (evaluation.status === 'ok') {
    return { ...draft, amount: evaluation.breakdown.amount, issue: null }
  }
  // An empty row is not an error; it is simply not counted yet.
  const issue = evaluation.issue === 'empty' ? null : evaluation.issue
  return { ...draft, amount: null, issue }
}

export function useMonthlySimulator() {
  const nextId = useRef(initialOperations.length)
  const [drafts, setDrafts] = useState(() => createDrafts(initialOperations))
  const [exemptionStatus, setExemptionStatus] = useState<ExemptionStatus>('none')

  const rows = useMemo(() => drafts.map(toRow), [drafts])

  const summary = useMemo<MonthlyGmfSummary | null>(() => {
    const amounts = rows.flatMap((row) => (row.amount === null ? [] : [row.amount]))
    const result = calculateMonthlyGmf({ amounts, exemptionStatus }, activeGmfRules)
    return result.ok ? result : null
  }, [rows, exemptionStatus])

  const updateOperation = useCallback((id: number, text: string) => {
    const normalized = normalizeAmountText(text)
    setDrafts((current) =>
      current.map((draft) => (draft.id === id ? { ...draft, text: normalized } : draft)),
    )
  }, [])

  const addOperation = useCallback((): number => {
    const id = nextId.current
    nextId.current += 1
    setDrafts((current) =>
      current.length >= maxOperations ? current : [...current, { id, text: '' }],
    )
    return id
  }, [])

  const removeOperation = useCallback((id: number) => {
    setDrafts((current) => current.filter((draft) => draft.id !== id))
  }, [])

  const reset = useCallback(() => {
    nextId.current = initialOperations.length
    setDrafts(createDrafts(initialOperations))
    setExemptionStatus('none')
  }, [])

  return {
    rows,
    summary,
    exemptionStatus,
    setExemptionStatus,
    canAddOperation: drafts.length < maxOperations,
    maxOperations,
    exemptionAvailable: activeGmfRules.exemptThreshold !== undefined,
    updateOperation,
    addOperation,
    removeOperation,
    reset,
  }
}
