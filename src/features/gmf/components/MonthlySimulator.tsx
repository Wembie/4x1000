import { Plus, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { operationInputId, useMonthlySimulator } from '../hooks/useMonthlySimulator'
import { GMF_LABELS } from '../utils/labels'
import { MonthlySummary } from './MonthlySummary'
import { OperationRow } from './OperationRow'

const EXEMPTION_SWITCH_ID = 'simular-cuenta-exenta'

export function MonthlySimulator() {
  const simulator = useMonthlySimulator()
  const [focusId, setFocusId] = useState<number | null>(null)

  useEffect(() => {
    if (focusId === null) return
    document.getElementById(operationInputId(focusId))?.focus()
  }, [focusId])

  const exemptionDescription =
    GMF_LABELS.exemptThreshold &&
    `Los primeros ${GMF_LABELS.exemptThreshold} del mes (${GMF_LABELS.exemptLimitUvt ?? ''} en ${GMF_LABELS.ruleYear}) no pagan GMF, en orden de operación. Es una simulación: la exención real depende de marcar la cuenta ante tu entidad.`

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <Card className="p-4 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight">Tus movimientos del mes</h3>
          <Button variant="ghost" size="sm" onClick={simulator.reset}>
            <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            Reiniciar
          </Button>
        </div>

        <ol className="mt-3 divide-y divide-line">
          {simulator.rows.map((row, index) => (
            <OperationRow
              key={row.id}
              row={row}
              position={index + 1}
              canRemove={simulator.rows.length > 1}
              onChange={simulator.updateOperation}
              onRemove={simulator.removeOperation}
            />
          ))}
        </ol>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={!simulator.canAddOperation}
            onClick={() => {
              setFocusId(simulator.addOperation())
            }}
          >
            <Plus aria-hidden="true" className="size-4" strokeWidth={1.75} />
            Agregar operación
          </Button>
          <span className="font-mono tabular text-xs text-faint">
            {simulator.rows.length}/{simulator.maxOperations}
          </span>
        </div>

        {simulator.exemptionAvailable && exemptionDescription && (
          <div className="mt-6 rounded-xl border border-line bg-surface-2/60 p-4">
            <Switch
              id={EXEMPTION_SWITCH_ID}
              checked={simulator.exemptionStatus === 'exempt-account'}
              onCheckedChange={(checked) => {
                simulator.setExemptionStatus(checked ? 'exempt-account' : 'none')
              }}
              label="Simular cuenta marcada como exenta"
              description={exemptionDescription}
            />
          </div>
        )}
      </Card>

      <div className="lg:sticky lg:top-[calc(var(--navbar-height)+1.5rem)]">
        {simulator.summary && <MonthlySummary summary={simulator.summary} />}
      </div>
    </div>
  )
}
