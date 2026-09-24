import { describe, expect, it } from 'vitest'
import { calculateGmf, calculateMonthlyGmf, validateAmount } from './calculator'
import { MAX_OPERATION_AMOUNT } from './constants'
import { resolveGmfRules } from './rules'
import type { GmfResult, GmfRules, GmfRuleset } from './types'

const RULESET: GmfRuleset = {
  currency: 'COP',
  lastUpdated: '2026-01-01',
  sources: [{ label: 'Test' }],
  versions: [
    {
      id: 'test-v1',
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      rate: 0.004,
      rounding: 'nearest',
      exemptAccount: { monthlyLimitUvt: 350, uvtValue: 50_000, legalReference: 'Test' },
      transactionTypes: [{ id: 'general', label: 'General' }],
    },
  ],
}

const RULES = resolveGmfRules(RULESET, '2026-06-01')
const EXEMPT_LIMIT = 350 * 50_000

function withRules(overrides: Partial<GmfRules>): GmfRules {
  return { ...RULES, ...overrides }
}

function gmfOf(result: GmfResult): number {
  if (!result.ok) throw new Error(`Expected success, got ${result.code}`)
  return result.gmf
}

describe('calculateGmf', () => {
  it.each([
    [1_000, 4],
    [100_000, 400],
    [1_000_000, 4_000],
    [5_000_000, 20_000],
    [10_000_000, 40_000],
  ])('charges 4 per thousand on %i', (amount, expected) => {
    expect(gmfOf(calculateGmf({ amount }, RULES))).toBe(expected)
  })

  it('returns the full breakdown', () => {
    expect(calculateGmf({ amount: 1_000_000 }, RULES)).toEqual({
      ok: true,
      amount: 1_000_000,
      exemptAmount: 0,
      taxableAmount: 1_000_000,
      gmf: 4_000,
      total: 1_004_000,
      appliedRate: 0.004,
      effectiveRate: 0.004,
      versionId: 'test-v1',
    })
  })

  it('handles zero without dividing by zero', () => {
    const result = calculateGmf({ amount: 0 }, RULES)
    expect(result).toMatchObject({ ok: true, gmf: 0, total: 0, effectiveRate: 0 })
  })

  it('rejects negative amounts', () => {
    expect(calculateGmf({ amount: -1 }, RULES)).toEqual({ ok: false, code: 'negative' })
  })

  it.each([NaN, Infinity, -Infinity])('rejects non-finite amount %s', (amount) => {
    expect(calculateGmf({ amount }, RULES)).toEqual({ ok: false, code: 'not-a-number' })
  })

  it('accepts the upper bound and rejects anything above it', () => {
    expect(gmfOf(calculateGmf({ amount: MAX_OPERATION_AMOUNT }, RULES))).toBe(4_000_000_000)
    expect(calculateGmf({ amount: MAX_OPERATION_AMOUNT + 1 }, RULES)).toEqual({
      ok: false,
      code: 'too-large',
    })
  })

  it('keeps large results as exact integers', () => {
    const result = calculateGmf({ amount: 987_654_321_987 }, RULES)
    expect(Number.isInteger(gmfOf(result))).toBe(true)
    expect(gmfOf(result)).toBe(3_950_617_288)
  })

  describe('rounding', () => {
    it('rounds to the nearest peso by default', () => {
      expect(gmfOf(calculateGmf({ amount: 125 }, RULES))).toBe(1) // 0.5
      expect(gmfOf(calculateGmf({ amount: 124 }, RULES))).toBe(0) // 0.496
      expect(gmfOf(calculateGmf({ amount: 1_375 }, RULES))).toBe(6) // 5.5
    })

    it('supports rounding up and down', () => {
      expect(gmfOf(calculateGmf({ amount: 1_001 }, withRules({ rounding: 'up' })))).toBe(5)
      expect(gmfOf(calculateGmf({ amount: 1_249 }, withRules({ rounding: 'down' })))).toBe(4)
    })

    it('does not charge a phantom peso from float noise when rounding up', () => {
      // 1_000 * 0.004 === 4.000000000000001 in IEEE 754
      expect(gmfOf(calculateGmf({ amount: 1_000 }, withRules({ rounding: 'up' })))).toBe(4)
    })

    it('treats fractional pesos as whole pesos', () => {
      expect(calculateGmf({ amount: 999.6 }, RULES)).toMatchObject({ amount: 1_000, gmf: 4 })
    })
  })

  describe('configurable rules', () => {
    it('uses the configured rate', () => {
      expect(gmfOf(calculateGmf({ amount: 1_000_000 }, withRules({ rate: 0.002 })))).toBe(2_000)
    })

    it('applies a transaction type override when defined', () => {
      const rules = withRules({
        transactionTypes: [{ id: 'general', label: 'General', rateOverride: 0 }],
      })
      expect(gmfOf(calculateGmf({ amount: 1_000_000, transactionType: 'general' }, rules))).toBe(0)
    })
  })

  describe('exempt account', () => {
    it('exempts the whole amount below the monthly limit', () => {
      const result = calculateGmf({ amount: 1_000_000, exemptionStatus: 'exempt-account' }, RULES)
      expect(result).toMatchObject({ exemptAmount: 1_000_000, taxableAmount: 0, gmf: 0 })
    })

    it('taxes only the part above the limit', () => {
      const amount = EXEMPT_LIMIT + 1_000_000
      const result = calculateGmf({ amount, exemptionStatus: 'exempt-account' }, RULES)
      expect(result).toMatchObject({ exemptAmount: EXEMPT_LIMIT, gmf: 4_000 })
    })

    it('respects the remaining allowance', () => {
      const result = calculateGmf(
        { amount: 1_000_000, exemptionStatus: 'exempt-account', exemptAllowanceRemaining: 250_000 },
        RULES,
      )
      expect(result).toMatchObject({ exemptAmount: 250_000, gmf: 3_000 })
    })

    it('never exempts a negative allowance', () => {
      const result = calculateGmf(
        { amount: 1_000_000, exemptionStatus: 'exempt-account', exemptAllowanceRemaining: -5 },
        RULES,
      )
      expect(result).toMatchObject({ exemptAmount: 0, gmf: 4_000 })
    })

    it('ignores the status when the rules define no exemption', () => {
      const rulesWithoutExemption: GmfRules = { ...RULES }
      delete rulesWithoutExemption.exemptThreshold
      const result = calculateGmf(
        { amount: 1_000_000, exemptionStatus: 'exempt-account' },
        rulesWithoutExemption,
      )
      expect(gmfOf(result)).toBe(4_000)
    })

    it('reports a lower effective rate', () => {
      const result = calculateGmf(
        { amount: EXEMPT_LIMIT * 2, exemptionStatus: 'exempt-account' },
        RULES,
      )
      expect(result).toMatchObject({ appliedRate: 0.004, effectiveRate: 0.002 })
    })
  })
})

