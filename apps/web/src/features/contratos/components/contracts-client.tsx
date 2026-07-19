'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Cake,
  Camera,
  Check,
  ChevronDown,
  FileText,
  Flower2,
  Gift,
  Hourglass,
  Lightbulb,
  Lock,
  MapPin,
  MessageSquare,
  Music4,
  Scale,
  Search,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'

import { AppTopbar } from '@/components/layout/app-topbar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  ESCROW_NOTE,
  FILTERS,
  PAGE,
  PAYMENT_STATUS_META,
  SERVICE_STATUS_META,
  type Contract,
} from '../data/contracts-data'
import { useContracts } from '../store/contracts-store'

const CATEGORY_ICONS = {
  flower: Flower2,
  cake: Cake,
  music: Music4,
  lightbulb: Lightbulb,
  camera: Camera,
  gift: Gift,
  file: FileText,
} as const

const PAYMENT_ICONS = { lock: Lock, check: Check, hourglass: Hourglass, x: X } as const

export function ContractsClient() {
  const router = useRouter()
  const { contracts } = useContracts()
  const [filter, setFilter] = useState<string>('todos')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const flash = (msg: string) => setToast(msg)

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const byStatus = filter === 'todos' || c.paymentStatus === filter
      const q = query.trim().toLowerCase()
      const bySearch =
        q === '' ||
        c.vendor.toLowerCase().includes(q) ||
        c.event.toLowerCase().includes(q) ||
        c.contractCode.toLowerCase().includes(q)
      return byStatus && bySearch
    })
  }, [contracts, filter, query])

  const counts = useMemo(() => {
    const by = (s: string) => contracts.filter((c) => c.paymentStatus === s).length
    return {
      quitado: by('quitado'),
      garantido: by('garantido'),
      aguardando: by('aguardando'),
      cancelado: by('cancelado'),
      active: contracts.filter((c) => c.paymentStatus !== 'cancelado').length,
    }
  }, [contracts])

  return (
    <div className="bg-background min-h-svh">
      <AppTopbar activeLabel="Contratos" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider">
                <span className="bg-primary size-1.5 rounded-full" />
                {PAGE.eyebrow}
              </span>
              <span className="text-muted-foreground text-xs">{PAGE.period}</span>
            </div>
            <h1 className="font-display text-foreground mt-4 text-4xl font-bold tracking-tight">
              {PAGE.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">{PAGE.subtitle}</p>
          </div>
        </div>

        {/* summary cards */}
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="border-border bg-card/40 rounded-2xl border p-6">
            <div className="flex items-start gap-5">
              <span className="bg-secondary/60 text-primary grid size-14 shrink-0 place-items-center rounded-2xl">
                <FileText className="size-6" />
              </span>
              <div className="flex-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-widest">
                  CONTRATOS ATIVOS
                </p>
                <p className="font-display text-foreground mt-1 text-4xl font-bold">
                  {counts.active}{' '}
                  <span className="text-muted-foreground text-lg font-medium">
                    de {contracts.length} totais
                  </span>
                </p>
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {counts.quitado} quitados
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="bg-primary size-1.5 rounded-full" />
                    {counts.garantido} garantidos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    {counts.aguardando} aguardando
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-primary/30 bg-primary/[0.04] rounded-2xl border p-6">
            <div className="flex items-start gap-5">
              <span className="bg-primary/15 text-primary grid size-14 shrink-0 place-items-center rounded-2xl">
                <Lock className="size-6" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-xs font-semibold tracking-widest">
                    VALOR PROTEGIDO
                  </p>
                  <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold">
                    GARANTIDO
                  </span>
                </div>
                <p className="font-display text-foreground mt-1 text-4xl font-bold">R$ 24.320</p>
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  <span>R$ 5.520 em custódia</span>
                  <span>R$ 950 a liberar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* mini status counters */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat
            icon={<Check className="size-4" />}
            tone="emerald"
            value={counts.quitado}
            label="Quitados"
          />
          <MiniStat
            icon={<Lock className="size-4" />}
            tone="primary"
            value={counts.garantido}
            label="Pag. Garantido"
          />
          <MiniStat
            icon={<Hourglass className="size-4" />}
            tone="amber"
            value={counts.aguardando}
            label="Aguardando"
          />
          <MiniStat
            icon={<X className="size-4" />}
            tone="destructive"
            value={counts.cancelado}
            label="Cancelado"
          />
        </section>

        {/* table card */}
        <section className="border-border bg-card/40 mt-6 rounded-2xl border">
          {/* toolbar */}
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
            <div className="flex flex-wrap items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'relative rounded-lg px-3 py-2 text-sm transition-colors',
                    filter === f.key
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                  {filter === f.key && (
                    <span className="bg-primary absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="border-border bg-background/60 flex h-12 items-center gap-2 rounded-lg border px-3 sm:h-9">
                <Search className="text-muted-foreground size-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar contrato..."
                  className="text-foreground placeholder:text-muted-foreground w-40 bg-transparent text-sm outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => flash('Ordenando por data do evento...')}
                className="border-border bg-background/60 text-muted-foreground hover:text-foreground flex h-12 items-center gap-2 rounded-lg border px-3 text-sm transition-colors sm:h-9"
              >
                Data do Evento
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {/* table header */}
          <div className="border-border/60 text-muted-foreground hidden grid-cols-[1.5fr_0.9fr_0.7fr_1.1fr_0.8fr_1.7fr] gap-4 border-b px-5 py-3 text-[0.65rem] font-semibold tracking-widest lg:grid">
            <span>SERVIÇO / EVENTO</span>
            <span>DATA & LOCAL</span>
            <span>VALOR</span>
            <span>PAGAMENTO</span>
            <span>STATUS</span>
            <span className="text-right">AÇÕES</span>
          </div>

          {/* rows */}
          <div className="divide-border/60 divide-y">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground px-5 py-14 text-center text-sm">
                Nenhum contrato encontrado para este filtro.
              </div>
            ) : (
              filtered.map((c) => (
                <ContractRow
                  key={c.id}
                  contract={c}
                  onAction={flash}
                  onChat={() => router.push('/contratante/mensagens')}
                  onDispute={() => router.push('/contratante/disputas/nova')}
                  onOpen={() => router.push(`/contratante/contratos/${c.id}`)}
                  onRate={() => router.push(`/contratante/avaliacoes/${c.id}`)}
                />
              ))
            )}
          </div>

          {/* footer of table */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs">
            <span>
              Exibindo {filtered.length} de {contracts.length} contratos
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="bg-primary size-1.5 rounded-full" /> Pag. Garantido
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Quitado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-400" /> Aguardando
              </span>
            </div>
          </div>
        </section>

        {/* escrow note */}
        <section className="border-primary/25 bg-primary/[0.04] mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-6 py-5">
          <div className="flex items-start gap-4">
            <span className="bg-primary/15 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-foreground font-semibold">{ESCROW_NOTE.title}</p>
              <p className="text-muted-foreground mt-0.5 max-w-2xl text-sm">{ESCROW_NOTE.body}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => flash('Abrindo detalhes sobre o pagamento em escrow...')}
            className="h-10 gap-2 px-4 text-sm"
          >
            <ShieldCheck className="size-4" />
            {ESCROW_NOTE.cta}
          </Button>
        </section>
      </main>

      <footer className="border-border mt-8 border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span>TimTim · Plataforma de Eventos</span>
          <span>Termos · Privacidade · Suporte · © 2025</span>
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
    </div>
  )
}

