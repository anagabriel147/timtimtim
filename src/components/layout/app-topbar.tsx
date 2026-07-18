'use client'

import { useRouter } from 'next/navigation'
import { Bell, HelpCircle } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { ProfileMenu } from '@/components/layout/profile-menu'
import { CLIENT_TOPBAR_NAV, CLIENT_USER } from '@/config/navigation'
import { cn } from '@/lib/utils'


export function AppTopbar({ activeLabel = 'Início' }: { activeLabel?: string }) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <button type="button" onClick={() => router.push('/cliente')} className="flex items-center gap-2">
        <BrandMark />
      </button>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
        {CLIENT_TOPBAR_NAV.map((link) => {
          const isActive = link.label === activeLabel
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => router.push(link.href)}
              className={cn(
                'relative py-1 text-sm transition-colors',
                isActive ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificações"
          className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          aria-label="Ajuda"
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          <HelpCircle className="size-5" />
        </button>
        <ProfileMenu name={CLIENT_USER.name} avatar={CLIENT_USER.avatar} subtitle={CLIENT_USER.plan} />
      </div>
    </header>
  )
}
