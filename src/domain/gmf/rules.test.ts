import { describe, expect, it } from 'vitest'
import { GMF_CONFIG } from '@/config/gmf.config'
import { getExemptThreshold, GmfRulesError, resolveGmfRules, toIsoDate } from './rules'
import type { GmfRuleset, GmfRuleVersion } from './types'

function version(overrides: Partial<GmfRuleVersion>): GmfRuleVersion {
  return {
    id: 'v',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    rate: 0.004,
    rounding: 'nearest',
    transactionTypes: [{ id: 'general', label: 'General' }],
    ...overrides,
  }
}

function ruleset(versions: GmfRuleVersion[]): GmfRuleset {
  return { currency: 'COP', lastUpdated: '2026-01-01', sources: [], versions }
}

describe('resolveGmfRules', () => {
  const versions = [
    version({ id: '2025', effectiveFrom: '2025-01-01', effectiveTo: '2025-12-31' }),
    version({ id: '2026', effectiveFrom: '2026-01-01', effectiveTo: '2026-12-31', rate: 0.005 }),
  ]

  it('picks the version in force for the date', () => {
    expect(resolveGmfRules(ruleset(versions), '2025-07-15').versionId).toBe('2025')
    expect(resolveGmfRules(ruleset(versions), '2026-07-15')).toMatchObject({
      versionId: '2026',
      rate: 0.005,
      isOutdated: false,
    })
  })

  it('treats both boundaries as inclusive', () => {
    expect(resolveGmfRules(ruleset(versions), '2025-12-31').versionId).toBe('2025')
    expect(resolveGmfRules(ruleset(versions), '2026-01-01').versionId).toBe('2026')
  })

  it('prefers the most recent start when versions overlap', () => {
    const overlapping = [
      version({ id: 'base', effectiveFrom: '2026-01-01' }),
      version({ id: 'correction', effectiveFrom: '2026-03-01' }),
    ]
    expect(resolveGmfRules(ruleset(overlapping), '2026-04-01').versionId).toBe('correction')
  })

  it('falls back to the latest version, flagged, when all have expired', () => {
    expect(resolveGmfRules(ruleset(versions), '2027-02-01')).toMatchObject({
      versionId: '2026',
      isOutdated: true,
    })
  })

  it('throws when no version has started yet', () => {
    expect(() => resolveGmfRules(ruleset(versions), '2020-01-01')).toThrow(GmfRulesError)
  })

  it.each([-0.1, 1, NaN])('rejects an invalid rate %s', (rate) => {
    expect(() => resolveGmfRules(ruleset([version({ rate })]), '2026-01-01')).toThrow(GmfRulesError)
  })

  it('rejects a version that ends before it starts', () => {
    const broken = version({ effectiveFrom: '2026-02-01', effectiveTo: '2026-01-01' })
    expect(() => resolveGmfRules(ruleset([broken]), '2026-01-15')).toThrow(GmfRulesError)
  })

  it('derives the exempt threshold in pesos from UVT', () => {
    const exempt = version({
      exemptAccount: { monthlyLimitUvt: 350, uvtValue: 49_799, legalReference: 'x' },
    })
    expect(resolveGmfRules(ruleset([exempt]), '2026-01-01').exemptThreshold).toBe(17_429_650)
    expect(getExemptThreshold(version({}))).toBeUndefined()
  })
})

describe('GMF_CONFIG', () => {
  it('is valid and resolves for every configured year', () => {
    for (const configured of GMF_CONFIG.versions) {
      const rules = resolveGmfRules(GMF_CONFIG, configured.effectiveFrom)
      expect(rules.versionId).toBe(configured.id)
      expect(rules.rate).toBe(0.004)
    }
  })

  it('has no gaps between consecutive versions', () => {
    const ordered = [...GMF_CONFIG.versions].sort((a, b) =>
      a.effectiveFrom.localeCompare(b.effectiveFrom),
    )
    ordered.slice(1).forEach((current, index) => {
      const previous = ordered[index]
      if (!previous?.effectiveTo) throw new Error('only the last version may be open-ended')
      const dayAfter = new Date(`${previous.effectiveTo}T12:00:00`)
      dayAfter.setDate(dayAfter.getDate() + 1)
      expect(current.effectiveFrom).toBe(toIsoDate(dayAfter))
    })
  })
})

describe('toIsoDate', () => {
  it('formats local calendar dates with padding', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
