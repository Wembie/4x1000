import { SECTION_IDS } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { GmfCalculator } from '@/features/gmf/components/GmfCalculator'
import { PER_MILLE } from '@/domain/gmf/constants'
import { GMF_LABELS } from '@/features/gmf/utils/labels'
import { formatCop } from '@/lib/formatters'
import { HeroBackdrop } from './HeroBackdrop'

const HERO_TITLE_ID = 'hero-title'

const TICKER = [
  { label: 'Tasa', value: GMF_LABELS.rate },
  { label: `Por cada ${formatCop(PER_MILLE)}`, value: GMF_LABELS.pesosPerThousand },
  { label: 'Información a', value: GMF_LABELS.lastUpdatedShort },
] as const

export function HeroSection() {
  return (
    <section id={SECTION_IDS.calculator} aria-labelledby={HERO_TITLE_ID} className="relative">
      <HeroBackdrop />

      <Container className="relative grid grid-cols-1 gap-8 pt-8 pb-16 sm:pt-14 sm:pb-24 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-16 lg:pt-20 lg:pb-32">
        <div className="lg:pt-10">
          <p className="flex items-center gap-2 eyebrow">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-money" />
            GMF · Colombia · {GMF_LABELS.ruleYear}
          </p>

          <h1 id={HERO_TITLE_ID} className="mt-5 sm:mt-7">
            <span className="block tabular text-hero font-semibold">
              4<span className="mx-[0.04em] font-normal text-accent">×</span>1000
            </span>
            <span className="mt-4 block text-[1.625rem] leading-tight font-medium tracking-[-0.03em] sm:mt-6 sm:text-4xl">
              Entiende cuánto pagas.
            </span>
          </h1>

          <p className="mt-3 max-w-sm text-base leading-relaxed text-muted sm:mt-4 sm:text-lg">
            Calcula el GMF de una operación antes de mover tu dinero.
          </p>

          <dl className="mt-12 hidden max-w-lg grid-cols-3 border-y border-line sm:grid">
            {TICKER.map((item, index) => (
              <div
                key={item.label}
                className={index > 0 ? 'border-l border-line py-4 pl-4' : 'py-4 pr-4'}
              >
                <dt className="eyebrow text-[0.625rem]">{item.label}</dt>
                <dd className="mt-1.5 tabular text-sm font-medium text-fg">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <GmfCalculator />
      </Container>
    </section>
  )
}
