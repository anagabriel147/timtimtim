'use client'

import { useRouter } from 'next/navigation'

import { Bell } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu'
import { ProfileMenu } from '@/components/layout/profile-menu'
import type { SupplierNavItem } from '@/features/fornecedor'
import { cn } from '@/lib/utils'

import { ADVISOR_NAV, ADVISOR_USER, type AdvisorNavItem } from '../data/advisor-data'

import { ADVISOR_SUPPLIER_ROUTES } from './advisor-supplier-chrome'

const NAV_ROUTES: Partial<Record<AdvisorNavItem, string>> = {
  Início: '/assessor',
  Afiliados: '/assessor/indicacoes',
  Mensagens: '/assessor/mensagens',
}

// Supplier feature tabs surfaced inside the advisor menu
const SUPPLIER_TABS: SupplierNavItem[] = [
  'Propostas',
  'Contratos',
  'Carteira',
  'Relatórios',
  'Disputas',
]

export function AdvisorTopbar({
  active,
  onUnavailable,
}: {
  active?: AdvisorNavItem
  onUnavailable?: (label: string) => void
}) {
  const router = useRouter()

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <button type="button" onClick={() => router.push('/assessor')} aria-label="Ir para a home">
          <BrandMark size="sm" />
        </button>

        <nav className="border-border/60 bg-muted/30 hidden items-center gap-1 rounded-full border p-1 lg:flex">
          {ADVISOR_NAV.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                const route = NAV_ROUTES[item]
                if (route) router.push(route)
                else onUnavailable?.(item)
              }}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                active === item
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item}
            </button>
          ))}

          {SUPPLIER_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                const route = ADVISOR_SUPPLIER_ROUTES[item]
                if (route) router.push(route)
                else onUnavailable?.(item)
              }}
              className="text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MobileNavMenu
            className="lg:hidden"
            items={[
              ...ADVISOR_NAV.map((item) => ({
                label: item,
                active: item === active,
                onClick: () => {
                  const route = NAV_ROUTES[item]
                  if (route) router.push(route)
                  else onUnavailable?.(item)
                },
              })),
              ...SUPPLIER_TABS.map((item) => ({
                label: item,
                onClick: () => {
                  const route = ADVISOR_SUPPLIER_ROUTES[item]
                  if (route) router.push(route)
                  else onUnavailable?.(item)
                },
              })),
            ]}
          />
          <button
            type="button"
            aria-label="Notificações"
            onClick={() => onUnavailable?.('Notificações')}
            className="border-border/60 text-muted-foreground hover:text-foreground relative hidden size-10 place-items-center rounded-full border transition-colors lg:grid"
          >
            <Bell className="size-4" />
            <span className="bg-primary absolute top-2.5 right-2.5 size-1.5 rounded-full" />
          </button>
          <ProfileMenu
            name={ADVISOR_USER.name}
            avatar={ADVISOR_USER.avatar}
            onItem={(label) => onUnavailable?.(label)}
          />
        </div>
      </div>
    </header>
  )
}

export function AdvisorFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showWordmark={false} />
          <span>TimTim · Plataforma de Assessores</span>
        </div>
        <div className="flex items-center gap-5">
          <span>Termos</span>
          <span>Privacidade</span>
          <span>Suporte</span>
          <span>© 2025</span>
        </div>
      </div>
    </footer>
  )
}
