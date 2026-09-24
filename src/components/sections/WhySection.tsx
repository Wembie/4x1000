import type { ReactNode } from 'react'
import { SECTION_IDS } from '@/app/routes'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { PER_MILLE } from '@/domain/gmf/constants'
import { calculateGmf } from '@/domain/gmf/calculator'
import { activeGmfRules, pesosPerThousand } from '@/features/gmf/services/rules.service'
import { GMF_LABELS } from '@/features/gmf/utils/labels'
import { formatCop, formatNumber } from '@/lib/formatters'

const EXAMPLE_AMOUNT = 1_000_000
const exampleResult = calculateGmf({ amount: EXAMPLE_AMOUNT }, activeGmfRules)
const EXAMPLE_GMF = exampleResult.ok ? formatCop(exampleResult.gmf) : ''

const EXEMPT_DETAIL =
  GMF_LABELS.exemptLimitUvt && GMF_LABELS.exemptThreshold
    ? ` (${GMF_LABELS.exemptLimitUvt}, unos ${GMF_LABELS.exemptThreshold} en ${GMF_LABELS.ruleYear})`
    : ''

interface Explainer {
  title: string
  body: ReactNode
  visual?: ReactNode
}

const EXPLAINERS: readonly Explainer[] = [
  {
    title: '¿Qué es?',
    body: (
      <>
        El Gravamen a los Movimientos Financieros (GMF) es un impuesto nacional sobre ciertas
        operaciones que mueven plata dentro del sistema financiero. Tu banco lo descuenta y se lo
        gira a la DIAN.
      </>
    ),
  },
  {
    title: '¿Cuánto es?',
    visual: (
      <p className="tabular text-3xl font-semibold tracking-[-0.04em]">
        {formatNumber(pesosPerThousand)} <span className="font-normal text-accent">×</span> cada{' '}
        {formatCop(PER_MILLE)}
      </p>
    ),
    body: (
      <>
        Es decir, el {GMF_LABELS.rate} del valor de la operación. En {formatCop(EXAMPLE_AMOUNT)} son{' '}
        {EXAMPLE_GMF}.
      </>
    ),
  },
  {
    title: '¿Cuándo se cobra?',
    body: (
      <>
        En general, cuando la plata sale de una cuenta de ahorros, corriente o de un depósito: un
        retiro, una transferencia a otra persona, un pago con débito o con cheque. La entidad lo
        descuenta en el momento del movimiento.
      </>
    ),
  },
  {
    title: '¿Qué puede estar exento?',
    body: (
      <>
        La ley contempla exenciones con condiciones específicas. La más conocida: marcar una cuenta
        como exenta para no pagar sobre retiros hasta un tope mensual{EXEMPT_DETAIL}. Hay otras.
        Verifícalas con tu entidad y la normativa vigente.
      </>
    ),
  },
]

const SCOPE = [
  {
    label: 'Lo que calcula esta herramienta',
    tone: 'text-money',
    items: [
      `El ${GMF_LABELS.rate} matemático sobre el monto`,
      'Totales por operación y por mes',
      'Una simulación del tope de cuenta exenta',
    ],
  },
  {
    label: 'Lo que depende de la normativa y tu entidad',
    tone: 'text-accent',
    items: [
      'Si la operación está gravada o exenta',
      'Topes, marcaciones y condiciones',
      'Cómo redondea y liquida cada banco',
    ],
  },
] as const

export function WhySection() {
  return (
    <Section
      id={SECTION_IDS.about}
      eyebrow="03 — Sobre el GMF"
      title="¿Por qué existe el 4x1000?"
      description="Nació en 1998, en plena crisis financiera, como una medida temporal. Se quedó. Esto es lo esencial, sin lenguaje jurídico."
    >
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {EXPLAINERS.map((explainer, index) => (
          <li key={explainer.title}>
            <Reveal delay={index * 0.05} className="h-full">
              <Card className="flex h-full flex-col p-5 sm:p-7">
                <span className="font-mono tabular text-xs text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{explainer.title}</h3>
                {explainer.visual && <div className="mt-4">{explainer.visual}</div>}
                <p className="mt-3 leading-relaxed text-muted">{explainer.body}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-3">
        <div className="grid grid-cols-1 overflow-hidden rounded-card border border-line sm:grid-cols-2">
          {SCOPE.map((column, index) => (
            <div
              key={column.label}
              className={
                index > 0
                  ? 'border-t border-line p-5 sm:border-t-0 sm:border-l sm:p-7'
                  : 'p-5 sm:p-7'
              }
            >
              <h3 className={`eyebrow ${column.tone}`}>{column.label}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] text-fg/90">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
