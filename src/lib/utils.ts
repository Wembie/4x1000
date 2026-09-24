type ClassValue = string | false | null | undefined

/** Tiny class joiner; the design system avoids conflicting utilities, so no merge step is needed. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function scrollToElement(id: string, options: { focus?: boolean } = {}): void {
  const element = document.getElementById(id)
  if (!element) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  if (options.focus) element.focus({ preventScroll: true })
}
