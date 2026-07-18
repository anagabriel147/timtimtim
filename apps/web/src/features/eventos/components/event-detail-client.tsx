'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Coins,
  Hourglass,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  Users,
  Video,
  X,
} from 'lucide-react'

import { AppTopbar } from '@/components/layout/app-topbar'
import { Button } from '@/components/ui/button'
import { useContracts } from '@/features/contratos'
import {
  acceptProposal,
  type Event as ApiEvent,
  getEvent,
  listProposals,
  type Proposal,
  rejectProposal,
} from '@/lib/api'
import { cn } from '@/lib/utils'

import { DISTRIBUTION, QUICK_ACTIONS, STATS, type BudgetRow } from '../data/event-detail-data'

import { PaymentModal, type PendingPayment } from './payment-modal'

function formatCurrency(value: string): string {
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function proposalToRow(p: Proposal): BudgetRow | null {
  if (p.status === 'recusada') return null
  const isContract = p.status === 'contrato' || p.status === 'finalizada'
  return {
    id: String(p.id),
    status: isContract ? 'contratado' : 'disponivel',
    statusLabel: isContract ? 'CONTRATADO · CONFIRMADO' : 'PROPOSTA DISPONÍVEL',
    vendor: p.provider_name,
    avatar: p.provider_avatar ?? '',
    verified: false,
    category: p.title,
    rating: '',
    meta: p.payment_term ?? 'Proposta enviada',
    metrics: [{ label: 'Valor proposto', value: formatCurrency(p.amount), tone: 'primary' }],
    primaryAction: isContract ? undefined : 'Ver Proposta no Chat',
    secondaryActions: isContract ? undefined : ['Aceitar', 'Recusar'],
    contractAction: isContract ? 'Ver Contrato' : undefined,
  }
}

const TONE_TEXT: Record<string, string> = {
  primary: 'text-primary',
  amber: 'text-amber-400',
  blue: 'text-sky-400',
  emerald: 'text-emerald-400',
  muted: 'text-foreground',
}

const TONE_BAR: Record<string, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber-400',
  blue: 'bg-sky-400',
  emerald: 'bg-emerald-400',
  muted: 'bg-muted-foreground/50',
}

const STATUS_ACCENT: Record<string, { dot: string; text: string; border: string; bar: string }> = {
  disponivel: {
    dot: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary/60',
    bar: 'bg-primary',
  },
  aguardando: {
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    border: 'border-border',
    bar: 'bg-amber-400',
  },
  negociacao: {
    dot: 'bg-sky-400',
    text: 'text-sky-400',
    border: 'border-border',
    bar: 'bg-sky-400',
  },
  contratado: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    border: 'border-border',
    bar: 'bg-emerald-400',
  },
}

const QUICK_ICONS = { search: Search, message: MessageSquare } as const

