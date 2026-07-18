'use client'

import { BrandMark } from '@/components/brand/brand-mark'

export function WizardFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <span>© 2025 — Todos os direitos reservados</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacidade
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Termos
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Suporte
          </a>
        </nav>
      </div>
    </footer>
  )
}
