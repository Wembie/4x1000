const LOCALE = 'es-CO'

const copFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const integerFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 2,
})

const decimalFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })

const compactFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 })

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' })

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Colombian usage writes "$1.000.000", not the "$ 1.000.000" ICU produces. */
export function formatCop(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return copFormatter
    .formatToParts(Math.round(value))
    .filter((part) => part.type !== 'literal')
    .map((part) => part.value)
    .join('')
}

/** Digits with thousands separators and no symbol, for editable inputs. */
export function formatDigits(value: number): string {
  return integerFormatter.format(value)
}

export function formatNumber(value: number): string {
  return decimalFormatter.format(value)
}

export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio).replace(/\s/g, '')
}

const COMPACT_UNITS = [
  { threshold: 1_000_000_000, suffix: 'MM' },
  { threshold: 1_000_000, suffix: 'M' },
  { threshold: 1_000, suffix: 'K' },
] as const

/** Short labels for chips: $500K, $1M, $1,5M. */
export function formatCompactCop(value: number): string {
  const unit = COMPACT_UNITS.find(({ threshold }) => Math.abs(value) >= threshold)
  if (!unit) return formatCop(value)
  return `$${compactFormatter.format(value / unit.threshold)}${unit.suffix}`
}

function parseIsoDate(isoDate: string): Date | null {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

/** Accepts `YYYY-MM-DD` and renders it without timezone drift. */
export function formatIsoDate(isoDate: string, style: 'long' | 'short' = 'long'): string {
  const date = parseIsoDate(isoDate)
  if (!date) return isoDate
  return (style === 'long' ? dateFormatter : shortDateFormatter).format(date)
}
