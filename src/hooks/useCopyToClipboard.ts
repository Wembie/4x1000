import { useCallback, useEffect, useRef, useState } from 'react'

export type CopyStatus = 'idle' | 'copied' | 'error'

const RESET_AFTER_MS = 2000

export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  const copy = useCallback(async (text: string) => {
    window.clearTimeout(timeoutRef.current)
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
    timeoutRef.current = window.setTimeout(() => {
      setStatus('idle')
    }, RESET_AFTER_MS)
  }, [])

  return { status, copy }
}