export function EventDetailClient() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const eventId = Number(params.id)
  const { refresh: refreshContracts } = useContracts()
  const [toast, setToast] = useState<string | null>(null)
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null)
  const [apiEvent, setApiEvent] = useState<ApiEvent | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  // per-row local status overrides for interactivity
  const [rowState, setRowState] = useState<Record<string, 'rejected' | 'accepted' | 'reminded'>>({})

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      return
    }
    Promise.all([getEvent(eventId), listProposals(eventId)])
      .then(([fetchedEvent, fetchedProposals]) => {
        setApiEvent(fetchedEvent)
        setProposals(fetchedProposals)
      })
      .finally(() => setLoading(false))
  }, [eventId])

  const flash = (msg: string) => setToast(msg)

  const goChat = () => {
    router.push('/contratante/mensagens')
  }

  if (loading) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-7xl px-6 py-8 text-sm">
        Carregando...
      </div>
    )
  }

  if (!apiEvent) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-7xl px-6 py-8 text-sm">
        Evento não encontrado.
      </div>
    )
  }

  const daysLeft = apiEvent.event_date
    ? Math.max(0, Math.ceil((new Date(apiEvent.event_date).getTime() - Date.now()) / 86_400_000))
    : 0
  const activeProposals = proposals.filter((p) => p.status === 'analise')
  const acceptedProposals = proposals.filter((p) => p.status === 'contrato')

  const EVENT = {
    breadcrumb: ['MEUS EVENTOS', apiEvent.type],
    title: apiEvent.name,
    daysBadge: `${daysLeft} dias restantes`,
    date: apiEvent.event_date
      ? new Date(apiEvent.event_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Data a definir',
    location: [apiEvent.city, apiEvent.country].filter(Boolean).join(', ') || 'Local a definir',
    guests: apiEvent.guests_count ? `${apiEvent.guests_count} convidados` : 'Convidados a definir',
    progress:
      proposals.length > 0 ? Math.round((acceptedProposals.length / proposals.length) * 100) : 0,
    progressLegend: [
      { label: `${acceptedProposals.length} fornecedores confirmados`, tone: 'primary' },
      { label: `${activeProposals.length} propostas em análise`, tone: 'amber' },
    ],
  }

  const BUDGET_ROWS = proposals.map(proposalToRow).filter((r): r is BudgetRow => r !== null)

  const acceptProposalRow = async (proposalId: number) => {
    try {
      await acceptProposal(proposalId)
      refreshContracts()
      setRowState((s) => ({ ...s, [String(proposalId)]: 'accepted' }))
      router.push('/contratante/contratos')
    } catch {
      flash('Não foi possível aceitar a proposta. Tente novamente.')
    }
  }

  return (
    <div className="bg-background min-h-svh">
      <AppTopbar activeLabel="Início" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* header */}
        <nav className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider">
          <span>{EVENT.breadcrumb[0]}</span>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{EVENT.breadcrumb[1]}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-foreground text-4xl font-bold tracking-tight">
                {EVENT.title}
              </h1>
              <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                <span className="bg-primary size-1.5 rounded-full" />
                {EVENT.daysBadge}
              </span>
            </div>
            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <CalendarDays className="text-primary size-4" />
                {EVENT.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="text-primary size-4" />
                {EVENT.location}
              </span>
              <span className="flex items-center gap-2">
                <Users className="text-primary size-4" />
                {EVENT.guests}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => flash('Abrindo edição dos dados do evento...')}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Pencil className="size-4" />
              Editar Dados do Evento
              <ChevronRight className="size-4" />
            </button>
            <Button
              onClick={() => {
                flash('Vamos encontrar um novo fornecedor para o seu evento.')
                router.push('/contratante/fornecedores')
              }}
              className="h-11 gap-2 px-5 text-sm font-semibold"
            >
              <Plus className="size-4" />
              Novo Orçamento
            </Button>
          </div>
        </div>

        {/* progress */}
        <section className="border-border bg-card/40 mt-6 rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-sm font-medium">Progresso do Planejamento</p>
            <span className="font-display text-primary text-lg font-bold">{EVENT.progress}%</span>
          </div>
          <div className="bg-secondary mt-3 h-2 w-full overflow-hidden rounded-full">
            <span
              className="bg-primary block h-full rounded-full"
              style={{ width: `${EVENT.progress}%` }}
            />
          </div>
          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {EVENT.progressLegend.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    l.tone === 'primary' && 'bg-primary',
                    l.tone === 'amber' && 'bg-amber-400',
                    l.tone === 'muted' && 'bg-muted-foreground/50',
                  )}
                />
                {l.label}
              </span>
            ))}
          </div>
        </section>

        {/* stat cards */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<Coins className="size-4" />}
            label={STATS.budget.label}
            value={STATS.budget.value}
            caption={STATS.budget.caption}
          >
            <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground">{STATS.budget.footLabel}</span>
              <span className="text-foreground">
                {STATS.budget.footValue}{' '}
                <span className="text-muted-foreground">{STATS.budget.footPct}</span>
              </span>
            </div>
          </StatCard>

          <StatCard
            icon={<Video className="size-4" />}
            label={STATS.vendors.label}
            value={
              <>
                {STATS.vendors.value}{' '}
                <span className="text-muted-foreground text-2xl">{STATS.vendors.total}</span>
              </>
            }
            caption={STATS.vendors.caption}
          >
            <div className="border-border/60 mt-4 flex items-center gap-4 border-t pt-3 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {STATS.vendors.confirmed}
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-400" />
                {STATS.vendors.pending}
              </span>
            </div>
          </StatCard>

          <StatCard
            icon={<Hourglass className="size-4" />}
            label={STATS.countdown.label}
            value={
              <>
                {STATS.countdown.value}{' '}
                <span className="text-muted-foreground text-2xl">{STATS.countdown.unit}</span>
              </>
            }
            caption={STATS.countdown.caption}
          >
            <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground">{STATS.countdown.footLabel}</span>
              <span className="text-primary">{STATS.countdown.footValue}</span>
            </div>
          </StatCard>
        </section>

        {/* main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* budgets */}
          <div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-foreground text-2xl font-semibold">
                  Status dos Orçamentos
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Acompanhe todas as negociações em tempo real
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => flash('Ordenando orçamentos...')}
                className="h-9 gap-2 px-3 text-xs"
              >
                <SlidersHorizontal className="size-3.5" />
                Filtrar
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {BUDGET_ROWS.map((row) => (
                <BudgetCard
                  key={row.id}
                  row={row}
                  state={rowState[row.id]}
                  onPrimary={() => {
                    if (row.status === 'aguardando') {
                      setRowState((s) => ({ ...s, [row.id]: 'reminded' }))
                      flash(`Lembrete enviado para ${row.vendor}.`)
                    } else {
                      goChat()
                    }
                  }}
                  onSecondary={(action) => {
                    if (action === 'Recusar') {
                      rejectProposal(Number(row.id)).catch(() => {})
                      setRowState((s) => ({ ...s, [row.id]: 'rejected' }))
                      flash(`Proposta de ${row.vendor} recusada.`)
                    } else if (action.startsWith('Aceitar')) {
                      const value = action.replace('Aceitar', '').trim() || row.metrics[0]?.value
                      setPendingPayment({
                        id: row.id,
                        vendor: row.vendor,
                        event: EVENT.title,
                        category: row.category,
                        avatar: row.avatar,
                        value,
                        location: EVENT.location,
                      })
                    } else if (action === 'Abrir Chat') {
                      goChat()
                    } else {
                      flash(`${action}: ${row.vendor}`)
                    }
                  }}
                  onContract={() => flash(`Abrindo contrato de ${row.vendor}...`)}
                />
              ))}
            </div>
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            <div className="border-border bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {DISTRIBUTION.title}
                </h3>
                <span className="bg-secondary/60 text-primary grid size-7 place-items-center rounded-lg">
                  <Coins className="size-4" />
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {DISTRIBUTION.items.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <span className={cn('size-2 rounded-full', TONE_BAR[item.tone])} />
                        {item.label}
                      </span>
                      <span className="text-foreground font-medium">{item.value}</span>
                    </div>
                    <div className="bg-secondary mt-2 h-1.5 w-full overflow-hidden rounded-full">
                      <span
                        className={cn('block h-full rounded-full', TONE_BAR[item.tone])}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">{DISTRIBUTION.remainingLabel}</span>
                <span className="font-display text-primary text-base font-bold">
                  {DISTRIBUTION.remainingValue}
                </span>
              </div>
            </div>

            <div className="border-border bg-card/40 rounded-2xl border p-6">
              <h3 className="font-display text-foreground text-lg font-semibold">Ações Rápidas</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((a) => {
                  const Icon = QUICK_ICONS[a.icon as keyof typeof QUICK_ICONS]
                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => router.push(a.href)}
                      className="border-border bg-background/40 text-foreground hover:border-primary/50 hover:text-primary flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-center text-xs transition-colors"
                    >
                      <Icon className="text-primary size-5" />
                      {a.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="border-border mt-8 border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
              <Bell className="size-3" />
            </span>
            TimTim © 2025 Todos os direitos reservados
          </span>
          <span>Plataforma segura e criptografada · Dados protegidos pelo TimTim</span>
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          className="border-primary/40 bg-popover text-foreground fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-3 text-sm shadow-xl"
        >
          <Check className="text-primary size-4" strokeWidth={3} />
          {toast}
        </div>
      )}

      <PaymentModal
        payment={pendingPayment}
        onClose={() => setPendingPayment(null)}
        onApproved={(p) => {
          setPendingPayment(null)
          acceptProposalRow(Number(p.id))
        }}
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  caption,
  children,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  caption: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-border bg-card/40 rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-semibold tracking-widest">{label}</p>
        <span className="bg-secondary/60 text-primary grid size-8 place-items-center rounded-lg">
          {icon}
        </span>
      </div>
      <p className="font-display text-foreground mt-3 text-4xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-sm">{caption}</p>
      {children}
    </div>
  )
}

