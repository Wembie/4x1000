import type { GmfBreakdown } from '@/domain/gmf/types'
import { formatCop, formatPercent } from '@/lib/formatters'

/** Plain-text receipt for the clipboard, readable when pasted into a chat. */
export function buildSummaryText(breakdown: GmfBreakdown): string {
  return [
    `Valor enviado: ${formatCop(breakdown.amount)}`,
    `GMF (${formatPercent(breakdown.appliedRate)}): ${formatCop(breakdown.gmf)}`,
    `Costo total: ${formatCop(breakdown.total)}`,
    'Cálculo informativo — 4x1000',
  ].join('\n')
}
