'use client'

import { useRouter } from 'next/navigation'

import { Bell, Terminal } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { ProfileMenu } from '@/components/layout/profile-menu'
import { cn } from '@/lib/utils'

import { ADMIN_NAV, ADMIN_USER, type AdminNavItem } from '../data/admin-data'

const NAV_ROUTES: Partial<Record<AdminNavItem, string>> = {
  'Visão Geral': '/admin',
}

export function AdminTopbar({
  active,
  onUnavailable,
}: {
  active: AdminNavItem
  onUnavailable?: (label: string) => void
}) {
  const router = useRouter()

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/admin')} aria-label="Ir para a home">
            <BrandMark size="sm" />
          </button>
          <span className="border-primary/40 bg-primary/10 text-primary hidden rounded-md border px-2 py-1 text-[0.65rem] font-semibold tracking-widest uppercase sm:inline">
            Admin Master
          </span>
        </div>

        <nav className="border-border/60 bg-muted/30 hidden items-center gap-1 rounded-full border p-1 lg:flex">
          {ADMIN_NAV.map((item) => (
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
          <button
            type="button"
            aria-label="Notificações"
            onClick={() => onUnavailable?.('Notificações')}
            className="border-border/60 text-muted-foreground hover:text-foreground relative grid size-10 place-items-center rounded-full border transition-colors"
          >
            <Bell className="size-4" />
            <span className="bg-destructive absolute top-2.5 right-2.5 size-1.5 rounded-full" />
          </button>
          <button
            type="button"
            aria-label="Console"
            onClick={() => onUnavailable?.('Console de comandos')}
            className="border-border/60 text-muted-foreground hover:text-foreground grid size-10 place-items-center rounded-full border transition-colors"
          >
            <Terminal className="size-4" />
          </button>
          <ProfileMenu
            name={ADMIN_USER.name}
            avatar={ADMIN_USER.avatar}
            greeting={null}
            subtitle={ADMIN_USER.role}
            onItem={(label) => onUnavailable?.(label)}
          />
        </div>
      </div>
    </header>
  )
}

export function AdminFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showWordmark={false} />
          <span>TimTim · Painel Master Admin</span>
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
