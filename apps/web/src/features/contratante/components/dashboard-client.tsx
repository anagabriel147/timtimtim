'use client'

import { useRouter } from 'next/navigation'

import { BrandMark } from '@/components/brand/brand-mark'
import { DashboardNav } from '@/components/layout/dashboard-nav'

import { DashboardContent } from './dashboard-content'

export function DashboardClient() {
  const router = useRouter()

  return (
    <div className="flex min-h-svh flex-col">
      <DashboardNav onNewEvent={() => router.push('/contratante/novo-evento')} />

      <main className="flex-1">
        <DashboardContent />
      </main>

      <footer className="border-border/60 border-t px-6 py-6">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs sm:flex-row">
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
    </div>
  )
}
