'use client'

import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'

import { NAV_LINKS } from '../data/home-data'

export function SiteNav({
  onLogin,
  onCreateEvent,
}: {
  onLogin: () => void
  onCreateEvent: () => void
}) {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <a href="#top" aria-label="TimTim — início">
          <BrandMark size="md" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onLogin} className="h-10 px-4 text-sm">
            Entrar
          </Button>
          <Button
            variant="outline"
            onClick={onCreateEvent}
            className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary h-10 px-4 text-sm font-medium"
          >
            Criar Evento
          </Button>
        </div>
      </div>
    </header>
  )
}
