'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Bell, ChevronDown, LogOut, Plus, Settings, User } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu'
import { Button } from '@/components/ui/button'
import { CONTRATANTE_DASHBOARD_NAV, CONTRATANTE_USER } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function DashboardNav({
  onNewEvent,
  activeLabel = 'Início',
}: {
  onNewEvent: () => void
  activeLabel?: string
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <BrandMark size="md" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {CONTRATANTE_DASHBOARD_NAV.map((link) => {
            const active = link.label === activeLabel
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => router.push(link.href)}
                className={cn(
                  'relative py-1 text-sm transition-colors',
                  active
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                {active && (
                  <span className="bg-primary absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <MobileNavMenu
            className="lg:hidden"
            items={CONTRATANTE_DASHBOARD_NAV.map((link) => ({
              label: link.label,
              onClick: () => router.push(link.href),
              active: link.label === activeLabel,
            }))}
          />

          <Button onClick={onNewEvent} className="h-12 gap-2 px-4 text-sm font-medium sm:h-10">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Novo Evento</span>
          </Button>

          <button
            type="button"
            aria-label="Notificações"
            className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground relative hidden size-10 place-items-center rounded-lg border transition-colors sm:grid"
          >
            <Bell className="size-4" />
            <span className="bg-primary absolute top-2.5 right-2.5 size-1.5 rounded-full" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="border-border bg-secondary/40 hover:border-primary/40 flex items-center gap-2 rounded-full border py-1 pr-2 pl-1 transition-colors"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Image
                src={CONTRATANTE_USER.avatar || '/placeholder.svg'}
                alt={CONTRATANTE_USER.name}
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <span className="hidden text-left sm:block">
                <span className="text-muted-foreground block text-[0.65rem] leading-tight">
                  Olá,
                </span>
                <span className="text-foreground block text-sm leading-tight font-medium">
                  {CONTRATANTE_USER.name}
                </span>
              </span>
              <ChevronDown className="text-muted-foreground size-4" />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="border-border bg-popover absolute top-12 right-0 z-50 w-52 overflow-hidden rounded-xl border p-1.5 shadow-xl">
                  {[
                    { icon: User, label: 'Meu perfil' },
                    { icon: Settings, label: 'Configurações' },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="text-foreground hover:bg-secondary flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Icon className="text-muted-foreground size-4" />
                      {label}
                    </button>
                  ))}
                  <div className="bg-border my-1 h-px" />
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                  >
                    <LogOut className="size-4" />
                    Terminar sessão
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
