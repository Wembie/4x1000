/** "Por mil": the 4x1000 name expresses the rate per thousand pesos. */
export const PER_MILLE = 1000

/**
 * Upper bound for a single operation. Far above any real transfer, it exists
 * only to keep arithmetic well inside the safe integer range.
 */
export const MAX_OPERATION_AMOUNT = 1_000_000_000_000

export const MIN_OPERATION_AMOUNT = 0

export const DEFAULT_TRANSACTION_TYPE = 'general' as const
