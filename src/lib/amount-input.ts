import { formatDigits } from './formatters'

export type ParsedAmount =
  { kind: 'empty' } | { kind: 'invalid' } | { kind: 'value'; value: number }

// Beyond this the number stops being exact; the domain rejects it as too large anyway.
const MAX_INPUT_DIGITS = 15

const ALLOWED_CHARACTERS = /^[\d\s.,$]*$/
const NON_DIGITS = /\D/g

/**
 * Reads what a person types or pastes: "1.000.000", "$ 250 000", "1000000,50".
 * The comma is the decimal separator in Colombia; cents are dropped because
 * COP movements are whole pesos.
 */
export function parseAmountInput(text: string): ParsedAmount {
  const trimmed = text.trim()
  if (trimmed === '' || trimmed === '$') return { kind: 'empty' }
  if (!ALLOWED_CHARACTERS.test(trimmed)) return { kind: 'invalid' }

  const [integerPart = ''] = trimmed.split(',')
  const digits = integerPart.replace(NON_DIGITS, '').replace(/^0+(?=\d)/, '')
  if (digits === '') return { kind: 'invalid' }

  return { kind: 'value', value: Number(digits.slice(0, MAX_INPUT_DIGITS)) }
}

export function countDigitsBefore(text: string, caret: number): number {
  return text.slice(0, caret).replace(NON_DIGITS, '').length
}

/**
 * Where the caret belongs after reformatting, so typing in the middle of
 * "1.000.000" does not throw the cursor to the end.
 */
export function caretAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0
  let seen = 0
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted.charAt(index))) seen += 1
    if (seen === digitCount) return index + 1
  }
  return formatted.length
}

/** Regroups valid input ("1000000" → "1.000.000"); leaves anything else untouched for feedback. */
export function normalizeAmountText(text: string): string {
  const parsed = parseAmountInput(text)
  return parsed.kind === 'value' ? formatDigits(parsed.value) : text
}
