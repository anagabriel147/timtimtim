'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Camera,
  CircleCheck,
  Copy,
  Disc3,
  Download,
  Flower2,
  Hourglass,
  MessageCircle,
  Music4,
  Share2,
  Ticket,
  TrendingUp,
  Utensils,
  Wallet,
  Wine,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  type CommissionMonth,
  type Payout,
  type Referral,
  type ReferralSummary,
  type TopVendor,
  getCommissionTrend,
  getReferralSummary,
  listAssessorPayouts,
  listReferrals,
  listTopProviders,
  requestAssessorPayout,
} from '@/lib/api'
import { cn } from '@/lib/utils'

import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'

const VENDOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Bar de Coquetéis': Wine,
  'Buffet / Gastronomia': Utensils,
  'DJs & Sonorização': Disc3,
  'Decoração & Cenografia': Flower2,
  'Fotografia & Filme': Camera,
  'Banda / Música ao Vivo': Music4,
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  confirmada: { label: 'CONFIRMADA', className: 'border-primary/40 bg-primary/10 text-primary' },
  paga: { label: 'PAGA', className: 'border-primary/40 bg-primary/10 text-primary' },
  pendente: {
    label: 'PENDENTE',
    className: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
  },
}

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'pendente', label: 'Pendentes' },
  { id: 'paga', label: 'Pagas' },
] as const