describe('validateAmount', () => {
  it('accepts zero and positive finite numbers', () => {
    expect(validateAmount(0)).toBeNull()
    expect(validateAmount(42)).toBeNull()
  })
})

describe('calculateMonthlyGmf', () => {
  const AMOUNTS = [500_000, 1_200_000, 800_000, 2_000_000]

  it('sums the month', () => {
    expect(calculateMonthlyGmf({ amounts: AMOUNTS }, RULES)).toMatchObject({
      ok: true,
      totalMoved: 4_500_000,
      totalGmf: 18_000,
      gmfWithoutExemption: 18_000,
      totalCost: 4_518_000,
      exemptThreshold: null,
    })
  })

  it('returns zeros for an empty month', () => {
    expect(calculateMonthlyGmf({ amounts: [] }, RULES)).toMatchObject({
      totalMoved: 0,
      totalGmf: 0,
    })
  })

  it('consumes the exemption in order across operations', () => {
    const amounts = [EXEMPT_LIMIT - 1_000_000, 3_000_000, 1_000_000]
    const result = calculateMonthlyGmf({ amounts, exemptionStatus: 'exempt-account' }, RULES)
    if (!result.ok) throw new Error('expected success')

    expect(result.operations.map((operation) => operation.exemptAmount)).toEqual([
      EXEMPT_LIMIT - 1_000_000,
      1_000_000,
      0,
    ])
    expect(result.totalExempt).toBe(EXEMPT_LIMIT)
    expect(result.totalGmf).toBe(8_000 + 4_000)
    expect(result.exemptThreshold).toBe(EXEMPT_LIMIT)
    expect(result.gmfWithoutExemption).toBeGreaterThan(result.totalGmf)
  })

  it('fails as a whole when one operation is invalid', () => {
    expect(calculateMonthlyGmf({ amounts: [1_000, -1] }, RULES)).toEqual({
      ok: false,
      code: 'negative',
    })
  })
})
