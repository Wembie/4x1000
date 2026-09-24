import { MAIN_CONTENT_ID } from '@/app/routes'

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition-transform focus-visible:translate-y-0"
    >
      Saltar al contenido
    </a>
  )
}
