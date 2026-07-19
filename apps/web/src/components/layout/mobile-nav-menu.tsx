'use client'

import { useState } from 'react'

import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'

export type MobileNavItem = {
  label: string
  onClick: () => void
  active?: boolean
}

/**
 * Botão hambúrguer + painel de navegação, pra telas onde a nav horizontal
 * do topbar fica escondida (breakpoint pra cima disso é decidido por quem
 * usa, via `className`, ex. "lg:hidden"). Todos os 6 topbars do app têm
 * essa mesma nav-some-sem-substituto no mobile — este componente é
 * compartilhado entre eles em vez de duplicado.
 */
export function MobileNavMenu({
  items,
  className,
}: {
  items: MobileNavItem[]
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu de navegação"
        aria-haspopup="menu"
        aria-expanded={open}
        className="border-border/60 text-muted-foreground hover:text-foreground grid size-12 place-items-center rounded-full border transition-colors"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Navegação principal"
            className="border-border bg-popover fixed inset-x-4 top-20 z-50 overflow-hidden rounded-2xl border p-2 shadow-xl"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                className={cn(
                  'flex w-full items-center rounded-xl px-4 py-3.5 text-left text-base font-medium transition-colors',
                  item.active ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-secondary',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}
