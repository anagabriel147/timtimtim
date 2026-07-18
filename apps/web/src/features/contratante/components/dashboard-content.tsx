'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Eye,
  MapPin,
  PartyPopper,
  SlidersHorizontal,
  Star,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Contract, type Event, listContracts, listEvents, listProposals } from '@/lib/api'
import { cn } from '@/lib/utils'

import { PAGE } from '../data/dashboard-data'

const META_ICONS = { star: Star, check: CheckCircle2 } as const

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Data a definir'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function DashboardContent() {
  const router = useRouter()
  const [filterOpen, setFilterOpen] = useState(false)
  const [proposalsSeen, setProposalsSeen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [proposalsCount, setProposalsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listEvents(), listContracts()])
      .then(async ([fetchedEvents, fetchedContracts]) => {
        setEvents(fetchedEvents)
        setContracts(fetchedContracts)

        const upcoming = fetchedEvents
          .filter((e) => e.event_date && new Date(e.event_date).getTime() >= Date.now())
          .sort((a, b) => new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime())
        const featuredEvent = upcoming[0] ?? fetchedEvents[0] ?? null
        if (featuredEvent) {
          const proposals = await listProposals(featuredEvent.id).catch(() => [])
          setProposalsCount(proposals.length)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function flash(message: string) {
    setFeedback(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setFeedback(null), 2600)
  }

  if (loading) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-7xl px-6 py-8 text-sm">
        Carregando...
      </div>
    )
  }

  const upcoming = events
    .filter((e) => e.event_date && new Date(e.event_date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime())
  const featured = upcoming[0] ?? events[0] ?? null
  const history = events.filter((e) => e.id !== featured?.id)
  const contractsForFeatured = featured ? contracts.filter((c) => c.event_id === featured.id) : []

  const EVENT = featured
    ? {
        type: featured.type.charAt(0).toUpperCase() + featured.type.slice(1),
        date: formatDate(featured.event_date),
        location: [featured.city, featured.country].filter(Boolean).join(', ') || 'Local a definir',
        label: 'Meu Evento',
        name: featured.name,
        daysLeft: daysUntil(featured.event_date) ?? 0,
        metaStats: [
          { icon: 'star', label: `${featured.service_categories.length} categorias solicitadas` },
          { icon: 'check', label: `${contractsForFeatured.length} contratos assinados` },
        ],
      }
    : null

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="border-primary/40 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
              {PAGE.badge}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="bg-primary size-1.5 rounded-full" />
              {PAGE.activity}
            </span>
          </div>
          <h1 className="font-display text-foreground mt-3 text-3xl font-semibold tracking-tight">
            {PAGE.title}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{PAGE.subtitle}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFilterOpen((v) => !v)
            flash(filterOpen ? 'Filtros limpos' : 'Filtros aplicados')
          }}
          className={cn('h-10 gap-2 px-4 text-sm', filterOpen && 'border-primary/50 text-primary')}
        >
          <SlidersHorizontal className="size-4" />
          Filtrar
        </Button>
      </div>

      {!EVENT && (
        <section className="border-border bg-card/40 mt-6 rounded-3xl border p-10 text-center">
          <p className="text-foreground font-display text-xl font-semibold">
            Você ainda não tem nenhum evento
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Crie o seu primeiro evento para começar a receber propostas de fornecedores.
          </p>
          <Button
            onClick={() => router.push('/contratante/novo-evento')}
            className="mt-6 h-11 gap-2 px-5 text-sm font-semibold"
          >
            Criar Meu Primeiro Evento
          </Button>
        </section>
      )}

      {/* featured event card */}
      {EVENT && (
        <section className="border-border bg-card/40 mt-6 overflow-hidden rounded-3xl border">
          <div className="bg-primary h-1 w-full" />
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.3fr_1fr]">
            {/* left */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Chip icon={<Star className="size-3.5" />}>{EVENT.type}</Chip>
                <Chip icon={<CalendarDays className="size-3.5" />}>{EVENT.date}</Chip>
                <Chip icon={<MapPin className="size-3.5" />}>{EVENT.location}</Chip>
              </div>

              <p className="font-display text-foreground mt-6 text-3xl font-semibold">
                {EVENT.label}
              </p>
              <button
                type="button"
                onClick={() => router.push(`/contratante/eventos/${featured!.id}`)}
                className="font-display text-primary text-left text-3xl font-semibold transition-opacity hover:opacity-80"
              >
                {EVENT.name}
              </button>

              <div className="mt-6 flex items-end gap-4">
                <span className="font-display text-foreground text-7xl leading-none font-bold">
                  {EVENT.daysLeft}
                </span>
                <span className="text-muted-foreground mb-2 max-w-[7rem] text-xs font-medium tracking-widest">
                  DIAS PARA O EVENTO
                </span>
              </div>

              <div className="border-border/60 text-muted-foreground mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 text-sm">
                {EVENT.metaStats.map((s) => {
                  const Icon = META_ICONS[s.icon as keyof typeof META_ICONS]
                  return (
                    <span key={s.label} className="flex items-center gap-2">
                      <Icon className="text-primary size-4" />
                      {s.label}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* right */}
            <div className="space-y-4">
              <div className="border-border/70 bg-background/40 rounded-2xl border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-foreground text-sm font-medium">Propostas Recebidas</p>
                  <span className="text-primary flex items-center gap-1.5 text-xs">
                    <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                    Ao vivo
                  </span>
                </div>
                <div className="mt-2 flex items-end gap-3">
                  <span className="font-display text-primary text-5xl leading-none font-bold">
                    {proposalsCount}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setProposalsSeen(true)
                  router.push(`/contratante/eventos/${featured!.id}`)
                }}
                className="h-13 w-full gap-2 py-4 text-sm font-semibold"
              >
                <Eye className="size-4" />
                {proposalsSeen ? 'Propostas visualizadas' : 'Ver Todas as Propostas'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* history */}
      {history.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-foreground text-xl font-semibold">
                Histórico de Eventos
              </h2>
              <span className="border-border bg-secondary/40 text-muted-foreground rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider">
                {history.length} {history.length === 1 ? 'EVENTO' : 'EVENTOS'}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {history.map((h) => {
              const contractsForEvent = contracts.filter((c) => c.event_id === h.id)
              const Icon = PartyPopper
              return (
                <div
                  key={h.id}
                  className="border-border bg-card/40 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-secondary/60 text-primary grid size-12 shrink-0 place-items-center rounded-xl">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">{h.name}</p>
                      </div>
                      <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {h.city ?? 'Local não informado'}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {formatDate(h.event_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {contractsForEvent.length} fornecedores
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/contratante/eventos/${h.id}`)}
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
      )}

      {/* feedback toast */}
      {feedback && (
        <div
          role="status"
          className="border-primary/40 bg-popover text-foreground fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-3 text-sm shadow-xl"
        >
          <Check className="text-primary size-4" strokeWidth={3} />
          {feedback}
        </div>
      )}
    </div>
  )
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="border-border bg-secondary/40 text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  )
}
