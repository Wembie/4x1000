import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  id: string
}

export function Switch({ checked, onCheckedChange, label, description, id }: SwitchProps) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-fg">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="mt-1 text-[0.8125rem] leading-snug text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        onClick={() => {
          onCheckedChange(!checked)
        }}
        className={cn(
          'relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-200',
          checked ? 'border-money/40 bg-money' : 'border-line-strong bg-surface-3',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'size-4 rounded-full shadow transition-transform duration-200 ease-out-soft',
            checked ? 'translate-x-[1.1875rem] bg-bg' : 'translate-x-[0.1875rem] bg-fg',
          )}
        />
      </button>
    </div>
  )
}
