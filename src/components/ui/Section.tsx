import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './Container'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  /** Mono label with an index, e.g. "02 — Cómo funciona". */
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
}: SectionProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('border-t border-line py-20 sm:py-28', className)}
    >
      <Container>
        <Reveal className="mb-10 grid grid-cols-1 gap-6 sm:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 eyebrow">{eyebrow}</p>
            <h2
              id={headingId}
              className="text-[2rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {description}
              </p>
            )}
          </div>
          {aside}
        </Reveal>
        {children}
      </Container>
    </section>
  )
}
