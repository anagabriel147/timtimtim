'use client'

import { BrandMark } from '@/components/brand/brand-mark'

export function WizardFooter() {
  return (
    <footer className="border-border/60 border-t px-6 py-6">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs sm:flex-row">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <span>© 2025 — Todos os direitos reservados</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Termos
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Suporte
          </a>
        </nav>
      </div>
    </footer>
  )
}
