import type { GmfRuleset, TransactionTypeRule } from '@/domain/gmf/types'

/**
 * Single source of truth for GMF rules.
 *
 * To update the legislation, add a new entry to `versions` (do not edit past
 * ones) and bump `lastUpdated`. Components never read these numbers directly;
 * they receive resolved rules through `features/gmf/services`.
 *
 * The UVT peso value changes every year by DIAN resolution, which is why each
 * calendar year gets its own version even while the rate stays at 4x1000.
 * Verify `uvtValue` against the official resolution before publishing.
 */

const TRANSACTION_TYPES: readonly TransactionTypeRule[] = [
  { id: 'general', label: 'Movimiento financiero' },
]

const GMF_RATE = 0.004

const EXEMPT_ACCOUNT_LIMIT_UVT = 350

const EXEMPT_ACCOUNT_REFERENCE = 'Estatuto Tributario, art. 879, num. 1'

export const GMF_CONFIG = {
  currency: 'COP',
  lastUpdated: '2026-09-24',
  sources: [
    {
      label: 'Estatuto Tributario, arts. 871 a 881 (Gravamen a los Movimientos Financieros)',
      url: 'http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario.html',
    },
    {
      label: 'DIAN — valor de la UVT por año',
      url: 'https://www.dian.gov.co',
    },
  ],
  versions: [
    {
      id: 'gmf-2025',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      rate: GMF_RATE,
      rounding: 'nearest',
      exemptAccount: {
        monthlyLimitUvt: EXEMPT_ACCOUNT_LIMIT_UVT,
        uvtValue: 49_799,
        legalReference: EXEMPT_ACCOUNT_REFERENCE,
      },
      transactionTypes: TRANSACTION_TYPES,
    },
    {
      id: 'gmf-2026',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      rate: GMF_RATE,
      rounding: 'nearest',
      exemptAccount: {
        monthlyLimitUvt: EXEMPT_ACCOUNT_LIMIT_UVT,
        uvtValue: 52_374,
        legalReference: EXEMPT_ACCOUNT_REFERENCE,
      },
      transactionTypes: TRANSACTION_TYPES,
    },
  ],
} as const satisfies GmfRuleset
