import { SECTION_IDS } from '@/app/routes'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { MonthlySimulator } from '@/features/gmf/components/MonthlySimulator'

export function MonthlySection() {
  return (
    <Section
      id={SECTION_IDS.monthly}
      eyebrow="04 — Simulador mensual"
      title="¿Cuánto podrías pagar en un mes?"
      description="Una transferencia no duele. Veinte, sí se notan. Pon tus movimientos y nosotros hacemos la cuenta."
    >
      <Reveal>
        <MonthlySimulator />
      </Reveal>
    </Section>
  )
}
