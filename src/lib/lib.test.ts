import { describe, expect, it } from 'vitest'
import { caretAfterDigits, countDigitsBefore, parseAmountInput } from './amount-input'
import {
  formatCompactCop,
  formatCop,
  formatDigits,
  formatIsoDate,
  formatPercent,
} from './formatters'
import { createLogScale, roundToSignificant } from './scale'

describe('formatCop', () => {
  it.each([
    [1_000_000, '$1.000.000'],
    [4_000, '$4.000'],
    [0, '$0'],
    [1_004_000, '$1.004.000'],
    [-1_500, '-$1.500'],
    [3_984.6, '$3.985'],
  ])('formats %d as %s', (value, expected) => {
    expect(formatCop(value)).toBe(expected)
  })

  it.each([NaN, Infinity])('never prints %s', (value) => {
    expect(formatCop(value)).toBe('—')
  })
})

describe('other formatters', () => {
  it('formats digits, percent, compact and dates', () => {
    expect(formatDigits(1_234_567)).toBe('1.234.567')
    expect(formatPercent(0.004)).toBe('0,4%')
    expect(formatCompactCop(100_000)).toBe('$100K')
    expect(formatCompactCop(1_000_000)).toBe('$1M')
    expect(formatCompactCop(1_500_000)).toBe('$1,5M')
    expect(formatCompactCop(500)).toBe('$500')
    expect(formatIsoDate('2026-09-24')).toBe('24 de septiembre de 2026')
    expect(formatIsoDate('not-a-date')).toBe('not-a-date')
  })
})

describe('parseAmountInput', () => {
  it.each([
    ['1.000.000', 1_000_000],
    ['$ 250 000', 250_000],
    ['1000000,50', 1_000_000],
    ['0', 0],
    ['0005', 5],
  ])('reads %s', (text, value) => {
    expect(parseAmountInput(text)).toEqual({ kind: 'value', value })
  })

  it.each(['', '   ', '$'])('treats %j as empty', (text) => {
    expect(parseAmountInput(text)).toEqual({ kind: 'empty' })
  })

  it.each(['abc', '12a', '-500', '1e6', ',50'])('rejects %j', (text) => {
    expect(parseAmountInput(text)).toEqual({ kind: 'invalid' })
  })

  it('caps absurdly long input instead of losing precision', () => {
    const parsed = parseAmountInput('9'.repeat(30))
    expect(parsed.kind === 'value' && Number.isSafeInteger(parsed.value)).toBe(true)
  })
})

describe('caret helpers', () => {
  it('keeps the caret next to the same digit after regrouping', () => {
    const digits = countDigitsBefore('1000000', 4)
    expect(digits).toBe(4)
    expect(caretAfterDigits('1.000.000', digits)).toBe(5)
    expect(caretAfterDigits('1.000.000', 0)).toBe(0)
    expect(caretAfterDigits('1.000', 99)).toBe(5)
  })
})

describe('log scale', () => {
  const scale = createLogScale({ min: 10_000, max: 50_000_000, steps: 200, significantDigits: 3 })

  it('maps the ends of the track to the bounds', () => {
    expect(scale.toAmount(0)).toBe(10_000)
    expect(scale.toAmount(200)).toBe(50_000_000)
    expect(scale.toPosition(0)).toBe(0)
    expect(scale.toPosition(90_000_000)).toBe(200)
  })

  it('produces clean amounts', () => {
    expect(roundToSignificant(1_234_567, 3)).toBe(1_230_000)
    expect(roundToSignificant(0, 3)).toBe(0)
  })

  it('is strictly increasing and round-trips every step, so keyboard nudges never get stuck', () => {
    for (let position = 0; position < scale.steps; position += 1) {
      const amount = scale.toAmount(position)
      expect(scale.toAmount(position + 1)).toBeGreaterThan(amount)
      expect(scale.toPosition(amount)).toBe(position)
    }
  })
})
