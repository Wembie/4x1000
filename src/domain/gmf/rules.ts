import type { GmfRules, GmfRuleset, GmfRuleVersion, IsoDate, TransactionTypeId } from './types'

export class GmfRulesError extends Error {
  override name = 'GmfRulesError'
}

export function toIsoDate(date: Date): IsoDate {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isInForce(version: GmfRuleVersion, date: IsoDate): boolean {
  const started = version.effectiveFrom <= date
  const notEnded = version.effectiveTo === null || date <= version.effectiveTo
  return started && notEnded
}

function assertValidVersion(version: GmfRuleVersion): void {
  if (!Number.isFinite(version.rate) || version.rate < 0 || version.rate >= 1) {
    throw new GmfRulesError(`Rule version "${version.id}" has an invalid rate: ${version.rate}`)
  }
  if (version.effectiveTo !== null && version.effectiveTo < version.effectiveFrom) {
    throw new GmfRulesError(`Rule version "${version.id}" ends before it starts`)
  }
}

export function getExemptThreshold(
  version: Pick<GmfRuleVersion, 'exemptAccount'>,
): number | undefined {
  const exempt = version.exemptAccount
  if (!exempt) return undefined
  return Math.round(exempt.monthlyLimitUvt * exempt.uvtValue)
}

function latestFirst(versions: readonly GmfRuleVersion[]): GmfRuleVersion[] {
  return [...versions].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))
}

/**
 * Picks the version in force on `date`. When versions overlap, the one that
 * started most recently wins, so a correction can be published without
 * editing the previous entry.
 *
 * If every version has expired (the config was not updated for a new year),
 * the latest one is used and flagged as outdated instead of failing: a
 * static site cannot be hot-fixed, and a warning beats a blank page.
 */
export function resolveGmfRules(ruleset: GmfRuleset, date: IsoDate): GmfRules {
  ruleset.versions.forEach(assertValidVersion)

  const ordered = latestFirst(ruleset.versions)
  const inForce = ordered.find((candidate) => isInForce(candidate, date))
  const version = inForce ?? ordered.find((candidate) => candidate.effectiveFrom <= date)

  if (!version) {
    throw new GmfRulesError(`No GMF rule version covers ${date}`)
  }

  const exemptThreshold = getExemptThreshold(version)

  return {
    versionId: version.id,
    isOutdated: !inForce,
    rate: version.rate,
    rounding: version.rounding,
    currency: ruleset.currency,
    effectiveFrom: version.effectiveFrom,
    effectiveTo: version.effectiveTo,
    lastUpdated: ruleset.lastUpdated,
    sources: ruleset.sources,
    transactionTypes: version.transactionTypes,
    ...(exemptThreshold !== undefined && { exemptThreshold }),
    ...(version.exemptAccount && { exemptAccount: version.exemptAccount }),
  }
}

export function getRateFor(rules: GmfRules, transactionType: TransactionTypeId): number {
  const typeRule = rules.transactionTypes.find((type) => type.id === transactionType)
  return typeRule?.rateOverride ?? rules.rate
}