function BudgetCard({
  row,
  state,
  onPrimary,
  onSecondary,
  onContract,
}: {
  row: BudgetRow
  state?: 'rejected' | 'accepted' | 'reminded'
  onPrimary: () => void
  onSecondary: (action: string) => void
  onContract: () => void
}) {
  const accent = STATUS_ACCENT[row.status]

  const statusLabel =
    state === 'rejected'
      ? 'PROPOSTA RECUSADA'
      : state === 'accepted'
        ? 'PROPOSTA ACEITA'
        : state === 'reminded'
          ? 'LEMBRETE ENVIADO'
          : row.statusLabel

  return (
    <div className={cn('bg-card/40 overflow-hidden rounded-2xl border', accent.border)}>
      {/* status strip */}
      <div className="border-border/60 flex items-center gap-2 border-b px-5 py-3">
        <span className={cn('size-2 rounded-full', accent.dot)} />
        <span className={cn('text-xs font-semibold tracking-wider', accent.text)}>
          {statusLabel}
        </span>
      </div>

      <div className="p-5">
        {/* vendor row */}
        <div className="flex items-start gap-3">
          <span className="relative">
            <Image
              src={row.avatar || '/placeholder.svg'}
              alt={row.vendor}
              width={48}
              height={48}
              className="size-12 rounded-xl object-cover"
            />
            {row.verified && (
              <BadgeCheck className="bg-card text-primary absolute -right-1 -bottom-1 size-4 rounded-full" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-foreground font-semibold">{row.vendor}</p>
              {row.status === 'disponivel' && (
                <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium">
                  <BadgeCheck className="size-3" />
                  Verificado
                </span>
              )}
              {row.status === 'contratado' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-400">
                  <BadgeCheck className="size-3" />
                  {row.rating}
                </span>
              )}
            </div>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span>{row.category}</span>
              {row.status !== 'contratado' && (
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {row.rating}
                </span>
              )}
              <span className="flex items-center gap-1">
                {row.status === 'negociacao' && (
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                )}
                {row.meta}
              </span>
            </div>
          </div>
        </div>

        {/* metrics */}
        <div
          className={cn(
            'border-border/60 bg-background/40 mt-4 grid gap-4 rounded-xl border p-4',
            row.metrics.length === 3 && 'sm:grid-cols-3',
            row.metrics.length === 2 && 'sm:grid-cols-2',
            row.metrics.length === 1 && 'sm:grid-cols-1',
          )}
        >
          {row.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-muted-foreground text-xs">{m.label}</p>
              <p
                className={cn('font-display mt-1 text-xl font-bold', TONE_TEXT[m.tone ?? 'muted'])}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* actions */}
        {state !== 'rejected' &&
          (row.primaryAction || row.secondaryActions || row.contractAction) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {row.contractAction ? (
                <Button variant="outline" onClick={onContract} className="h-10 gap-2 px-4 text-sm">
                  <Send className="size-4" />
                  {row.contractAction}
                </Button>
              ) : (
                <>
                  {row.primaryAction && (
                    <Button
                      onClick={onPrimary}
                      disabled={state === 'reminded' || state === 'accepted'}
                      className={cn(
                        'h-10 gap-2 px-4 text-sm font-semibold',
                        row.status === 'aguardando' &&
                          'border border-amber-400/60 bg-transparent text-amber-400 hover:bg-amber-400/10',
                      )}
                    >
                      {row.status === 'aguardando' ? (
                        <Send className="size-4" />
                      ) : (
                        <MessageSquare className="size-4" />
                      )}
                      {state === 'reminded' ? 'Lembrete enviado' : row.primaryAction}
                    </Button>
                  )}
                  {row.secondaryActions?.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      onClick={() => onSecondary(action)}
                      disabled={state === 'accepted' && action.startsWith('Aceitar')}
                      className={cn(
                        'h-10 gap-2 px-4 text-sm',
                        action === 'Recusar' && 'text-muted-foreground',
                        action.startsWith('Aceitar') &&
                          'border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10',
                      )}
                    >
                      {action === 'Recusar' && <X className="size-4" />}
                      {action.startsWith('Aceitar') && <Check className="size-4" />}
                      {state === 'accepted' && action.startsWith('Aceitar') ? 'Aceita!' : action}
                    </Button>
                  ))}
                </>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
