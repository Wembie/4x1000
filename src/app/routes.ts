/**
 * Single-page app: "routes" are in-page anchors. Keeping the ids here means
 * navbar, footer and cross-section links cannot drift apart.
 */
export const SECTION_IDS = {
  calculator: 'calculadora',
  breakdown: 'como-funciona',
  examples: 'ejemplos',
  about: 'sobre-el-gmf',
  monthly: 'simulador-mensual',
  transparency: 'transparencia',
} as const

export const AMOUNT_INPUT_ID = 'monto-operacion'

export const MAIN_CONTENT_ID = 'contenido'

export interface NavItem {
  label: string
  href: `#${string}`
}

const anchor = (id: string): `#${string}` => `#${id}`

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Calculadora', href: anchor(SECTION_IDS.calculator) },
  { label: 'Cómo funciona', href: anchor(SECTION_IDS.breakdown) },
  { label: 'Ejemplos', href: anchor(SECTION_IDS.examples) },
  { label: 'Sobre el GMF', href: anchor(SECTION_IDS.about) },
]

export const FOOTER_ITEMS: readonly NavItem[] = [
  { label: 'Calculadora', href: anchor(SECTION_IDS.calculator) },
  { label: 'Cómo funciona', href: anchor(SECTION_IDS.breakdown) },
  { label: 'Simulador mensual', href: anchor(SECTION_IDS.monthly) },
  { label: 'Transparencia', href: anchor(SECTION_IDS.transparency) },
]
