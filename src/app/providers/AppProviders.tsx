import type { ReactNode } from 'react'
import { CalculatorProvider } from './CalculatorProvider'
import { MotionProvider } from './MotionProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <CalculatorProvider>{children}</CalculatorProvider>
    </MotionProvider>
  )
}
