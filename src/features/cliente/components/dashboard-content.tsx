'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Cake,
  Check,
  CheckCircle2,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  PartyPopper,
  SlidersHorizontal,
  Star,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BUDGET,
  EVENT,
  HISTORY,
  PAGE,
  PROPOSALS,
  QUICK_STATS,
} from '../data/dashboard-data'

const META_ICONS = { users: Users, star: Star, check: CheckCircle2 } as const
const QUICK_ICONS = { mail: Mail, 'calendar-check': CalendarCheck } as const
const HISTORY_ICONS = { party: PartyPopper, cake: Cake } as const

export function DashboardContent() {
  const router = useRouter()
  const [filterOpen, setFilterOpen] = useState(false)
  const [proposalsSeen, setProposalsSeen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  function flash(message: string) {
    setFeedback(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(
      () => setFeedback(null),
      2600,
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
              {PAGE.badge}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {PAGE.activity}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
            {PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{PAGE.subtitle}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFilterOpen((v) => !v)
            flash(filterOpen ? 'Filtros limpos' : 'Filtros aplicados')
          }}
          className={cn(
            'h-10 gap-2 px-4 text-sm',
            filterOpen && 'border-primary/50 text-primary',
          )}
        >
          <SlidersHorizontal className="size-4" />
          Filtrar
        </Button>
      </div>

      {/* featured event card */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/40">
        <div className="h-1 w-full bg-primary" />
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.3fr_1fr]">
          {/* left */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip icon={<Star className="size-3.5" />}>{EVENT.type}</Chip>
              <Chip icon={<CalendarDays className="size-3.5" />}>{EVENT.date}</Chip>
              <Chip icon={<MapPin className="size-3.5" />}>{EVENT.location}</Chip>
            </div>

            <p className="mt-6 font-display text-3xl font-semibold text-foreground">
              {EVENT.label}
            </p>
            <button
              type="button"
              onClick={() => router.push('/cliente/eventos/1')}
              className="text-left font-display text-3xl font-semibold text-primary transition-opacity hover:opacity-80"
            >
              {EVENT.name}
            </button>

            <div className="mt-6 flex items-end gap-4">
              <span className="font-display text-7xl font-bold leading-none text-foreground">
                {EVENT.daysLeft}
              </span>
              <span className="mb-2 max-w-[7rem] text-xs font-medium tracking-widest text-muted-foreground">
                DIAS PARA O EVENTO
              </span>
            </div>



            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-5 text-sm text-muted-foreground">
              {EVENT.metaStats.slice(1).map((s) => {
                const Icon = META_ICONS[s.icon as keyof typeof META_ICONS]
                return (
                  <span key={s.label} className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    {s.label}
                  </span>
                )
              })}
            </div>
          </div>

          {/* right */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{PROPOSALS.title}</p>
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  {PROPOSALS.live}
                </span>
              </div>
              <div className="mt-2 flex items-end gap-3">
                <span className="font-display text-5xl font-bold leading-none text-primary">
                  {PROPOSALS.count}
                </span>
              </div>
            </div>



            <Button
              onClick={() => {
                setProposalsSeen(true)
                router.push('/cliente/eventos/1')
              }}
              className="h-13 w-full gap-2 py-4 text-sm font-semibold"
            >
              <Eye className="size-4" />
              {proposalsSeen ? 'Propostas visualizadas' : 'Ver Todas as Propostas'}
            </Button>
          </div>
        </div>
      </section>

      {/* history */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Histórico de Eventos
            </h2>
            <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider text-muted-foreground">
              2 CONCLUÍDOS
            </span>
          </div>
          <button
            type="button"
            onClick={() => flash('Carregando histórico completo...')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Ver todos <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {HISTORY.map((h) => {
            const Icon = HISTORY_ICONS[h.icon as keyof typeof HISTORY_ICONS]
            return (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary/60 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{h.title}</p>
                      <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wider text-primary">
                        {h.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {h.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        {h.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {h.vendors}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => router.push('/cliente/eventos/1')}
                  className="h-10 gap-2 px-3 text-xs"
                >
                  Ver Todas as Propostas
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* feedback toast */}
      {feedback && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/40 bg-popover px-5 py-3 text-sm text-foreground shadow-xl"
        >
          <Check className="size-4 text-primary" strokeWidth={3} />
          {feedback}
        </div>
      )}
    </div>
  )
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  )
}