const chartConfig: ChartConfig = {
  total: { label: 'Comissões', color: 'var(--chart-1)' },
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function monthLabel(month: string): string {
  const [, m] = month.split('-')
  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return names[Number(m) - 1] ?? month
}

export function ReferralsClient() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [summary, setSummary] = useState<ReferralSummary | null>(null)
  const [topVendors, setTopVendors] = useState<TopVendor[]>([])
  const [trend, setTrend] = useState<CommissionMonth[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('todas')
  const [copied, setCopied] = useState(false)
  const [payoutOpen, setPayoutOpen] = useState(false)
  const [pixKey, setPixKey] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      listReferrals(),
      getReferralSummary(),
      listTopProviders(),
      getCommissionTrend(),
      listAssessorPayouts(),
    ])
      .then(([r, s, tv, t, p]) => {
        setReferrals(r)
        setSummary(s)
        setTopVendors(tv)
        setTrend(t)
        setPayouts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600)
  }

  const filtered = useMemo(() => {
    if (filter === 'todas') return referrals
    return referrals.filter((r) => r.status === filter)
  }, [filter, referrals])

  const available = useMemo(() => {
    if (!summary) return 0
    const earned = Number.parseFloat(summary.total_commissions)
    const requested = payouts.reduce((sum, p) => sum + Number.parseFloat(p.amount), 0)
    return Math.max(0, earned - requested)
  }, [summary, payouts])

  function copyCoupon() {
    if (!summary) return
    navigator.clipboard?.writeText(summary.referral_code).catch(() => {})
    setCopied(true)
    flash('Código copiado para a área de transferência!')
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function submitPayout() {
    if (available <= 0) {
      flash('Você não tem saldo disponível para saque.')
      return
    }
    setSubmitting(true)
    try {
      const created = await requestAssessorPayout({ amount: available, pix_key: pixKey || null })
      setPayouts((prev) => [created, ...prev])
      setPayoutOpen(false)
      setPixKey('')
      flash(`Saque de ${formatCurrency(available)} solicitado!`)
    } catch {
      flash('Não foi possível solicitar o saque. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !summary) {
    return (
      <div className="text-muted-foreground mx-auto max-w-7xl px-6 py-10 text-sm">
        Carregando...
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdvisorTopbar active="Afiliados" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-4 py-2.5 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-primary h-px w-6" />
              <span className="text-primary text-xs font-semibold tracking-widest">
                PROGRAMA DE AFILIADOS
              </span>
            </div>
            <h1 className="font-display text-foreground text-4xl font-semibold text-balance">
              Histórico de Indicações & Cupons
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Saldo atualizado em tempo real</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => flash('Relatório exportado com sucesso!')}
              className="h-11 gap-2 px-5 text-sm font-semibold"
            >
              <Download className="size-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={<Ticket className="text-primary size-5" />}
            tag="TOTAL"
            value={String(summary.referred_providers)}
            label="Fornecedores Indicados"
          />
          <KpiCard
            icon={<CircleCheck className="text-primary size-5" />}
            tag="TOTAL"
            value={String(summary.confirmed_referrals)}
            label="Conversões Confirmadas"
            footer={
              <p className="text-primary mt-3 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3.5" />
                Taxa de conversão: {summary.conversion_rate}%
              </p>
            }
          />
          <KpiCard
            icon={<span className="text-primary text-sm font-semibold">R$</span>}
            tag="ACUM."
            value={formatCurrency(Number.parseFloat(summary.contracts_volume))}
            label="Volume de Contratos"
          />
          <KpiCard
            highlight
            icon={<Wallet className="text-primary size-5" />}
            tag="Ganhos"
            value={formatCurrency(Number.parseFloat(summary.total_commissions))}
            label="Total em Comissões"
            footer={
              <p className="text-primary mt-3 flex items-center gap-1 text-xs">
                <CircleCheck className="size-3.5" />
                Média {formatCurrency(Number.parseFloat(summary.average_per_referral))}
              </p>
            }
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Referrals table */}
            <section className="border-border/60 bg-card rounded-xl border">
              <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-b p-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Tabela de Indicações
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                    {summary.confirmed_referrals} confirmadas
                  </span>
                </div>
                <div className="border-border/60 bg-muted/30 flex items-center gap-1 rounded-full border p-1">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        filter === f.id
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column headers */}
              <div className="text-muted-foreground hidden grid-cols-[1.4fr_1.4fr_0.9fr_1fr_1fr] gap-4 px-5 py-3 text-[0.65rem] font-semibold tracking-widest md:grid">
                <span>EVENTO</span>
                <span>FORNECEDOR</span>
                <span>STATUS</span>
                <span className="text-right">VALOR DO CONTRATO</span>
                <span className="text-right">SUA COMISSÃO</span>
              </div>

              <div className="divide-border/50 divide-y">
                {filtered.map((r) => (
                  <ReferralRow key={r.id} referral={r} />
                ))}
                {filtered.length === 0 && (
                  <p className="text-muted-foreground px-5 py-10 text-center text-sm">
                    Nenhuma indicação neste filtro.
                  </p>
                )}
              </div>
            </section>

            {/* Commission trend chart */}
            <section className="border-border/60 bg-card rounded-xl border p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Comissões por Mês
                  </h2>
                </div>
                <span className="text-muted-foreground text-xs">Últimos 6 meses</span>
              </div>
              <ChartContainer config={chartConfig} className="h-[240px] w-full">
                <BarChart data={trend.map((t) => ({ ...t, total: Number.parseFloat(t.total) }))}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                  />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthLabel}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} width={24} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Active coupon */}
            <section className="border-border/60 bg-card rounded-xl border p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Meu Cupom Ativo
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Código exclusivo de assessora TimTim
                  </p>
                </div>
                <Ticket className="text-muted-foreground size-5" />
              </div>

              <div className="border-primary/40 bg-primary/5 rounded-xl border border-dashed p-5 text-center">
                <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                  CÓDIGO DE ASSESSORA
                </p>
                <p className="text-primary mt-2 font-mono text-2xl font-bold tracking-[0.2em]">
                  {summary.referral_code}
                </p>
                <button
                  type="button"
                  onClick={copyCoupon}
                  className="bg-primary text-primary-foreground mx-auto mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                >
                  <Copy className="size-4" />
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => flash('Abrindo compartilhamento via WhatsApp...')}
                  className="border-border/60 text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => flash('Link de indicação copiado!')}
                  className="border-border/60 text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors"
                >
                  <Share2 className="size-4" />
                  Compartilhar
                </button>
              </div>

              <div className="border-border/60 mt-5 grid grid-cols-3 border-t pt-4 text-center">
                <div>
                  <p className="font-display text-foreground text-xl font-semibold">
                    {summary.referred_providers}
                  </p>
                  <p className="text-muted-foreground text-xs">Usos</p>
                </div>
                <div className="border-border/60 border-x">
                  <p className="font-display text-foreground text-xl font-semibold">
                    {summary.confirmed_referrals}
                  </p>
                  <p className="text-muted-foreground text-xs">Convertidos</p>
                </div>
                <div>
                  <p className="font-display text-primary text-xl font-semibold">
                    {summary.conversion_rate}%
                  </p>
                  <p className="text-muted-foreground text-xs">Conversão</p>
                </div>
              </div>
            </section>

            {/* Top vendors */}
            <section className="border-border/60 bg-card rounded-xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Top Fornecedores
                </h2>
              </div>
              {topVendors.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm">
                  Nenhuma comissão confirmada ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {topVendors.map((v) => {
                    const Icon = Utensils
                    return (
                      <div key={v.provider_id} className="flex items-center gap-3">
                        <div className="border-border/60 bg-muted/30 grid size-9 shrink-0 place-items-center rounded-lg border">
                          <Icon className="text-primary size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-foreground truncate text-sm">
                              {v.provider_name}
                            </span>
                            <span className="text-primary text-sm font-semibold">
                              {formatCurrency(Number.parseFloat(v.total_commission))}
                            </span>
                          </div>
                          <div className="bg-muted mt-1.5 h-1 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-primary/70 h-full rounded-full"
                              style={{ width: `${v.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="border-primary/30 bg-primary/5 mt-5 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs">Saldo Disponível</p>
                    <p className="font-display text-foreground text-xl font-semibold">
                      {formatCurrency(available)}
                    </p>
                  </div>
                  {!payoutOpen && (
                    <Button
                      onClick={() => setPayoutOpen(true)}
                      disabled={available <= 0}
                      className="h-9 gap-1.5 px-4 text-xs font-semibold"
                    >
                      <Wallet className="size-4" />
                      Sacar
                    </Button>
                  )}
                </div>
                {payoutOpen && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder="Chave Pix (e-mail, CPF/CNPJ...)"
                      className="border-border bg-input text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={submitPayout}
                        disabled={submitting}
                        className="h-9 flex-1 text-xs font-semibold"
                      >
                        {submitting ? 'Enviando...' : `Confirmar ${formatCurrency(available)}`}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setPayoutOpen(false)}
                        className="border-border/60 text-muted-foreground hover:text-foreground rounded-lg border px-3 text-xs transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <AdvisorFooter />
    </div>
  )
}

function KpiCard({
  icon,
  tag,
  value,
  label,
  footer,
  highlight,
}: {
  icon: React.ReactNode
  tag: string
  value: string
  label: string
  footer?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5',
        highlight ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="border-border/60 bg-muted/30 grid size-9 place-items-center rounded-lg border">
          {icon}
        </div>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider',
            highlight
              ? 'bg-primary/15 text-primary'
              : 'border-border/60 text-muted-foreground border',
          )}
        >
          {tag}
        </span>
      </div>
      <p
        className={cn(
          'font-display mt-4 text-4xl font-semibold',
          highlight ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
      {footer}
    </div>
  )
}

function ReferralRow({ referral }: { referral: Referral }) {
  const Icon = VENDOR_ICONS[referral.category_name ?? ''] ?? Utensils
  const meta = STATUS_META[referral.status] ?? {
    label: referral.status.toUpperCase(),
    className: 'border-border/60 text-muted-foreground',
  }
  const dim = referral.status !== 'confirmada' && referral.status !== 'paga'

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.4fr_1.4fr_0.9fr_1fr_1fr] md:items-center md:gap-4">
      {/* Event */}
      <div className="min-w-0">
        <p
          className={cn(
            'truncate text-sm font-medium',
            dim ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {referral.event_name}
        </p>
        <p className="text-muted-foreground text-xs">{referral.contratante_name}</p>
      </div>

      {/* Vendor */}
      <div className="flex items-center gap-2.5">
        <div className="border-border/60 bg-muted/30 grid size-8 shrink-0 place-items-center rounded-lg border">
          <Icon className={cn('size-4', dim ? 'text-muted-foreground' : 'text-primary')} />
        </div>
        <div className="min-w-0">
          <p className={cn('truncate text-sm', dim ? 'text-muted-foreground' : 'text-foreground')}>
            {referral.provider_name}
          </p>
          <p className="text-muted-foreground text-xs">{referral.category_name ?? '—'}</p>
        </div>
      </div>

      {/* Status */}
      <div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[0.65rem] font-semibold tracking-wider',
            meta.className,
          )}
        >
          {referral.status === 'pendente' && <Hourglass className="size-3" />}
          {meta.label}
        </span>
      </div>

      {/* Contract value */}
      <p
        className={cn(
          'text-sm font-semibold md:text-right',
          dim ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {formatCurrency(Number.parseFloat(referral.contract_value))}
      </p>

      {/* Commission */}
      <div className="md:text-right">
        <span
          className={cn(
            'inline-flex rounded-md border px-2.5 py-1 text-sm font-semibold',
            dim
              ? 'border-border/60 text-muted-foreground'
              : 'border-primary/40 bg-primary/10 text-primary',
          )}
        >
          {formatCurrency(Number.parseFloat(referral.commission_amount))}
        </span>
      </div>
    </div>
  )
}
