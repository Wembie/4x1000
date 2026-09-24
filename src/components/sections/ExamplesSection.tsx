import { ArrowUpRight } from 'lucide-react'
import { SECTION_IDS } from '@/app/routes'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { CALCULATOR_CONFIG } from '@/config/calculator.config'
import { calculateGmf } from '@/domain/gmf/calculator'
import { useCalculator } from '@/features/gmf/hooks/calculator-context'
import { activeGmfRules } from '@/features/gmf/services/rules.service'
import { formatCop } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const EXAMPLES = CALCULATOR_CONFIG.examples.flatMap((amount) => {
  const result = calculateGmf({ amount }, activeGmfRules)
  return result.ok ? [{ amount, gmf: result.gmf }] : []
})

const STAGGER_SECONDS = 0.04

export function ExamplesSection() {
  const { breakdown, setAmount, focusCalculator } = useCalculator()

  return (
    <Section
      id={SECTION_IDS.examples}
      eyebrow="02 — Ejemplos"
      title="Míralo en números"
      description="Montos típicos de una transferencia. Toca uno y lo llevamos a la calculadora."
    >
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
        {EXAMPLES.map((example, index) => {
          const active = breakdown?.amount === example.amount
          return (
            <li key={example.amount}>
              <Reveal delay={index * STAGGER_SECONDS} className="h-full">
                <button
                  type="button"
                  aria-label={`Calcular ${formatCop(example.amount)}. GMF ${formatCop(example.gmf)}`}
                  aria-current={active || undefined}
                  onClick={() => {
                    setAmount(example.amount)
                    focusCalculator()
                  }}
                  className={cn(
                    'group relative flex h-full w-full flex-col rounded-card border p-4 text-left transition-[border-color,background-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 active:translate-y-0 sm:p-6',
                    active
                      ? 'border-accent/40 bg-surface-2'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
                  )}
                >
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="absolute top-4 right-4 size-4 text-faint transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent sm:top-6 sm:right-6"
                  />
                  <span className="tabular text-lg font-semibold tracking-tight sm:text-2xl">
                    {formatCop(example.amount)}
                  </span>
                  <span className="mt-6 flex items-baseline gap-2 text-sm sm:mt-10">
                    <span className="eyebrow text-[0.625rem]">GMF</span>
                    <span className="tabular font-medium text-accent">
                      {formatCop(example.gmf)}
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
