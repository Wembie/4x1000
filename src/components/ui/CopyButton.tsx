import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard, type CopyStatus } from '@/hooks/useCopyToClipboard'
import { Button } from './Button'

const LABELS: Record<CopyStatus, string> = {
  idle: 'Copiar',
  copied: 'Copiado',
  error: 'No se pudo copiar',
}

interface CopyButtonProps {
  text: string
  label?: string
  disabled?: boolean
}

export function CopyButton({ text, label = LABELS.idle, disabled = false }: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard()
  const Icon = status === 'copied' ? Check : Copy

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => void copy(text)}
        className={status === 'copied' ? 'text-money hover:text-money' : undefined}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        {status === 'idle' ? label : LABELS[status]}
      </Button>
      <span role="status" className="sr-only">
        {status === 'idle' ? '' : LABELS[status]}
      </span>
    </>
  )
}
