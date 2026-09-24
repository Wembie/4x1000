import { Info } from 'lucide-react'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatCop } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface GmfResultProps {
  gmf: number | null
  rateLabel: string
  perThousandLabel: string
}

/** The number people came for. Stays in place (dimmed) while the input is invalid. */
export function GmfResult({ gmf, rateLabel, perThousandLabel }: GmfResultProps) {
  return (
    <div aria-live="polite" aria-atomic="true">
      <div className="flex items-center gap-1.5">
        <p className="eyebrow text-fg/80">Tu GMF · 4×1000</p>
        <Tooltip
          label="Qué incluye este valor"
          content={
            <>
              Es el {rateLabel} matemático del valor de la operación ({perThousandLabel}). Si la
              operación está exenta, el cobro real puede ser menor o cero.
            </>
          }
        >
          <Info aria-hidden="true" className="size-3.5" strokeWidth={2} />
        </Tooltip>
      </div>
      <p
        className={cn(
          'mt-2 tabular text-display font-semibold transition-opacity duration-200',
          gmf === null && 'opacity-30',
        )}
      >
        <AnimatedNumber value={gmf ?? 0} format={formatCop} />
      </p>
    </div>
  )
}
