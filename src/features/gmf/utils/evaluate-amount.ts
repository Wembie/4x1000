import { calculateGmf } from '@/domain/gmf/calculator'
import type { GmfBreakdown, GmfRules } from '@/domain/gmf/types'
import { parseAmountInput } from '@/lib/amount-input'
import type { AmountIssue } from './messages'

export type AmountEvaluation =
  { status: 'ok'; breakdown: GmfBreakdown } | { status: 'issue'; issue: AmountIssue }

/** Text as typed → GMF breakdown or the reason it cannot be computed. */
export function evaluateAmountText(text: string, rules: GmfRules): AmountEvaluation {
  const parsed = parseAmountInput(text)
  if (parsed.kind !== 'value') return { status: 'issue', issue: parsed.kind }

  const result = calculateGmf({ amount: parsed.value }, rules)
  return result.ok ? { status: 'ok', breakdown: result } : { status: 'issue', issue: result.code }
}
