import { DEFAULT_TRANSACTION_TYPE, MAX_OPERATION_AMOUNT, MIN_OPERATION_AMOUNT } from './constants'
import { getRateFor } from './rules'
import type {
  GmfBreakdown,
  GmfError,
  GmfErrorCode,
  GmfInput,
  GmfResult,
  GmfRules,
  MonthlyGmfInput,
  MonthlyGmfResult,
  RoundingMode,
} from './types'

const ROUNDERS: Record<RoundingMode, (value: number) => number> = {
  nearest: Math.round,
  up: Math.ceil,
  down: Math.floor,
}

// Binary floats turn 1_000 * 0.004 into 4.000000000000001; snapping to a
// micro-peso grid first keeps "up" rounding from charging a phantom peso.
const FLOAT_NOISE_SCALE = 1e6

function roundPesos(value: number, mode: RoundingMode): number {
  const snapped = Math.round(value * FLOAT_NOISE_SCALE) / FLOAT_NOISE_SCALE
  return ROUNDERS[mode](snapped)
}

function fail(code: GmfErrorCode): GmfError {
  return { ok: false, code }
}

export function validateAmount(amount: number): GmfErrorCode | null {
  if (!Number.isFinite(amount)) return 'not-a-number'
  if (amount < MIN_OPERATION_AMOUNT) return 'negative'
  if (amount > MAX_OPERATION_AMOUNT) return 'too-large'
  return null
}

function resolveExemptAmount(input: GmfInput, amount: number, rules: GmfRules): number {
  if (input.exemptionStatus !== 'exempt-account' || rules.exemptThreshold === undefined) return 0
  const allowance = input.exemptAllowanceRemaining ?? rules.exemptThreshold
  return Math.min(amount, Math.max(0, allowance))
}

/**
 * Mathematical GMF for one operation under the given rules. Amounts are whole
 * pesos: COP movements do not carry cents in practice.
 */
export function calculateGmf(input: GmfInput, rules: GmfRules): GmfResult {
  const error = validateAmount(input.amount)
  if (error) return fail(error)

  const amount = Math.round(input.amount)
  const rate = getRateFor(rules, input.transactionType ?? DEFAULT_TRANSACTION_TYPE)
  const exemptAmount = resolveExemptAmount(input, amount, rules)
  const taxableAmount = amount - exemptAmount
  const gmf = roundPesos(taxableAmount * rate, rules.rounding)

  return {
    ok: true,
    amount,
    exemptAmount,
    taxableAmount,
    gmf,
    total: amount + gmf,
    appliedRate: rate,
    effectiveRate: amount === 0 ? 0 : gmf / amount,
    versionId: rules.versionId,
  }
}

function sumBy<T>(items: readonly T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0)
}

/**
 * Operations are applied in order, so the exemption is consumed by the first
 * movements of the month, the way an exempt account behaves at the bank.
 */
export function calculateMonthlyGmf(input: MonthlyGmfInput, rules: GmfRules): MonthlyGmfResult {
  const transactionType = input.transactionType ?? DEFAULT_TRANSACTION_TYPE
  const exemptionStatus = input.exemptionStatus ?? 'none'
  const operations: GmfBreakdown[] = []
  let allowance = rules.exemptThreshold ?? 0
  let gmfWithoutExemption = 0

  for (const amount of input.amounts) {
    const result = calculateGmf(
      { amount, transactionType, exemptionStatus, exemptAllowanceRemaining: allowance },
      rules,
    )
    if (!result.ok) return result

    const fullyTaxed = calculateGmf({ amount, transactionType }, rules)
    if (fullyTaxed.ok) gmfWithoutExemption += fullyTaxed.gmf

    allowance -= result.exemptAmount
    operations.push(result)
  }

  const appliesExemption = exemptionStatus === 'exempt-account'

  return {
    ok: true,
    operations,
    totalMoved: sumBy(operations, (operation) => operation.amount),
    totalExempt: sumBy(operations, (operation) => operation.exemptAmount),
    totalTaxable: sumBy(operations, (operation) => operation.taxableAmount),
    totalGmf: sumBy(operations, (operation) => operation.gmf),
    gmfWithoutExemption,
    totalCost: sumBy(operations, (operation) => operation.total),
    exemptThreshold: appliesExemption ? (rules.exemptThreshold ?? null) : null,
  }
}
