import { ArrowUpRight, CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { SECTION_IDS } from '@/app/routes'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { activeGmfRules } from '@/features/gmf/services/rules.service'
import { GMF_LABELS } from '@/features/gmf/utils/labels'

const [primarySource] = activeGmfRules.sources

interface Fact {
  label: string
  value: ReactNode
}

const FACTS: readonly Fact[] = [
  { label: 'Tasa utilizada', value: GMF_LABELS.rate },
  { label: 'Moneda', value: activeGmfRules.currency },
  { label: 'Última actualización', value: GMF_LABELS.lastUpdated },
  {
    label: 'Fuente normativa',
    value: primarySource?.url ? (
      <a
        href={primarySource.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-start gap-1 underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
      >
        {primarySource.label}
        <ArrowUpRight aria-hidden="true" className="mt-1 size-3.5 shrink-0" strokeWidth={2} />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    ) : (
      (primarySource?.label ?? 'Sin fuente configurada')
    ),
  },
]

const validity = GMF_LABELS.effectiveTo
  ? `Del ${GMF_LABELS.effectiveFrom} al ${GMF_LABELS.effectiveTo}`
  : `Desde el ${GMF_LABELS.effectiveFrom}`

export function TransparencySection() {
  return (
    <Section
      id={SECTION_IDS.transparency}
      eyebrow="05 — Transparencia"
      title="Sin letra pequeña."
      description="Todo lo que usa la calculadora, a la vista. Si algo cambia en la ley, cambia aquí primero."
      aside={
        activeGmfRules.isOutdated ? (
          <Badge tone="danger">
            <CircleAlert aria-hidden="true" className="size-3" /> Reglas por revisar
          </Badge>
        ) : (
          <Badge tone="money">Reglas {GMF_LABELS.ruleYear}</Badge>
        )
      }
    >
      <Reveal>
        <dl className="grid grid-cols-1 overflow-hidden rounded-card border border-line sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="border-line p-5 not-first:border-t sm:p-6 sm:even:border-l sm:nth-2:border-t-0 lg:not-first:border-t-0 lg:not-first:border-l"
            >
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="mt-3 tabular text-lg leading-snug font-medium tracking-tight text-fg">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-card border border-line p-5 sm:p-6">
          <p className="eyebrow">Versión de reglas</p>
          <p className="mt-3 font-mono tabular text-sm text-fg">{activeGmfRules.versionId}</p>
          <p className="mt-1 text-sm text-muted">{validity}</p>
          {GMF_LABELS.exemptThreshold && (
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
              Tope de cuenta exenta usado en la simulación:{' '}
              <span className="tabular text-fg">
                {GMF_LABELS.exemptLimitUvt} × {GMF_LABELS.uvtValue} = {GMF_LABELS.exemptThreshold}
              </span>
              {activeGmfRules.exemptAccount && ` (${activeGmfRules.exemptAccount.legalReference}).`}
            </p>
          )}
        </div>

        <figure className="rounded-card border border-accent/20 bg-accent-soft/40 p-5 sm:p-6">
          <blockquote className="text-[0.9375rem] leading-relaxed text-fg/90">
            Esta herramienta es informativa y no reemplaza la liquidación oficial realizada por una
            entidad financiera ni la interpretación profesional de la normativa vigente.
          </blockquote>
          <figcaption className="mt-4 font-mono text-xs leading-relaxed text-muted">
            Información actualizada a: {GMF_LABELS.lastUpdated}
            <br />
            Fuente: {activeGmfRules.sources.map((source) => source.label).join(' · ')}
          </figcaption>
        </figure>
      </Reveal>

      {activeGmfRules.isOutdated && (
        <p role="note" className="mt-3 flex items-start gap-2 text-sm text-[#fca5a5]">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Las reglas configuradas no cubren la fecha de hoy. Se usa la última versión disponible;
          los valores pueden estar desactualizados.
        </p>
      )}
    </Section>
  )
}
