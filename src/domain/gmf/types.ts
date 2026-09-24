/** ISO calendar date, `YYYY-MM-DD`. Compared lexicographically. */
export type IsoDate = string

export type Currency = 'COP'

/**
 * How the fractional peso is resolved. Kept configurable because financial
 * entities are not uniform in how they liquidate the tax.
 */
export type RoundingMode = 'nearest' | 'up' | 'down'

/** Ids are defined in configuration so new operation kinds need no code change. */
export type TransactionTypeId = string

export interface TransactionTypeRule {
  id: TransactionTypeId
  label: string
  /** Overrides the version rate for this kind of operation, when the law says so. */
  rateOverride?: number
}

/**
 * Monthly exemption for a single account marked as exempt by its holder.
 * The limit is defined in UVT, so its peso value changes every year.
 */
export interface ExemptAccountRule {
  monthlyLimitUvt: number
  uvtValue: number
  legalReference: string
}

export interface GmfRuleVersion {
  id: string
  effectiveFrom: IsoDate
  /** `null` means the version is open-ended (currently in force). */
  effectiveTo: IsoDate | null
  rate: number
  rounding: RoundingMode
  exemptAccount?: ExemptAccountRule
  transactionTypes: readonly TransactionTypeRule[]
}

export interface GmfSource {
  label: string
  url?: string
}

export interface GmfRuleset {
  currency: Currency
  lastUpdated: IsoDate
  sources: readonly GmfSource[]
  versions: readonly GmfRuleVersion[]
}

/** Resolved, ready-to-use rules for one point in time. */
export interface GmfRules {
  versionId: string
  /** True when no version covers the date and the latest expired one was used. */
  isOutdated: boolean
  rate: number
  rounding: RoundingMode
  currency: Currency
  effectiveFrom: IsoDate
  effectiveTo: IsoDate | null
  lastUpdated: IsoDate
  sources: readonly GmfSource[]
  /** Peso value of the monthly exemption, when the version defines one. */
  exemptThreshold?: number
  exemptAccount?: ExemptAccountRule
  transactionTypes: readonly TransactionTypeRule[]
}

export type ExemptionStatus = 'none' | 'exempt-account'

export interface GmfInput {
  amount: number
  transactionType?: TransactionTypeId
  exemptionStatus?: ExemptionStatus
  /**
   * Portion of the monthly exemption still available. Defaults to the full
   * threshold, i.e. treating the operation as the first one of the month.
   */
  exemptAllowanceRemaining?: number
}

export type GmfErrorCode = 'not-a-number' | 'negative' | 'too-large'

export interface GmfError {
  ok: false
  code: GmfErrorCode
}

export interface GmfBreakdown {
  ok: true
  amount: number
  exemptAmount: number
  taxableAmount: number
  gmf: number
  total: number
  appliedRate: number
  /** GMF over the full amount; differs from `appliedRate` when part is exempt. */
  effectiveRate: number
  versionId: string
}

export type GmfResult = GmfBreakdown | GmfError

export interface MonthlyGmfInput {
  amounts: readonly number[]
  transactionType?: TransactionTypeId
  exemptionStatus?: ExemptionStatus
}

export interface MonthlyGmfSummary {
  ok: true
  operations: readonly GmfBreakdown[]
  totalMoved: number
  totalExempt: number
  totalTaxable: number
  totalGmf: number
  /** GMF that would apply if no exemption were considered. */
  gmfWithoutExemption: number
  totalCost: number
  /** Peso limit used for the simulation, or `null` when no exemption applied. */
  exemptThreshold: number | null
}

export type MonthlyGmfResult = MonthlyGmfSummary | GmfError
