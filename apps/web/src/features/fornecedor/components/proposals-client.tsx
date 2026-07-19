'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Archive,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Hourglass,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listMyProposals, type Proposal } from '@/lib/api'
import { cn } from '@/lib/utils'

import { PROPOSAL_FILTERS, PROPOSAL_STATUS_META, type ProposalStatus } from '../data/supplier-data'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

type Row = {
  id: string
  title: string
  client: string
  category: string
  value: string
  sentDate: string
  status: ProposalStatus
}

function formatCurrency(value: string): string {
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function toRow(p: Proposal): Row {
  return {
    id: String(p.id),
    title: p.title,
    client: p.contratante_name,
    category: p.category_name ?? '—',
    value: formatCurrency(p.amount),
    sentDate: new Date(p.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    status: p.status as Row['status'],
  }
}

export function ProposalsClient() {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('todas')
  const [toast, setToast] = useState<string | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listMyProposals()
      .then(setProposals)
      .finally(() => setLoading(false))
  }, [])

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2400)
  }

  const rows = useMemo(() => proposals.map(toRow), [proposals])

  const filtered = useMemo(() => {
    if (filter === 'todas') return rows
    return rows.filter((p) => p.status === filter)
  }, [filter, rows])

  const summary = useMemo(
    () => ({
      total: rows.length,
      accepted: rows.filter((p) => p.status === 'aceita' || p.status === 'contrato').length,
      inReview: rows.filter((p) => p.status === 'analise' || p.status === 'revisao').length,
      finished: rows.filter((p) => p.status === 'finalizada').length,
    }),
    [rows],
  )

  const summaryCards = [
    { icon: FileText, value: summary.total, label: 'Total Enviadas', accent: false },
    { icon: CheckCircle2, value: summary.accepted, label: 'Aceitas', accent: true },
    { icon: Hourglass, value: summary.inReview, label: 'Em Análise', accent: false },
    { icon: Archive, value: summary.finished, label: 'Finalizadas', accent: false },
  ]

  if (loading) {
    return (
      <div className="text-muted-foreground mx-auto max-w-7xl px-6 py-10 text-sm">
        Carregando...
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <SupplierTopbar active="Propostas" onUnavailable={(l) => flash(`${l} em breve`)} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-3 py-1 text-xs font-semibold tracking-wider">
                {'• GESTÃO DE PROPOSTAS •'}
              </span>
              <span className="text-muted-foreground text-sm">Tempo real</span>
            </div>
            <h1 className="font-display text-foreground mt-3 text-4xl font-semibold">
              Suas Propostas
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Acompanhe o status de cada proposta enviada em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => flash('Exportando propostas em CSV...')}
              className="h-11 gap-2 px-4 text-sm"
            >
              <Download className="size-4" />
              Exportar
            </Button>
            <Button
              onClick={() => router.push('/fornecedor')}
              className="h-11 gap-2 px-4 text-sm font-semibold"
            >
              <Plus className="size-4" />
              Nova Proposta
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((c) => (
            <div key={c.label} className="border-border/60 bg-card rounded-xl border p-5">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'grid size-11 place-items-center rounded-lg',
                    c.accent ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground',
                  )}
                >
                  <c.icon className="size-5" />
                </div>
                <div>
                  <p className="font-display text-foreground text-2xl font-semibold">{c.value}</p>
                  <p className="text-muted-foreground text-xs">{c.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="border-border/60 bg-card mt-8 rounded-2xl border">
          {/* Filter row */}
          <div className="border-border/60 flex flex-col gap-4 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {PROPOSAL_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    filter === f.id
                      ? 'border-primary text-foreground border-b-2'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => flash('Ordenação por Data de Envio')}
              className="border-border/60 text-muted-foreground hover:text-foreground flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs transition-colors lg:self-auto"
            >
              Ordenar por: <span className="text-foreground">Data de Envio</span>
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          {/* Column headers */}
          <div className="border-border/60 text-muted-foreground hidden grid-cols-[1.7fr_0.9fr_0.7fr_0.9fr_0.9fr_1.4fr] gap-4 border-b px-6 py-3 text-[0.65rem] font-semibold tracking-widest xl:grid">
            <span>EVENTO / CLIENTE</span>
            <span>CATEGORIA</span>
            <span>VALOR</span>
            <span>ENVIADA EM</span>
            <span>STATUS</span>
            <span className="text-right">AÇÕES</span>
          </div>

          {/* Rows */}
          <div className="divide-border/60 divide-y">
            {filtered.map((p) => (
              <ProposalRow
                key={p.id}
                proposal={p}
                onAction={flash}
                onChat={() => router.push('/fornecedor')}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground px-6 py-12 text-center text-sm">
                Nenhuma proposta neste filtro.
              </p>
            )}
          </div>

          {/* Footer / pagination */}
          <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-xs">
              Exibindo {filtered.length} de {summary.total} propostas
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => flash('Você já está na primeira página')}
                aria-label="Página anterior"
                className="border-border/60 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border transition-colors"
              >
                {'‹'}
              </button>
              <button
                type="button"
                className="border-primary bg-primary/10 text-primary grid size-8 place-items-center rounded-md border text-sm"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => flash('Carregando página 2...')}
                className="border-border/60 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border text-sm transition-colors"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => flash('Carregando página 2...')}
                aria-label="Próxima página"
                className="border-border/60 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-md border transition-colors"
              >
                {'›'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <SupplierFooter />

      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function ProposalRow({
  proposal: p,
  onAction,
  onChat,
}: {
  proposal: Row
  onAction: (msg: string) => void
  onChat: () => void
}) {
  const status = PROPOSAL_STATUS_META[p.status]
  const closed = p.status === 'finalizada' || p.status === 'recusada'

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 px-6 py-4 xl:grid-cols-[1.7fr_0.9fr_0.7fr_0.9fr_0.9fr_1.4fr] xl:items-center',
        closed && 'opacity-60',
      )}
    >
      {/* event / client */}
      <div className="flex items-center gap-3">
        <div className="bg-muted/50 text-muted-foreground grid size-9 shrink-0 place-items-center rounded-lg">
          <FileText className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold">{p.title}</p>
          <p className="text-muted-foreground truncate text-xs">{p.client}</p>
        </div>
      </div>

      {/* category */}
      <div className="text-muted-foreground text-sm">
        <span className="text-muted-foreground/70 text-[0.65rem] font-semibold tracking-widest xl:hidden">
          CATEGORIA:{' '}
        </span>
        {p.category}
      </div>

      {/* value */}
      <div className="text-foreground text-sm font-semibold">{p.value}</div>

      {/* sent date */}
      <div className="text-foreground text-sm">{p.sentDate}</div>

      {/* status */}
      <div>
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider',
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
        {closed ? (
          <>
            <Button
              variant="outline"
              onClick={() => onAction(`Abrindo detalhes de "${p.title}"`)}
              className="text-muted-foreground h-12 gap-1.5 px-3 text-xs sm:h-9"
            >
              Ver Detalhes
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                onAction(
                  p.status === 'recusada'
                    ? `Proposta "${p.title}" removida da lista.`
                    : `Proposta "${p.title}" arquivada.`,
                )
              }
              className="text-muted-foreground h-12 gap-1.5 px-3 text-xs sm:h-9"
            >
              {p.status === 'recusada' ? (
                <Trash2 className="size-3.5" />
              ) : (
                <Archive className="size-3.5" />
              )}
              {p.status === 'recusada' ? 'Remover' : 'Arquivar'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onChat} className="h-12 gap-1.5 px-3 text-xs font-semibold sm:h-9">
              <MessageSquare className="size-3.5" />
              Abrir Conversa
            </Button>
            {p.status === 'revisao' ? (
              <Button
                variant="outline"
                onClick={() => onAction(`Editando proposta "${p.title}"`)}
                className="text-muted-foreground h-12 gap-1.5 px-3 text-xs sm:h-9"
              >
                <Pencil className="size-3.5" />
                Editar
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => onAction(`Abrindo PDF de "${p.title}"`)}
                className="text-muted-foreground h-12 gap-1.5 px-3 text-xs sm:h-9"
              >
                <FileText className="size-3.5" />
                Ver PDF
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
