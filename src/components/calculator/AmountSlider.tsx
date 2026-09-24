import { Slider } from '@/components/ui/Slider'
import type { LogScale } from '@/lib/scale'
import { formatCompactCop, formatCop } from '@/lib/formatters'

interface AmountSliderProps {
  scale: LogScale
  min: number
  max: number
  amount: number
  onAmountChange: (amount: number) => void
}

export function AmountSlider({ scale, min, max, amount, onAmountChange }: AmountSliderProps) {
  return (
    <div>
      <Slider
        label="Ajustar valor de la operación"
        value={scale.toPosition(amount)}
        max={scale.steps}
        valueText={formatCop(amount)}
        onValueChange={(position) => {
          onAmountChange(scale.toAmount(position))
        }}
      />
      <div
        aria-hidden="true"
        className="mt-1.5 flex justify-between font-mono tabular text-[0.6875rem] text-faint"
      >
        <span>{formatCompactCop(min)}</span>
        <span>{formatCompactCop(max)}</span>
      </div>
    </div>
  )
}
