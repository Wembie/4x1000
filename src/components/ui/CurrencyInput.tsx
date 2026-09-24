import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { caretAfterDigits, countDigitsBefore } from '@/lib/amount-input'
import { Input, type InputSize } from './Input'

interface CurrencyInputProps {
  id: string
  value: string
  onValueChange: (text: string) => void
  fieldSize?: InputSize
  invalid?: boolean
  placeholder?: string
  describedBy?: string
  ariaLabel?: string
  suffix?: ReactNode
  className?: string
}

const GROUP_SEPARATOR = '.'

/**
 * COP amount field. Regrouping thousands on every keystroke normally throws
 * the caret to the end, so the caret is re-anchored to the same digit.
 */
export function CurrencyInput({
  id,
  value,
  onValueChange,
  fieldSize = 'md',
  invalid = false,
  placeholder = '0',
  describedBy,
  ariaLabel,
  suffix,
  className,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingDigits = useRef<number | null>(null)

  useLayoutEffect(() => {
    const input = inputRef.current
    const digits = pendingDigits.current
    pendingDigits.current = null
    if (!input || digits === null || document.activeElement !== input) return
    const caret = caretAfterDigits(value, digits)
    input.setSelectionRange(caret, caret)
  }, [value])

  const emit = (text: string, digitsBeforeCaret: number) => {
    pendingDigits.current = digitsBeforeCaret
    onValueChange(text)
  }

  // Deleting a thousands separator would be undone by regrouping; delete the
  // neighbouring digit instead, which is what the person meant.
  const handleSeparatorDeletion = (event: KeyboardEvent<HTMLInputElement>) => {
    const { selectionStart: start, selectionEnd: end } = event.currentTarget
    if (start === null || start !== end) return

    const isBackspace = event.key === 'Backspace' && value.charAt(start - 1) === GROUP_SEPARATOR
    const isDelete = event.key === 'Delete' && value.charAt(start) === GROUP_SEPARATOR
    if (!isBackspace && !isDelete) return

    event.preventDefault()
    const digitIndex = isBackspace ? start - 2 : start + 1
    const next = value.slice(0, digitIndex) + value.slice(digitIndex + 1)
    emit(next, countDigitsBefore(value, isBackspace ? digitIndex : start))
  }

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      enterKeyHint="done"
      prefix="$"
      suffix={suffix}
      fieldSize={fieldSize}
      invalid={invalid}
      placeholder={placeholder}
      value={value}
      aria-describedby={describedBy}
      aria-label={ariaLabel}
      {...(className && { className })}
      onKeyDown={handleSeparatorDeletion}
      onChange={(event) => {
        const { value: text, selectionStart } = event.target
        emit(text, countDigitsBefore(text, selectionStart ?? text.length))
      }}
    />
  )
}
