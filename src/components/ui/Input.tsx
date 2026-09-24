import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '@/lib/utils'

export type InputSize = 'md' | 'lg'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  ref?: Ref<HTMLInputElement>
  fieldSize?: InputSize
  invalid?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

const FIELD_SIZES: Record<InputSize, string> = {
  md: 'h-12 rounded-xl px-3.5 gap-2',
  lg: 'h-[4.5rem] rounded-2xl px-4 gap-2.5 sm:h-20 sm:px-5',
}

const INPUT_SIZES: Record<InputSize, string> = {
  md: 'text-base font-medium',
  lg: 'text-[2rem] font-semibold tracking-[-0.03em] sm:text-[2.5rem]',
}

const PREFIX_SIZES: Record<InputSize, string> = {
  md: 'text-base',
  lg: 'text-2xl sm:text-3xl',
}

/** Field chrome shared by every text input; the focus ring lives on the wrapper. */
export function Input({
  ref,
  fieldSize = 'md',
  invalid = false,
  prefix,
  suffix,
  className,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center border bg-surface-2 transition-[border-color,background-color] duration-150',
        'focus-within:border-accent/70 focus-within:bg-surface-3 hover:border-line-strong',
        invalid ? 'border-danger/70 hover:border-danger/70' : 'border-line',
        FIELD_SIZES[fieldSize],
        className,
      )}
    >
      {prefix && (
        <span aria-hidden="true" className={cn('text-faint select-none', PREFIX_SIZES[fieldSize])}>
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'min-w-0 flex-1 bg-transparent tabular text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none',
          INPUT_SIZES[fieldSize],
        )}
        {...props}
      />
      {suffix}
    </div>
  )
}
