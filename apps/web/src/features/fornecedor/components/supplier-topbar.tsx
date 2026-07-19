'use client'

import { useRouter } from 'next/navigation'

import { Bell } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu'
import { ProfileMenu } from '@/components/layout/profile-menu'
import { cn } from '@/lib/utils'

import { SUPPLIER_MESSAGES, SUPPLIER_NAV, SUPPLIER_USER } from '../data/supplier-data'

import { useSupplierChrome } from './supplier-chrome'

const NAV_ROUTES: Partial<Record<(typeof SUPPLIER_NAV)[number], string>> = {
  Início: '/fornecedor',
  Propostas: '/fornecedor/propostas',
  Contratos: '/fornecedor/contratos',
  Carteira: '/fornecedor/carteira',
  Relatórios: '/fornecedor/relatorios',
  Disputas: '/fornecedor/disputas',
  Mensagens: '/fornecedor/mensagens',
}

export function SupplierTopbar({
  active,
  onUnavailable,
}: {
  active: (typeof SUPPLIER_NAV)[number]
  onUnavailable?: (label: string) => void
}) {
  const router = useRouter()
  const unread = SUPPLIER_MESSAGES.filter((m) => m.unread).length
  const chrome = useSupplierChrome()

  // When rendered inside a different area (e.g. the advisor), use the injected topbar.
  if (chrome?.renderTopbar) {
    return <>{chrome.renderTopbar({ active, onUnavailable })}</>
  }

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <button
          type="button"
          onClick={() => router.push('/fornecedor')}
          aria-label="Ir para o dashboard"
        >
          <BrandMark size="sm" />
        </button>

        <nav className="border-border/60 bg-muted/30 hidden items-center gap-1 rounded-full border p-1 md:flex">
          {SUPPLIER_NAV.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                const route = NAV_ROUTES[item]
                if (route) router.push(route)
                else onUnavailable?.(item)
              }}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                active === item
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MobileNavMenu
            className="md:hidden"
            items={SUPPLIER_NAV.map((item) => ({
              label: item,
              active: item === active,
              onClick: () => {
                const route = NAV_ROUTES[item]
                if (route) router.push(route)
                else onUnavailable?.(item)
              },
            }))}
          />
          <button
            type="button"
            aria-label="Notificações"
            onClick={() => onUnavailable?.('Notificações')}
            className="border-border/60 text-muted-foreground hover:text-foreground relative hidden size-10 place-items-center rounded-full border transition-colors md:grid"
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="bg-primary absolute top-2.5 right-2.5 size-1.5 rounded-full" />
            )}
          </button>
          <ProfileMenu
            name={SUPPLIER_USER.name}
            avatar={SUPPLIER_USER.avatar}
            onItem={(label) => onUnavailable?.(label)}
          />
        </div>
      </div>
    </header>
  )
}

export function SupplierFooter() {
  const chrome = useSupplierChrome()
  if (chrome?.renderFooter) {
    return <>{chrome.renderFooter()}</>
  }

  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showWordmark={false} />
          <span>TimTim · Plataforma de Fornecedores</span>
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
