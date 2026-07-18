'use client'

import { useRouter } from 'next/navigation'

import { DashboardNav } from '@/components/layout/dashboard-nav'

import { ExploreLanding } from './explore-landing'

export function ExploreClient() {
  const router = useRouter()

  return (
    <div className="flex min-h-svh flex-col">
      <DashboardNav
        activeLabel="Explorar Fornecedores"
        onNewEvent={() => router.push('/contratante/novo-evento')}
      />
      <ExploreLanding />
      <footer className="border-border/60 border-t px-6 py-5">
        <div className="text-muted-foreground mx-auto flex max-w-7xl items-center justify-between text-xs">
          <span>© 2025 TIMTIM</span>
          <nav className="flex items-center gap-6">
            <button type="button" className="hover:text-foreground transition-colors">
              Termos
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Privacidade
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Contato
            </button>
          </nav>
        </div>
      </footer>
    </div>
  )
}
