'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Plus, Settings, User } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CLIENT_DASHBOARD_NAV, CLIENT_USER } from '@/config/navigation'

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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <BrandMark size="md" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {CLIENT_DASHBOARD_NAV.map((link) => {
            const active = link.label === activeLabel
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => router.push(link.href)}
                className={cn(
                  'relative py-1 text-sm transition-colors',
                  active
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={onNewEvent} className="hidden h-10 gap-2 px-4 text-sm font-medium sm:flex">
            <Plus className="size-4" />
            Novo Evento
          </Button>

          <button
            type="button"
            aria-label="Notificações"
            className="relative grid size-10 place-items-center rounded-lg border border-border bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 py-1 pl-1 pr-2 transition-colors hover:border-primary/40"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Image
                src={CLIENT_USER.avatar || '/placeholder.svg'}
                alt={CLIENT_USER.name}
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <span className="hidden text-left sm:block">
                <span className="block text-[0.65rem] leading-tight text-muted-foreground">Olá,</span>
                <span className="block text-sm font-medium leading-tight text-foreground">
                  {CLIENT_USER.name}
                </span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                  {[
                    { icon: User, label: 'Meu perfil' },
                    { icon: Settings, label: 'Configurações' },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {label}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
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
