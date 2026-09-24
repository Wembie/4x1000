import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Stat } from '@/components/ui/Stat'
import type { GmfBreakdown } from '@/domain/gmf/types'
import { formatCop } from '@/lib/formatters'

const PLACEHOLDER = '—'

export function GmfSummary({ breakdown }: { breakdown: GmfBreakdown | null }) {
  const value = (pick: (result: GmfBreakdown) => number) =>
    breakdown ? <AnimatedNumber value={pick(breakdown)} format={formatCop} /> : PLACEHOLDER

  return (
    <dl className="divide-y divide-line">
      <Stat label="Valor enviado" value={value((result) => result.amount)} />
      <Stat label="GMF" value={value((result) => result.gmf)} />
      <Stat label="Costo total" value={value((result) => result.total)} emphasis />
    </dl>
  )
}
