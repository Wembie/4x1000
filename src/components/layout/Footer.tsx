import { FOOTER_ITEMS } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { SITE_CONFIG } from '@/config/site.config'
import { GithubMark } from './GithubMark'
import { Logo } from './Logo'

const LINK = 'inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg'

export function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <Container className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Una herramienta educativa para entender el GMF en Colombia.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-1 sm:text-right">
            {FOOTER_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={LINK}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE_CONFIG.repositoryUrl} className={LINK} rel="noreferrer" target="_blank">
                <GithubMark className="size-3.5" />
                GitHub
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </nav>

        <p className="font-mono text-xs text-faint sm:col-span-2">
          © {SITE_CONFIG.copyrightYear} {SITE_CONFIG.name}
        </p>
      </Container>
    </footer>
  )
}
