import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,transform] duration-150 ease-out-soft ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-bg hover:bg-[#ffd43b]',
  secondary: 'border border-line-strong bg-surface-2 text-fg hover:border-faint hover:bg-surface-3',
  ghost: 'text-muted hover:bg-surface-2 hover:text-fg',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
  icon: 'size-10',
}

export function buttonStyles({
  variant = 'secondary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
  className?: string | undefined
} = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}
