import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Card } from '@/components/ui/Card'
import { Stat } from '@/components/ui/Stat'
import type { MonthlyGmfSummary } from '@/domain/gmf/types'
import { formatCop, formatPercent } from '@/lib/formatters'

function Money({ value }: { value: number }) {
  return <AnimatedNumber value={value} format={formatCop} />
}

export function MonthlySummary({ summary }: { summary: MonthlyGmfSummary }) {
  const exemptionApplied = summary.exemptThreshold !== null
  const saved = summary.gmfWithoutExemption - summary.totalGmf
  const effectiveRate = summary.totalMoved === 0 ? 0 : summary.totalGmf / summary.totalMoved

  return (
    <Card className="p-5 sm:p-7" aria-live="polite">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="eyebrow">Total movido</p>
          <p className="mt-2 tabular text-2xl font-semibold tracking-[-0.035em] sm:text-4xl">
            <Money value={summary.totalMoved} />
          </p>
        </div>
        <div>
          <p className="eyebrow">GMF calculado</p>
          <p className="mt-2 tabular text-2xl font-semibold tracking-[-0.035em] text-accent sm:text-4xl">
            <Money value={summary.totalGmf} />
          </p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-line border-t border-line">
        <Stat label="Operaciones" value={summary.operations.length} />
        <Stat label="Tasa efectiva del mes" value={formatPercent(effectiveRate)} />
        {exemptionApplied && (
          <>
            <Stat
              label="Monto exento simulado"
              hint={`Tope usado: ${formatCop(summary.exemptThreshold ?? 0)}`}
              value={<Money value={summary.totalExempt} />}
            />
            <Stat label="GMF sin exención" value={<Money value={summary.gmfWithoutExemption} />} />
            <Stat
              label="Diferencia"
              value={<span className="text-money">−{formatCop(saved)}</span>}
            />
          </>
        )}
        <Stat label="Sale de tus cuentas" value={<Money value={summary.totalCost} />} emphasis />
      </dl>
    </Card>
  )
}
