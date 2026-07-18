'use client'

import { useMemo, useState } from 'react'

import {
  Archive,
  Calendar,
  Camera,
  ChevronDown,
  CircleCheck,
  FileSignature,
  FileText,
  Heart,
  Hourglass,
  Info,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  Music4,
  Search,
  Shield,
  Shirt,
  Sparkles,
  Video,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  CONTRACT_FILTERS,
  CONTRACT_STATUS_META,
  CONTRACT_SUMMARY,
  SUPPLIER_CONTRACTS,
  type SupplierContract,
} from '../data/supplier-data'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

const CONTRACT_ICONS = {
  heart: Heart,
  music: Music4,
  camera: Camera,
  video: Video,
  sparkles: Sparkles,
  shirt: Shirt,
} as const

const NOTE_ICONS = {
  lock: Lock,
  check: CircleCheck,
  hourglass: Hourglass,
  x: X,
} as const

const STATUS_MINI = [
  { status: 'quitado' as const, icon: CircleCheck, label: 'Quitados' },
  { status: 'garantido' as const, icon: Lock, label: 'Pag. Garantido' },
  { status: 'aguardando' as const, icon: Hourglass, label: 'Aguardando' },
  { status: 'cancelado' as const, icon: X, label: 'Cancelado' },
]

export function SupplierContractsClient() {
  const s = CONTRACT_SUMMARY
  const [filter, setFilter] = useState<(typeof CONTRACT_FILTERS)[number]['id']>('todos')
  const [query, setQuery] = useState('')
  const [archived, setArchived] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600)
  }

  const visible = useMemo(() => {
    return SUPPLIER_CONTRACTS.filter((c) => {
      if (archived[c.id]) return false
      if (filter !== 'todos' && c.status !== filter) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        return (
          c.title.toLowerCase().includes(q) ||
          c.client.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [filter, query, archived])

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SupplierTopbar active="Contratos" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-4 py-2.5 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="border-primary/40 text-primary rounded-md border px-2.5 py-1 text-[0.65rem] font-semibold tracking-widest">
                • CONTRATOS FECHADOS •
              </span>
              <span className="text-muted-foreground text-sm">{s.period}</span>
            </div>
            <h1 className="font-display text-4xl font-semibold text-balance">Seus Contratos</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Gerencie eventos confirmados e acompanhe pagamentos garantidos em escrow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => flash('Fluxo de novo contrato em breve')}
              className="h-10 gap-2 px-4 text-sm font-semibold"
            >
              <FileSignature className="size-4" />
              Novo Contrato
            </Button>
          </div>
        </div>

        {/* Two big cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Active contracts */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="flex items-start gap-5">
              <div className="bg-primary/10 text-primary grid size-14 shrink-0 place-items-center rounded-xl">
                <FileSignature className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                      CONTRATOS ATIVOS
                    </p>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-foreground text-4xl font-semibold">
                        {s.active}
                      </span>
                      <span className="text-muted-foreground text-sm">de {s.total} totais</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Próximo evento</p>
                    <div className="border-border bg-input mt-1 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5">
                      <Calendar className="text-primary size-3.5" />
                      <span className="text-foreground text-sm font-medium">{s.nextEvent}</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{s.nextEventIn}</p>
                  </div>
                </div>
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="bg-primary size-1.5 rounded-full" />
                    {s.confirmed} confirmados
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-yellow-500" />
                    {s.inProgress} em andamento
                  </span>
                  <span className="font-display text-foreground ml-auto text-lg font-semibold">
                    {s.completionRate}%
                  </span>
                </div>
                <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${s.completedSemester}%` }}
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {s.completedSemester}% dos eventos deste semestre concluídos
                </p>
              </div>
            </div>
          </div>

          {/* Escrow balance */}
          <div className="border-primary/30 bg-primary/5 rounded-2xl border p-6">
            <div className="flex items-start gap-5">
              <div className="bg-primary/15 text-primary grid size-14 shrink-0 place-items-center rounded-xl">
                <Lock className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                    SALDO A LIBERAR
                  </p>
                  <span className="bg-primary/20 text-primary rounded-md px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider">
                    GARANTIDO
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-foreground text-4xl font-semibold">
                      {s.escrowTotal}
                    </p>
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Lock className="text-primary size-3.5" />
                        {s.escrowCustody} em custódia
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LogOut className="text-primary size-3.5" />
                        {s.escrowToRelease} a liberar
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="border-border bg-input rounded-lg border px-3 py-2 text-right">
                      <p className="text-muted-foreground text-[0.65rem]">A receber (30d)</p>
                      <p className="font-display text-primary text-base font-semibold">
                        {s.toReceive30d}
                      </p>
                    </div>
                    <div className="border-border bg-input rounded-lg border px-3 py-2 text-right">
                      <p className="text-muted-foreground text-[0.65rem]">Contratos quitados</p>
                      <p className="font-display text-foreground text-base font-semibold">
                        {s.settled} / {s.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted mt-4 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${s.escrowPercent}%` }}
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {s.escrowPercent}% do valor total já recebido nos contratos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status mini cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_MINI.map(({ status, icon: Icon, label }) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={cn(
                'flex items-center gap-4 rounded-xl border p-5 text-left transition-colors',
                filter === status
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border/60 bg-card hover:border-border',
              )}
            >
              <div
                className={cn(
                  'grid size-11 shrink-0 place-items-center rounded-lg',
                  CONTRACT_STATUS_META[status].className,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-display text-foreground text-2xl font-semibold">
                  {s.counts[status]}
                </p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border-border/60 bg-card mt-6 rounded-2xl border">
          {/* Tabs + search */}
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
            <div className="flex flex-wrap items-center gap-1">
              {CONTRACT_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    filter === f.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                  {filter === f.id && (
                    <span className="bg-primary absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="border-border bg-input flex items-center gap-2 rounded-lg border px-3 py-2">
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
                onClick={() => flash('Ordenar por data do evento')}
                className="border-border bg-input text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
              >
                Data do Evento
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {/* Column header */}
          <div className="border-border/60 text-muted-foreground hidden grid-cols-[1.7fr_1fr_0.8fr_0.9fr_1fr_1.3fr] gap-4 border-b px-5 py-3 text-[0.65rem] font-semibold tracking-widest lg:grid">
            <span>EVENTO / CLIENTE</span>
            <span>DATA &amp; LOCAL</span>
            <span>CATEGORIA</span>
            <span>VALOR</span>
            <span>STATUS</span>
            <span className="text-right">AÇÕES</span>
          </div>

          {/* Rows */}
          <div className="divide-border/50 divide-y">
            {visible.length === 0 ? (
              <p className="text-muted-foreground px-5 py-12 text-center text-sm">
                Nenhum contrato encontrado para este filtro.
              </p>
            ) : (
              visible.map((c) => (
                <ContractRow
                  key={c.id}
                  contract={c}
                  onAction={flash}
                  onArchive={() => setArchived((a) => ({ ...a, [c.id]: true }))}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 px-5 py-4 text-xs">
            <div className="flex items-center gap-4">
              <span>
                Exibindo {visible.length} de {s.total} contratos
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Pag. Garantido
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Quitado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-yellow-500" />
                  Aguardando
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => flash('Página anterior')}
                className="border-border text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border transition-colors"
              >
                {'<'}
              </button>
              <button
                type="button"
                className="border-primary bg-primary/10 text-primary grid size-8 place-items-center rounded-md border"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => flash('Página 2')}
                className="border-border text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border transition-colors"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => flash('Próxima página')}
                className="border-border text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border transition-colors"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>

        {/* Escrow banner */}
        <div className="border-primary/30 bg-primary/5 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/15 text-primary grid size-11 shrink-0 place-items-center rounded-lg">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Pagamento Garantido pelo TimTim</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Os valores retidos ficam protegidos em escrow até a confirmação do evento. Você
                recebe com segurança, sempre.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => flash('Abrindo detalhes sobre o Escrow...')}
            className="h-10 gap-2 px-4 text-sm"
          >
            <Info className="size-4" />
            Saiba mais sobre Escrow
          </Button>
        </div>
      </main>

      <SupplierFooter />
    </div>
  )
}

function ContractRow({
  contract: c,
  onAction,
  onArchive,
}: {
  contract: SupplierContract
  onAction: (msg: string) => void
  onArchive: () => void
}) {
  const Icon = CONTRACT_ICONS[c.icon as keyof typeof CONTRACT_ICONS] ?? FileText
  const meta = CONTRACT_STATUS_META[c.status]
  const NoteIcon = NOTE_ICONS[meta.noteIcon as keyof typeof NOTE_ICONS]
  const cancelled = c.status === 'cancelado'

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[1.7fr_1fr_0.8fr_0.9fr_1fr_1.3fr] lg:items-center',
        cancelled && 'opacity-50',
      )}
    >
      {/* event / client */}
      <div className="flex items-start gap-3">
        <div className="border-border/60 bg-input text-muted-foreground grid size-9 shrink-0 place-items-center rounded-lg border">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-foreground text-sm leading-tight font-semibold text-pretty">
            {c.title}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {c.client} · Contrato {c.code}
          </p>
        </div>
      </div>

      {/* date & location */}
      <div className="text-sm">
        <p className="text-foreground flex items-center gap-1.5 font-medium">
          <Calendar className="text-muted-foreground size-3.5" />
          {c.date}
        </p>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
          <MapPin className="size-3.5" />
          {c.location}
        </p>
      </div>

      {/* category */}
      <p className="text-muted-foreground text-sm">{c.category}</p>

      {/* value */}
      <div>
        <p className="font-display text-foreground text-sm font-semibold">{c.value}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{c.installments}</p>
      </div>

      {/* status */}
      <div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider',
            meta.className,
          )}
        >
          <NoteIcon className="size-3" />
          {meta.label}
        </span>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
        {!cancelled && (
          <Button
            variant="outline"
            onClick={() => onAction(`Abrindo conversa com ${c.client}...`)}
            className="h-8 gap-1.5 px-2.5 text-xs"
          >
            <MessageSquare className="size-3.5" />
            Conversa
          </Button>
        )}
        {cancelled && (
          <Button
            variant="outline"
            onClick={onArchive}
            className="text-muted-foreground h-8 gap-1.5 px-2.5 text-xs"
          >
            <Archive className="size-3.5" />
            Arquivar
          </Button>
        )}
      </div>
    </div>
  )
}
