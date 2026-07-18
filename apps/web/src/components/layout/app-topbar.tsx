'use client'

import { useRouter } from 'next/navigation'

import { Bell, HelpCircle } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { ProfileMenu } from '@/components/layout/profile-menu'
import { CONTRATANTE_TOPBAR_NAV, CONTRATANTE_USER } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function AppTopbar({ activeLabel = 'Início' }: { activeLabel?: string }) {
  const router = useRouter()

  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur">
      <button
        type="button"
        onClick={() => router.push('/contratante')}
        className="flex items-center gap-2"
      >
        <BrandMark />
      </button>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
        {CONTRATANTE_TOPBAR_NAV.map((link) => {
          const isActive = link.label === activeLabel
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => router.push(link.href)}
              className={cn(
                'relative py-1 text-sm transition-colors',
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
              {isActive && (
                <span className="bg-primary absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificações"
          className="text-muted-foreground hover:text-foreground relative grid size-9 place-items-center rounded-lg transition-colors"
        >
          <Bell className="size-5" />
          <span className="bg-primary absolute top-2 right-2 size-2 rounded-full" />
        </button>
        <button
          type="button"
          aria-label="Ajuda"
          className="text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-lg transition-colors"
        >
          <HelpCircle className="size-5" />
        </button>
        <ProfileMenu
          name={CONTRATANTE_USER.name}
          avatar={CONTRATANTE_USER.avatar}
          subtitle={CONTRATANTE_USER.plan}
        />
      </div>
    </header>
  )
}
