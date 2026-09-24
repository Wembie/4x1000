import { PER_MILLE } from '@/domain/gmf/constants'
import { formatCop, formatIsoDate, formatNumber, formatPercent } from '@/lib/formatters'
import { activeGmfRules, pesosPerThousand } from '../services/rules.service'

/**
 * Human-readable versions of the active rules. Copy across the site reads
 * from here so a rate or UVT update never leaves a stale number in a sentence.
 */
export const GMF_LABELS = {
  rate: formatPercent(activeGmfRules.rate),
  pesosPerThousand: formatCop(pesosPerThousand),
  perThousand: `${formatNumber(pesosPerThousand)} × cada ${formatCop(PER_MILLE)}`,
  lastUpdated: formatIsoDate(activeGmfRules.lastUpdated),
  lastUpdatedShort: formatIsoDate(activeGmfRules.lastUpdated, 'short'),
  effectiveFrom: formatIsoDate(activeGmfRules.effectiveFrom),
  effectiveTo: activeGmfRules.effectiveTo ? formatIsoDate(activeGmfRules.effectiveTo) : null,
  exemptThreshold:
    activeGmfRules.exemptThreshold === undefined ? null : formatCop(activeGmfRules.exemptThreshold),
  exemptLimitUvt: activeGmfRules.exemptAccount
    ? `${formatNumber(activeGmfRules.exemptAccount.monthlyLimitUvt)} UVT`
    : null,
  uvtValue: activeGmfRules.exemptAccount ? formatCop(activeGmfRules.exemptAccount.uvtValue) : null,
  ruleYear: activeGmfRules.effectiveFrom.slice(0, 4),
} as const
