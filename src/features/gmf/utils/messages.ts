import type { GmfErrorCode } from '@/domain/gmf/types'
import { MAX_OPERATION_AMOUNT } from '@/domain/gmf/constants'
import { formatCop } from '@/lib/formatters'

export type AmountIssue = 'empty' | 'invalid' | GmfErrorCode

export const AMOUNT_ISSUE_MESSAGES: Record<AmountIssue, string> = {
  empty: 'Introduce un valor para calcular.',
  invalid: 'Introduce un valor válido.',
  'not-a-number': 'Introduce un valor válido.',
  negative: 'El valor no puede ser negativo.',
  'too-large': `El valor máximo es ${formatCop(MAX_OPERATION_AMOUNT)}.`,
}
