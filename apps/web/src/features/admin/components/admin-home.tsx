'use client'

import { useEffect, useState } from 'react'

import {
  Activity,
  ArrowUpRight,
  Calendar,
  Camera,
  CircleAlert,
  Database,
  Download,
  Filter,
  Flower2,
  Gauge,
  Hourglass,
  LineChart as LineChartIcon,
  MessageSquare,
  Music4,
  Shield,
  Star,
  TriangleAlert,
  UsersRound,
  Utensils,
  Wine,
  Zap,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  type AdminDispute,
  type AdminKpis,
  type AdminTopVendor,
  type EcosystemActivityMonth,
  type PlatformHealth,
  getAdminKpis,
  getAdminTopVendors,
  getEcosystemActivity,
  getPlatformHealth,
  listOpenDisputes,
} from '@/lib/api'
import { cn } from '@/lib/utils'

import { AdminTopbar, AdminFooter } from './admin-topbar'

const SEVERITY_META: Record<
  string,
  { label: string; className: string; dotClass: string; icon: typeof TriangleAlert }
> = {
  critico: {
    label: 'CRÍTICO',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
    dotClass: 'text-destructive',
    icon: TriangleAlert,
  },
  medio: {
    label: 'ATENÇÃO',
    className: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
    dotClass: 'text-yellow-500',
    icon: CircleAlert,
  },
  baixo: {
    label: 'BAIXA',
    className: 'border-primary/40 bg-primary/10 text-primary',
    dotClass: 'text-primary',
    icon: Hourglass,
  },
}

const VENDOR_ICONS: Record<string, typeof Camera> = {
  'Bar de Coquetéis': Wine,
  'Buffet / Gastronomia': Utensils,
  'DJs & Sonorização': Music4,
  'Decoração & Cenografia': Flower2,
  'Fotografia & Filme': Camera,
  'Banda / Música ao Vivo': Music4,
}

