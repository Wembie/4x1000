import { GMF_CONFIG } from '@/config/gmf.config'
import { PER_MILLE } from '@/domain/gmf/constants'
import { resolveGmfRules, toIsoDate } from '@/domain/gmf/rules'
import type { GmfRules } from '@/domain/gmf/types'

/**
 * The only bridge between configuration and UI. Resolved once per page load:
 * a static site has no reason to re-evaluate rules mid-session.
 */
export const activeGmfRules: GmfRules = resolveGmfRules(GMF_CONFIG, toIsoDate(new Date()))

/** "4" in "4 × cada $1.000", derived so a rate change updates the copy too. */
export const pesosPerThousand = Math.round(activeGmfRules.rate * PER_MILLE * 100) / 100
