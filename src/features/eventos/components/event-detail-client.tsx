'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
import { PaymentModal, type PendingPayment } from './payment-modal'
import { cn } from '@/lib/utils'
import {
  BUDGET_ROWS,
  DISTRIBUTION,
  EVENT,
  QUICK_ACTIONS,
  STATS,
  type BudgetRow,
} from '../data/event-detail-data'

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
  const { addContract } = useContracts()
  const [toast, setToast] = useState<string | null>(null)
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null)
  // per-row local status overrides for interactivity
  const [rowState, setRowState] = useState<Record<string, 'rejected' | 'accepted' | 'reminded'>>({})

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const flash = (msg: string) => setToast(msg)

  const goChat = () => {
    router.push('/cliente/mensagens')
  }

  return (
    <div className="min-h-svh bg-background">
      <AppTopbar activeLabel="Início" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* header */}
        <nav className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
          <span>{EVENT.breadcrumb[0]}</span>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{EVENT.breadcrumb[1]}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                {EVENT.title}
              </h1>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                {EVENT.daysBadge}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                {EVENT.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {EVENT.location}
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                {EVENT.guests}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => flash('Abrindo edição dos dados do evento...')}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="size-4" />
              Editar Dados do Evento
              <ChevronRight className="size-4" />
            </button>
            <Button
              onClick={() => {
                flash('Vamos encontrar um novo fornecedor para o seu evento.')
                router.push('/cliente/fornecedores')
              }}
              className="h-11 gap-2 px-5 text-sm font-semibold"
            >
              <Plus className="size-4" />
              Novo Orçamento
            </Button>
          </div>
        </div>

        {/* progress */}
        <section className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Progresso do Planejamento</p>
            <span className="font-display text-lg font-bold text-primary">{EVENT.progress}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${EVENT.progress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
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
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
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
                <span className="text-2xl text-muted-foreground">{STATS.vendors.total}</span>
              </>
            }
            caption={STATS.vendors.caption}
          >
            <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {STATS.vendors.confirmed}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
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
                <span className="text-2xl text-muted-foreground">{STATS.countdown.unit}</span>
              </>
            }
            caption={STATS.countdown.caption}
          >
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
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
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Status dos Orçamentos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
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
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {DISTRIBUTION.title}
                </h3>
                <span className="grid size-7 place-items-center rounded-lg bg-secondary/60 text-primary">
                  <Coins className="size-4" />
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {DISTRIBUTION.items.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className={cn('size-2 rounded-full', TONE_BAR[item.tone])} />
                        {item.label}
                      </span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <span
                        className={cn('block h-full rounded-full', TONE_BAR[item.tone])}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                <span className="text-muted-foreground">{DISTRIBUTION.remainingLabel}</span>
                <span className="font-display text-base font-bold text-primary">
                  {DISTRIBUTION.remainingValue}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground">Ações Rápidas</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((a) => {
                  const Icon = QUICK_ICONS[a.icon as keyof typeof QUICK_ICONS]
                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => router.push(a.href)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-5 text-center text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Icon className="size-5 text-primary" />
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
      <footer className="mt-8 border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
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
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/40 bg-popover px-5 py-3 text-sm text-foreground shadow-xl"
        >
          <Check className="size-4 text-primary" strokeWidth={3} />
          {toast}
        </div>
      )}

      <PaymentModal
        payment={pendingPayment}
        onClose={() => setPendingPayment(null)}
        onApproved={(p) => {
          setRowState((s) => ({ ...s, [p.id]: 'accepted' }))
          addContract({
            id: p.id,
            vendor: p.vendor,
            event: p.event,
            category: p.category,
            avatar: p.avatar,
            value: p.value,
            location: p.location,
          })
          setPendingPayment(null)
          router.push('/cliente/contratos')
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
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-secondary/60 text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-4xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
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
    <div className={cn('overflow-hidden rounded-2xl border bg-card/40', accent.border)}>
      {/* status strip */}
      <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
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
              <BadgeCheck className="absolute -bottom-1 -right-1 size-4 rounded-full bg-card text-primary" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">{row.vendor}</p>
              {row.status === 'disponivel' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary">
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
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
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
            'mt-4 grid gap-4 rounded-xl border border-border/60 bg-background/40 p-4',
            row.metrics.length === 3 && 'sm:grid-cols-3',
            row.metrics.length === 2 && 'sm:grid-cols-2',
            row.metrics.length === 1 && 'sm:grid-cols-1',
          )}
        >
          {row.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className={cn('mt-1 font-display text-xl font-bold', TONE_TEXT[m.tone ?? 'muted'])}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* actions */}
        {state !== 'rejected' && (row.primaryAction || row.secondaryActions || row.contractAction) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {row.contractAction ? (
              <Button
                variant="outline"
                onClick={onContract}
                className="h-10 gap-2 px-4 text-sm"
              >
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