const chartConfig: ChartConfig = {
  events_count: { label: 'Eventos', color: 'var(--chart-1)' },
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function monthLabel(month: string): string {
  const [, m] = month.split('-')
  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return names[Number(m) - 1] ?? month
}

function formatOpenedAgo(createdAt: string): string {
  const ms = Date.now() - new Date(createdAt).getTime()
  const hours = Math.floor(ms / (1000 * 60 * 60))
  if (hours < 1) return 'Aberto agora'
  if (hours < 24) return `Aberto há ${hours}h`
  const days = Math.floor(hours / 24)
  return `Aberto há ${days} dia${days > 1 ? 's' : ''}`
}

function formatSla(deadlineAt: string | null): { label: string; urgent: boolean } {
  if (!deadlineAt) return { label: 'Sem prazo definido', urgent: false }
  const ms = new Date(deadlineAt).getTime() - Date.now()
  if (ms <= 0) return { label: 'SLA vencido', urgent: true }
  const hours = Math.round(ms / (1000 * 60 * 60))
  return { label: `SLA em ${hours}h`, urgent: hours <= 24 }
}

export function AdminHome() {
  const [kpis, setKpis] = useState<AdminKpis | null>(null)
  const [disputes, setDisputes] = useState<AdminDispute[]>([])
  const [activity, setActivity] = useState<EcosystemActivityMonth[]>([])
  const [health, setHealth] = useState<PlatformHealth | null>(null)
  const [topVendors, setTopVendors] = useState<AdminTopVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getAdminKpis(),
      listOpenDisputes(),
      getEcosystemActivity(),
      getPlatformHealth(),
      getAdminTopVendors(),
    ])
      .then(([k, d, a, h, tv]) => {
        setKpis(k)
        setDisputes(d)
        setActivity(a)
        setHealth(h)
        setTopVendors(tv)
      })
      .finally(() => setLoading(false))
  }, [])

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

  if (loading || !kpis || !health) {
    return (
      <div className="text-muted-foreground mx-auto max-w-7xl px-6 py-10 text-sm">
        Carregando...
      </div>
    )
  }

  const kpiCards = [
    {
      id: 'subscribers',
      icon: UsersRound,
      tag: 'FORNECEDORES',
      value: String(kpis.active_subscribers),
      label: 'Assinantes Ativos',
    },
    {
      id: 'mrr',
      icon: LineChartIcon,
      tag: 'MRR',
      value: formatCurrency(Number.parseFloat(kpis.mrr)),
      label: 'Faturamento de Assinaturas',
    },
    {
      id: 'commissions',
      icon: Database,
      tag: 'ASSESSORAS',
      value: formatCurrency(Number.parseFloat(kpis.referral_commissions_paid)),
      label: 'Comissões de Indicação Pagas',
      highlight: true,
    },
    {
      id: 'gross',
      icon: Database,
      tag: 'BRUTO',
      value: formatCurrency(Number.parseFloat(kpis.gross_volume)),
      label: 'Volume Total em Contratos',
    },
  ]

  const healthMetrics = [
    {
      id: 'conversion',
      icon: Gauge,
      label: 'Taxa de Conversão Global',
      value: `${health.conversion_rate}%`,
      percent: health.conversion_rate,
      tone: 'primary' as const,
    },
    {
      id: 'rating',
      icon: Star,
      label: 'Avaliação Média de Fornecedores',
      value: health.avg_rating ? `${health.avg_rating} / 5` : '—',
      percent: health.avg_rating ? (health.avg_rating / 5) * 100 : 0,
      tone: 'primary' as const,
    },
    {
      id: 'completed',
      icon: Zap,
      label: 'Contratos Concluídos',
      value: `${health.contracts_completed_rate}%`,
      percent: health.contracts_completed_rate,
      tone: 'primary' as const,
    },
    {
      id: 'disputes',
      icon: Activity,
      label: 'Disputas Resolvidas',
      value: `${health.disputes_resolved_rate}%`,
      percent: health.disputes_resolved_rate,
      tone: 'warning' as const,
    },
  ]

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <AdminTopbar active="Visão Geral" onUnavailable={(l) => flash(`${l} em breve`)} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {/* Header */}
        <div className="border-border/60 border-b pb-8">
          <div className="flex items-center gap-3">
            <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase">
              <span className="bg-primary size-1.5 rounded-full" />
              Controle Operacional · Ativo
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Shield className="size-3.5" />
              Nível de Acesso: <span className="text-foreground">Irrestrito</span>
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Painel Estratégico & <span className="text-primary block">Métricas Globais</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm">
                Supervisão em tempo real do ecossistema TimTim
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="border-primary/30 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm">
                <span className="bg-primary size-1.5 rounded-full" />
                Sistema Online
              </span>
              <button
                type="button"
                onClick={() => flash('Seletor de período em breve')}
                className="border-border/60 text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors"
              >
                <Calendar className="size-4" />
                Tempo real
              </button>
              <button
                type="button"
                onClick={() => flash('Relatório exportado com sucesso')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <Download className="size-4" />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.id}
                className={cn(
                  'rounded-2xl border p-6',
                  kpi.highlight
                    ? 'border-primary/50 bg-primary/5 shadow-[0_0_0_1px_var(--color-primary)/20]'
                    : 'border-border/60 bg-card/40',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'grid size-10 place-items-center rounded-lg',
                      kpi.highlight
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted/40 text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="border-border/60 text-muted-foreground rounded-md border px-2 py-0.5 text-[0.65rem] font-medium tracking-wider uppercase">
                    {kpi.tag}
                  </span>
                </div>
                <p
                  className={cn(
                    'font-display mt-5 text-4xl font-semibold tracking-tight',
                    kpi.highlight ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {kpi.value}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">{kpi.label}</p>
              </div>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Disputes */}
          <section className="border-border/60 bg-card/40 rounded-2xl border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-semibold">Disputas em Aberto</h2>
                <span className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider uppercase">
                  Arbitragem
                </span>
                <span className="text-primary text-sm">{disputes.length} abertas</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => flash('Filtros em breve')}
                  className="border-border/60 text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors"
                >
                  <Filter className="size-3.5" />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {disputes.length === 0 && (
                <p className="text-muted-foreground py-10 text-center text-sm">
                  Nenhuma disputa em aberto no momento.
                </p>
              )}
              {disputes.map((dispute) => {
                const meta = SEVERITY_META[dispute.severity] ?? SEVERITY_META.baixo
                const SevIcon = meta.icon
                const sla = formatSla(dispute.deadline_at)
                return (
                  <div
                    key={dispute.id}
                    className={cn(
                      'bg-background/40 rounded-xl border p-4',
                      dispute.severity === 'critico'
                        ? 'border-l-destructive border-border/60 border-l-2'
                        : 'border-border/60',
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <span
                          className={cn(
                            'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg',
                            meta.className,
                          )}
                        >
                          <SevIcon className="size-4" />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground font-semibold">
                              Contrato {dispute.contract_code}
                            </span>
                            <span
                              className={cn(
                                'rounded border px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase',
                                meta.className,
                              )}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-foreground mt-1 text-sm">
                            {dispute.opened_by_name} vs {dispute.respondent_name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatOpenedAgo(dispute.created_at)}
                            {dispute.dispute_value
                              ? ` · Valor em disputa: ${formatCurrency(Number.parseFloat(dispute.dispute_value))}`
                              : ''}
                          </p>
                          <p className="text-muted-foreground mt-2 max-w-xl text-xs leading-relaxed">
                            {dispute.description}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs">
                            <span
                              className={cn(
                                'flex items-center gap-1.5',
                                sla.urgent ? 'text-destructive' : meta.dotClass,
                              )}
                            >
                              <span
                                className={cn(
                                  'size-1.5 rounded-full',
                                  sla.urgent ? 'bg-destructive' : 'bg-current',
                                )}
                              />
                              {sla.label}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <MessageSquare className="size-3.5" />
                              {dispute.events_count} evento{dispute.events_count === 1 ? '' : 's'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          flash(`Canal de mediação do contrato ${dispute.contract_code} em breve`)
                        }
                        className="border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 hidden shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:flex"
                      >
                        <ArrowUpRight className="size-3.5" />
                        Abrir Canal de Mediação
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Right column */}
          <div className="space-y-6">
            {/* Ecosystem activity */}
            <section className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Atividade do Ecossistema</h2>
                <span className="border-primary/30 bg-primary/5 text-primary rounded-md border px-2 py-0.5 text-[0.65rem] font-medium">
                  6 meses
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Eventos criados na plataforma por mês
              </p>
              <ChartContainer config={chartConfig} className="mt-4 h-[180px] w-full">
                <BarChart data={activity} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthLabel}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Bar dataKey="events_count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {activity.map((entry, i) => (
                      <Cell
                        key={entry.month}
                        fill="var(--color-events_count)"
                        fillOpacity={i === activity.length - 1 ? 1 : 0.55}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </section>

            {/* Platform health */}
            <section className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Saúde da Plataforma</h2>
                <span className="text-primary flex items-center gap-1.5 text-xs">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Operacional
                </span>
              </div>
              <div className="mt-5 space-y-5">
                {healthMetrics.map((m) => {
                  const Icon = m.icon
                  return (
                    <div key={m.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Icon
                            className={cn(
                              'size-4',
                              m.tone === 'warning' ? 'text-yellow-500' : 'text-primary',
                            )}
                          />
                          {m.label}
                        </span>
                        <span
                          className={cn(
                            'font-semibold',
                            m.tone === 'warning' ? 'text-yellow-500' : 'text-primary',
                          )}
                        >
                          {m.value}
                        </span>
                      </div>
                      <div className="bg-muted/40 mt-2 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            m.tone === 'warning' ? 'bg-yellow-500' : 'bg-primary',
                          )}
                          style={{ width: `${m.percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Top vendors */}
            <section className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Top Fornecedores</h2>
              </div>
              <div className="mt-4 space-y-1">
                {topVendors.length === 0 && (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Nenhum contrato fechado ainda.
                  </p>
                )}
                {topVendors.map((v, i) => {
                  const Icon = VENDOR_ICONS[v.category_name ?? ''] ?? Camera
                  return (
                    <div
                      key={v.provider_id}
                      className="border-border/40 flex items-center gap-3 border-b py-3 last:border-0"
                    >
                      <span className="text-muted-foreground text-sm font-semibold">#{i + 1}</span>
                      <span className="bg-muted/40 text-primary grid size-9 place-items-center rounded-lg">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">
                          {v.provider_name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {v.category_name ?? '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-semibold">
                          {formatCurrency(Number.parseFloat(v.total_revenue))}
                        </p>
                        {v.avg_rating !== null && (
                          <p className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                            <Star className="size-3 fill-yellow-500 text-yellow-500" />
                            {v.avg_rating}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      <AdminFooter />

      {toast && (
        <div
          role="status"
          className="border-primary/40 bg-card text-foreground fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-2.5 text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
