'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Camera,
  Check,
  CircleCheck,
  Copy,
  Disc3,
  Flower2,
  Link2,
  MessageCircle,
  Music4,
  Share2,
  Utensils,
  Wallet,
  Wine,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
  getCommissionTrend,
  getReferralSummary,
  listAssessorPayouts,
  listReferrals,
  requestAssessorPayout,
} from '@/lib/api'
import { cn } from '@/lib/utils'

import { ADVISOR_WEDDINGS, PHASE_STYLES } from '../data/advisor-data'

import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'

const COMMISSION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Bar de Coquetéis': Wine,
  'Buffet / Gastronomia': Utensils,
  'DJs & Sonorização': Disc3,
  'Decoração & Cenografia': Flower2,
  'Fotografia & Filme': Camera,
  'Banda / Música ao Vivo': Music4,
}

const chartConfig = {
  total: { label: 'Comissões', color: 'var(--chart-1)' },
} satisfies ChartConfig

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function monthLabel(month: string): string {
  const [, m] = month.split('-')
  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return names[Number(m) - 1] ?? month
}

export function AdvisorHome() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null)
  const [trend, setTrend] = useState<CommissionMonth[]>([])
  const [recent, setRecent] = useState<Referral[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [payoutOpen, setPayoutOpen] = useState(false)
  const [pixKey, setPixKey] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      getReferralSummary(),
      getCommissionTrend(),
      listReferrals(),
      listAssessorPayouts(),
    ])
      .then(([s, t, r, p]) => {
        setSummary(s)
        setTrend(t)
        setRecent(r.slice(0, 5))
        setPayouts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

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
    flash(`Código ${summary.referral_code} copiado!`)
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

  const stats = [
    {
      id: 'refs',
      label: 'Fornecedores Indicados',
      value: String(summary.referred_providers),
      tag: 'TOTAL',
      icon: Link2,
    },
    {
      id: 'confirmed',
      label: 'Conversões Confirmadas',
      value: String(summary.confirmed_referrals),
      tag: 'TOTAL',
      icon: CircleCheck,
    },
    {
      id: 'month',
      label: 'Comissões Recebidas (mês)',
      value: formatCurrency(Number.parseFloat(summary.commissions_this_month)),
      tag: 'MÊS',
      icon: null,
    },
    {
      id: 'total',
      label: 'Total em Comissões',
      value: formatCurrency(Number.parseFloat(summary.total_commissions)),
      tag: 'ACUM.',
      icon: Wallet,
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      <AdvisorTopbar active="Início" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div
          role="status"
          className="border-primary/40 bg-primary/15 text-primary fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur"
        >
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-3 py-1 text-[0.65rem] font-semibold tracking-widest">
                • ASSESSORA PARCEIRA •
              </span>
            </div>
            <h1 className="font-display text-foreground mt-4 text-4xl font-semibold tracking-tight">
              Painel de Indicações
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Acompanhe suas indicações de fornecedores e comissões em tempo real.
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.id} className="border-border/60 bg-card rounded-2xl border p-6">
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                    {Icon ? (
                      <Icon className="size-4" />
                    ) : (
                      <span className="text-xs font-bold">R$</span>
                    )}
                  </span>
                  <span className="bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5 text-[0.6rem] font-semibold tracking-widest">
                    {stat.tag}
                  </span>
                </div>
                <p className="font-display text-foreground mt-6 text-4xl font-semibold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Weddings (ilustrativo — sem modelo de dados de gestão de casamentos ainda) */}
            <section className="border-border/60 bg-card rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Casamentos sob sua Assessoria
                  </h2>
                  <span className="bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5 text-xs font-semibold">
                    exemplo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flash('Gestão de casamentos em breve')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Ver todos
                </button>
              </div>

              <div className="divide-border/60 mt-4 divide-y">
                {ADVISOR_WEDDINGS.map((w) => (
                  <div key={w.id} className="py-5 first:pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="border-primary/30 bg-primary/5 text-primary grid size-10 shrink-0 place-items-center rounded-full border text-xs font-semibold">
                          {w.initials}
                        </span>
                        <div>
                          <p className="text-foreground font-medium">{w.couple}</p>
                          <p className="text-muted-foreground text-xs">
                            {w.date} · {w.venue}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-[0.6rem] font-semibold tracking-widest',
                            PHASE_STYLES[w.phase],
                          )}
                        >
                          {w.phase}
                        </span>
                        <button
                          type="button"
                          onClick={() => flash(`Abrindo painel de ${w.couple}`)}
                          className="text-muted-foreground hover:text-foreground hidden text-sm transition-colors sm:block"
                        >
                          Abrir Painel do Casal ›
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Progresso geral</span>
                        <span className="text-foreground font-semibold">{w.progress}%</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${w.progress}%` }}
                          />
                        </div>
                        <span className="text-primary flex items-center gap-1 text-xs whitespace-nowrap">
                          <Check className="size-3.5" />
                          {w.tasksDone}/{w.tasksTotal} tarefas
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Commission evolution */}
            <section className="border-border/60 bg-card rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Evolução de Comissões
                  </h2>
                </div>
                <span className="text-muted-foreground text-sm">Últimos 6 meses</span>
              </div>

              <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
                <AreaChart
                  data={trend.map((t) => ({ ...t, total: Number.parseFloat(t.total) }))}
                  margin={{ left: 4, right: 8, top: 8 }}
                >
                  <defs>
                    <linearGradient id="advisorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthLabel}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => `R$${v.toLocaleString('pt-BR')}`}
                    className="text-xs"
                    width={64}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-total)"
                    strokeWidth={2.5}
                    fill="url(#advisorFill)"
                    dot={{ r: 3, fill: 'var(--color-total)' }}
                  />
                </AreaChart>
              </ChartContainer>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Coupon panel */}
            <section className="border-border/60 bg-card rounded-2xl border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Painel do Meu Cupom
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Seu código exclusivo TimTim de indicação
                  </p>
                </div>
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Link2 className="size-4" />
                </span>
              </div>

              <div className="border-primary/40 bg-primary/5 mt-5 rounded-xl border border-dashed p-5 text-center">
                <p className="text-muted-foreground text-[0.6rem] font-semibold tracking-widest">
                  CÓDIGO DE ASSESSORA
                </p>
                <p className="font-display text-primary mt-3 text-2xl font-bold tracking-[0.2em]">
                  {summary.referral_code}
                </p>
                <Button onClick={copyCoupon} className="mt-4 h-10 gap-2 px-5 text-sm font-semibold">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => flash('Compartilhando via WhatsApp')}
                  className="border-border/60 text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => flash('Abrindo opções de compartilhamento')}
                  className="border-border/60 text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors"
                >
                  <Share2 className="size-4" />
                  Compartilhar
                </button>
              </div>

              <div className="border-border/60 mt-5 grid grid-cols-3 gap-2 border-t pt-5 text-center">
                <div>
                  <p className="font-display text-foreground text-2xl font-semibold">
                    {summary.referred_providers}
                  </p>
                  <p className="text-muted-foreground text-xs">Usos</p>
                </div>
                <div>
                  <p className="font-display text-foreground text-2xl font-semibold">
                    {summary.confirmed_referrals}
                  </p>
                  <p className="text-muted-foreground text-xs">Convertidos</p>
                </div>
                <div>
                  <p className="font-display text-primary text-2xl font-semibold">
                    {summary.conversion_rate}%
                  </p>
                  <p className="text-muted-foreground text-xs">Conversão</p>
                </div>
              </div>
            </section>

            {/* Recent commissions */}
            <section className="border-border/60 bg-card rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Últimas Comissões
                </h2>
              </div>

              <div className="mt-4 space-y-1">
                {recent.length === 0 && (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Nenhuma comissão ainda.
                  </p>
                )}
                {recent.map((c) => {
                  const Icon = COMMISSION_ICONS[c.category_name ?? ''] ?? Camera
                  return (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                      <span className="bg-muted/50 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">
                          {c.category_name ?? 'Serviço'} — {c.event_name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          Fornecedor: {c.provider_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary text-sm font-semibold">
                          +{formatCurrency(Number.parseFloat(c.commission_amount))}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(c.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Balance card */}
              <div className="border-primary/25 bg-primary/5 mt-5 rounded-xl border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs">Saldo a receber</p>
                    <p className="font-display text-foreground mt-0.5 text-2xl font-semibold">
                      {formatCurrency(available)}
                    </p>
                  </div>
                  {!payoutOpen && (
                    <Button
                      onClick={() => setPayoutOpen(true)}
                      disabled={available <= 0}
                      className="h-9 gap-1.5 px-4 text-xs font-semibold"
                    >
                      <Wallet className="size-3.5" />
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
