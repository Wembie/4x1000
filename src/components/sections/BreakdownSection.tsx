import { SECTION_IDS } from '@/app/routes'
import { DistributionBar, type DistributionSegment } from '@/components/charts/DistributionBar'
import { PerMilleGrid } from '@/components/charts/PerMilleGrid'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { PER_MILLE } from '@/domain/gmf/constants'
import type { GmfBreakdown } from '@/domain/gmf/types'
import { useCalculator } from '@/features/gmf/hooks/calculator-context'
import { activeGmfRules } from '@/features/gmf/services/rules.service'
import { GMF_LABELS } from '@/features/gmf/utils/labels'
import { formatCop, formatPercent } from '@/lib/formatters'

const HIGHLIGHTED_CELLS = Math.round(activeGmfRules.rate * PER_MILLE)

function share(part: number, total: number): string {
  return formatPercent(total === 0 ? 0 : part / total)
}

function toSegments(breakdown: GmfBreakdown): DistributionSegment[] {
  return [
    { key: 'amount', label: 'Operación', value: breakdown.amount, colorClass: 'bg-money' },
    { key: 'gmf', label: 'GMF', value: breakdown.gmf, colorClass: 'bg-accent' },
  ]
}

export function BreakdownSection() {
  const { breakdown } = useCalculator()

  return (
    <Section
      id={SECTION_IDS.breakdown}
      eyebrow="01 — Cómo funciona"
      title="Así se distribuye tu operación"
      description={`Cada ${formatCop(PER_MILLE)} que sale de tu cuenta arrastra ${GMF_LABELS.pesosPerThousand} de GMF. Poco por operación; se nota cuando se acumula.`}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <Card className="h-full p-5 sm:p-8">
            {breakdown ? (
              <OperationDistribution breakdown={breakdown} />
            ) : (
              <p className="text-muted">Pon un monto en la calculadora para ver el desglose.</p>
            )}
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="flex h-full flex-col p-5 sm:p-8">
            <p className="eyebrow">{GMF_LABELS.perThousand}</p>
            <p className="mt-3 max-w-xs text-lg leading-snug font-medium tracking-tight">
              De cada mil pesos que mueves, {HIGHLIGHTED_CELLS} se van en el impuesto.
            </p>
            <PerMilleGrid
              highlighted={HIGHLIGHTED_CELLS}
              label={`Cuadrícula de ${String(PER_MILLE)} celdas con ${String(HIGHLIGHTED_CELLS)} resaltadas`}
              className="mt-auto pt-8"
            />
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}

function OperationDistribution({ breakdown }: { breakdown: GmfBreakdown }) {
  const segments = toSegments(breakdown)
  const chartLabel = `Operación ${formatCop(breakdown.amount)}, GMF ${formatCop(breakdown.gmf)}, total ${formatCop(breakdown.total)}`

  return (
    <div className="flex h-full flex-col">
      <p className="eyebrow">Sale de tu cuenta</p>
      <p className="mt-2 tabular text-[2.25rem] leading-none font-semibold tracking-[-0.04em] sm:text-5xl">
        <AnimatedNumber value={breakdown.total} format={formatCop} />
      </p>

      <div className="mt-8 flex gap-6 sm:mt-10 sm:block">
        <DistributionBar segments={segments} label={chartLabel} className="shrink-0" />

        <dl className="flex flex-1 flex-col justify-between gap-5 sm:mt-6 sm:grid sm:grid-cols-2">
          {segments.map((segment) => (
            <div key={segment.key}>
              <dt className="flex items-center gap-2 text-sm text-muted">
                <span aria-hidden="true" className={`size-2.5 rounded-sm ${segment.colorClass}`} />
                {segment.label}
                <span className="font-mono tabular text-xs text-faint">
                  {share(segment.value, breakdown.total)}
                </span>
              </dt>
              <dd className="mt-1 tabular text-xl font-semibold tracking-tight">
                <AnimatedNumber value={segment.value} format={formatCop} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-8 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-faint">
        Porcentajes sobre el total que sale de la cuenta. El GMF equivale al {GMF_LABELS.rate} del
        valor de la operación.
      </p>
    </div>
  )
}
