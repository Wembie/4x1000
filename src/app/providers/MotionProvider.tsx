import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

// Animation features arrive in a separate chunk after first paint; `strict`
// guarantees nobody imports the heavy `motion.*` components by accident.
const loadFeatures = () => import('./motion-features').then((module) => module.default)

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
