import { CircleAlert, X } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { cn } from '@/lib/utils'

interface AmountFieldProps {
  id: string
  label: string
  hint: string
  value: string
  error: string | null
  onValueChange: (text: string) => void
  onClear: () => void
}

export function AmountField({
  id,
  label,
  hint,
  value,
  error,
  onValueChange,
  onClear,
}: AmountFieldProps) {
  const messageId = `${id}-message`

  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-sm font-medium text-muted">
        {label}
      </label>
      <CurrencyInput
        id={id}
        fieldSize="lg"
        value={value}
        invalid={error !== null}
        describedBy={messageId}
        onValueChange={onValueChange}
        suffix={
          value !== '' && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Limpiar valor"
              className="-mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-fg active:scale-95"
            >
              <X aria-hidden="true" className="size-4.5" strokeWidth={1.75} />
            </button>
          )
        }
      />
      <p
        id={messageId}
        aria-live="polite"
        className={cn(
          'mt-2.5 flex min-h-5 items-center gap-1.5 text-[0.8125rem]',
          error ? 'text-[#fca5a5]' : 'text-faint',
        )}
      >
        {error && <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />}
        {error ?? hint}
      </p>
    </div>
  )
}
