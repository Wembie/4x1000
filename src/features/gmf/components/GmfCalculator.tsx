import { ArrowDown } from 'lucide-react'
import { AMOUNT_INPUT_ID, SECTION_IDS } from '@/app/routes'
import { AmountField } from '@/components/calculator/AmountField'
import { AmountPresets } from '@/components/calculator/AmountPresets'
import { AmountSlider } from '@/components/calculator/AmountSlider'
import { GmfResult } from '@/components/calculator/GmfResult'
import { GmfSummary } from '@/components/calculator/GmfSummary'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CopyButton } from '@/components/ui/CopyButton'
import { CALCULATOR_CONFIG } from '@/config/calculator.config'
import { createLogScale } from '@/lib/scale'
import { cn } from '@/lib/utils'
import { useCalculator } from '../hooks/calculator-context'
import { GMF_LABELS } from '../utils/labels'
import { AMOUNT_ISSUE_MESSAGES } from '../utils/messages'
import { buildSummaryText } from '../utils/summary-text'

const { presets, slider } = CALCULATOR_CONFIG
const sliderScale = createLogScale(slider)

export function GmfCalculator({ className }: { className?: string }) {
  const { inputText, breakdown, issue, setInputText, setAmount, clear } = useCalculator()
  const amount = breakdown?.amount ?? 0

  return (
    <Card className={cn('relative p-4 sm:p-7', className)}>
      <div className="space-y-5">
        <AmountField
          id={AMOUNT_INPUT_ID}
          label="¿Cuánto vas a mover?"
          hint="Valor de la operación"
          value={inputText}
          error={issue && issue !== 'empty' ? AMOUNT_ISSUE_MESSAGES[issue] : null}
          onValueChange={setInputText}
          onClear={clear}
        />
        <AmountPresets
          presets={presets}
          selected={breakdown ? amount : null}
          onSelect={setAmount}
        />
        <AmountSlider
          scale={sliderScale}
          min={slider.min}
          max={slider.max}
          amount={amount}
          onAmountChange={setAmount}
        />
      </div>

      <div className="my-6 border-t border-dashed border-line-strong sm:my-7" />

      <GmfResult
        gmf={breakdown?.gmf ?? null}
        rateLabel={GMF_LABELS.rate}
        perThousandLabel={GMF_LABELS.perThousand}
      />

      <div className="mt-5">
        <GmfSummary breakdown={breakdown} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        <CopyButton
          text={breakdown ? buildSummaryText(breakdown) : ''}
          label="Copiar resultado"
          disabled={!breakdown}
        />
        <ButtonLink href={`#${SECTION_IDS.breakdown}`} variant="ghost" size="sm">
          Ver desglose
          <ArrowDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </ButtonLink>
      </div>
    </Card>
  )
}