function MiniStat({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode
  tone: 'emerald' | 'primary' | 'amber' | 'destructive'
  value: number
  label: string
}) {
  const toneMap = {
    emerald: 'bg-emerald-400/10 text-emerald-400',
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-400/10 text-amber-400',
    destructive: 'bg-destructive/10 text-destructive',
  }
  return (
    <div className="border-border bg-card/40 flex items-center gap-4 rounded-2xl border p-5">
      <span className={cn('grid size-11 place-items-center rounded-xl', toneMap[tone])}>
        {icon}
      </span>
      <div>
        <p className="font-display text-foreground text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-xs">{label}</p>
      </div>
    </div>
  )
}

function ContractRow({
  contract: c,
  onAction,
  onChat,
  onDispute,
  onOpen,
  onRate,
}: {
  contract: Contract
  onAction: (msg: string) => void
  onChat: () => void
  onDispute: () => void
  onOpen: () => void
  onRate: () => void
}) {
  const Icon = CATEGORY_ICONS[c.icon as keyof typeof CATEGORY_ICONS] ?? FileText
  const service = SERVICE_STATUS_META[c.serviceStatus]
  const payment = PAYMENT_STATUS_META[c.paymentStatus]
  const PaymentIcon = PAYMENT_ICONS[payment.icon as keyof typeof PAYMENT_ICONS]
  const cancelled = c.paymentStatus === 'cancelado'

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[1.5fr_0.9fr_0.7fr_1.1fr_0.8fr_1.7fr] lg:items-center',
        cancelled && 'opacity-60',
      )}
    >
      {/* vendor / event */}
      <div className="flex items-center gap-3">
        <span className="relative shrink-0">
          <Image
            src={c.avatar || '/placeholder.svg'}
            alt={c.vendor}
            width={44}
            height={44}
            className="size-11 rounded-xl object-cover"
          />
          <span className="bg-card text-primary absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-md">
            <Icon className="size-3" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate font-semibold">{c.vendor}</p>
          <p className="text-muted-foreground truncate text-xs">
            {c.event} · {c.category}
          </p>
          <p className="text-muted-foreground/70 truncate text-xs">Contrato {c.contractCode}</p>
        </div>
      </div>

      {/* date & location */}
      <div className="text-sm">
        <p className="text-foreground font-medium">{c.date}</p>
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <MapPin className="size-3" />
          {c.location}
        </p>
      </div>

      {/* value */}
      <div className="text-sm">
        <p className="font-display text-foreground font-bold">{c.value}</p>
        <p className="text-muted-foreground text-xs">{c.installments}</p>
      </div>

      {/* payment status */}
      <div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold',
            payment.bg,
            payment.text,
          )}
        >
          <PaymentIcon className="size-3" />
          {payment.label}
        </span>
        <p className="text-muted-foreground mt-1 text-xs">{c.receiptLabel}</p>
        <p className="text-muted-foreground/70 text-[0.65rem]">{c.receiptCaption}</p>
      </div>

      {/* service status */}
      <div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            service.bg,
            service.text,
          )}
        >
          <span className={cn('size-1.5 rounded-full', service.dot)} />
          {service.label}
        </span>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
        <Button onClick={onOpen} className="h-12 gap-1.5 px-3 text-xs font-semibold sm:h-9">
          <FileText className="size-3.5" />
          Ver Contrato
        </Button>
        {!cancelled && (
          <Button variant="outline" onClick={onRate} className="h-12 gap-1.5 px-3 text-xs sm:h-9">
            <Star className="size-3.5" />
            Avaliar
          </Button>
        )}

        {!cancelled && (
          <Button variant="outline" onClick={onChat} className="h-12 gap-1.5 px-3 text-xs sm:h-9">
            <MessageSquare className="size-3.5" />
            Conversa
          </Button>
        )}
        {!cancelled && (
          <Button
            variant="outline"
            onClick={onDispute}
            className="h-12 gap-1.5 px-3 text-xs sm:h-9"
          >
            <Scale className="size-3.5" />
            Disputa
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() =>
            cancelled
              ? onAction(`Contrato ${c.contractCode} arquivado.`)
              : onAction(`Abrindo contrato ${c.contractCode} em PDF...`)
          }
          className="text-muted-foreground h-12 gap-1.5 px-3 text-xs sm:h-9"
        >
          <FileText className="size-3.5" />
          {cancelled ? 'Arquivar' : 'Ver PDF'}
        </Button>
      </div>
    </div>
  )
}
