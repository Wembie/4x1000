import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import {
  operationInputId,
  type OperationRow as OperationRowState,
} from '../hooks/useMonthlySimulator'
import { AMOUNT_ISSUE_MESSAGES } from '../utils/messages'

interface OperationRowProps {
  row: OperationRowState
  position: number
  canRemove: boolean
  onChange: (id: number, text: string) => void
  onRemove: (id: number) => void
}

export function OperationRow({ row, position, canRemove, onChange, onRemove }: OperationRowProps) {
  const inputId = operationInputId(row.id)
  const errorId = `${inputId}-error`
  const label = `Operación ${String(position)}`

  return (
    <li className="py-2">
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:gap-3">
        <label htmlFor={inputId} className="tabular text-[0.8125rem] text-muted">
          {/* Phones only have room for the index; assistive tech always hears the full label. */}
          <span aria-hidden="true" className="font-mono text-faint sm:hidden">
            {String(position).padStart(2, '0')}
          </span>
          <span className="max-sm:sr-only">{label}</span>
        </label>
        <CurrencyInput
          id={inputId}
          value={row.text}
          invalid={row.issue !== null}
          placeholder="0"
          onValueChange={(text) => {
            onChange(row.id, text)
          }}
          {...(row.issue && { describedBy: errorId })}
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Quitar ${label.toLowerCase()}`}
          disabled={!canRemove}
          onClick={() => {
            onRemove(row.id)
          }}
        >
          <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </Button>
      </div>
      {row.issue && (
        <p
          id={errorId}
          className="mt-1.5 text-[0.8125rem] text-[#fca5a5] max-sm:pl-10 sm:pl-[7.25rem]"
        >
          {AMOUNT_ISSUE_MESSAGES[row.issue]}
        </p>
      )}
    </li>
  )
}
