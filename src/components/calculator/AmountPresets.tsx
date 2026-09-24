import { formatCompactCop, formatCop } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface AmountPresetsProps {
  presets: readonly number[]
  selected: number | null
  onSelect: (amount: number) => void
}

export function AmountPresets({ presets, selected, onSelect }: AmountPresetsProps) {
  return (
    <div role="group" aria-label="Montos frecuentes" className="grid grid-cols-5 gap-1.5">
      {presets.map((amount) => {
        const active = amount === selected
        return (
          <button
            key={amount}
            type="button"
            aria-pressed={active}
            title={formatCop(amount)}
            onClick={() => {
              onSelect(amount)
            }}
            className={cn(
              'h-9 rounded-lg border tabular text-[0.8125rem] font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-95 sm:h-10 sm:text-sm',
              active
                ? 'border-accent/50 bg-accent-soft text-accent'
                : 'border-line bg-surface-2 text-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {formatCompactCop(amount)}
          </button>
        )
      })}
    </div>
  )
}
