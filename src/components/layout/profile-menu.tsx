'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

import { cn } from '@/lib/utils'

export function ProfileMenu({
  name,
  avatar,
  greeting = 'Olá,',
  subtitle,
  triggerClassName,
  onItem,
}: {
  name: string
  avatar: string
  /** Small label shown above the name (e.g. "Olá,"). Pass null to hide. */
  greeting?: string | null
  /** Optional line shown below the name (e.g. a role or plan). */
  subtitle?: string
  triggerClassName?: string
  /** Called for inert menu items ("Meu perfil", "Configurações"). */
  onItem?: (label: string) => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 rounded-full border border-border/60 py-1 pl-1 pr-3 transition-colors hover:border-border',
          triggerClassName,
        )}
      >
        <Image
          src={avatar || '/placeholder.svg'}
          alt={name}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
        <span className="hidden flex-col items-start leading-tight sm:flex">
          {greeting && (
            <span className="text-[0.65rem] leading-tight text-muted-foreground">{greeting}</span>
          )}
          <span className="text-sm font-medium leading-tight text-foreground">{name}</span>
          {subtitle && (
            <span className="text-[0.65rem] leading-tight text-muted-foreground">{subtitle}</span>
          )}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl">
            {[
              { icon: User, label: 'Meu perfil' },
              { icon: Settings, label: 'Configurações' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setOpen(false)
                  onItem?.(label)
                }}
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
  )
}
