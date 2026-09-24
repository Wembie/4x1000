import { Menu, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { NAV_ITEMS } from '@/app/routes'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useCalculator } from '@/features/gmf/hooks/calculator-context'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const NAV_LINK = 'rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-fg'

export function Navbar() {
  const scrolled = useScrolled()
  const { focusCalculator } = useCalculator()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const elevated = scrolled || menuOpen

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
        elevated ? 'border-line bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-(--navbar-height) items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={NAV_LINK}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="primary" size="sm" onClick={focusCalculator}>
            <span className="sm:hidden">Calcular</span>
            <span className="hidden sm:inline">Calcular ahora</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => {
              setMenuOpen((open) => !open)
            }}
          >
            {menuOpen ? (
              <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
            )}
          </Button>
        </div>
      </Container>

      <nav
        id={menuId}
        aria-label="Principal móvil"
        hidden={!menuOpen}
        className="border-t border-line md:hidden"
      >
        <Container>
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex h-12 items-center text-[0.9375rem] text-muted transition-colors hover:text-fg"
                  onClick={() => {
                    setMenuOpen(false)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  )
}
