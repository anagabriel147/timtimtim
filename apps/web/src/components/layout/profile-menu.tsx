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
          'border-border/60 hover:border-border flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 transition-colors',
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
            <span className="text-muted-foreground text-[0.65rem] leading-tight">{greeting}</span>
          )}
          <span className="text-foreground text-sm leading-tight font-medium">{name}</span>
          {subtitle && (
            <span className="text-muted-foreground text-[0.65rem] leading-tight">{subtitle}</span>
          )}
        </span>
        <ChevronDown className="text-muted-foreground size-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-border bg-popover absolute top-12 right-0 z-50 w-52 overflow-hidden rounded-xl border p-1.5 shadow-xl">
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
  )
}
