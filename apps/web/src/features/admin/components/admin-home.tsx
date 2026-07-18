'use client'

import { useState } from 'react'

import {
  Activity,
  ArrowUpRight,
  Bed,
  Calendar,
  Camera,
  CircleAlert,
  Clapperboard,
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
  Zap,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import {
  ADMIN_DISPUTES,
  ADMIN_HEADER,
  ADMIN_KPIS,
  ADMIN_TOP_VENDORS,
  DISPUTE_SEVERITY_META,
  ECOSYSTEM_ACTIVITY,
  PLATFORM_HEALTH,
} from '../data/admin-data'

import { AdminTopbar, AdminFooter } from './admin-topbar'

const KPI_ICONS: Record<string, typeof UsersRound> = {
  users: UsersRound,
  chart: LineChartIcon,
  cash: Database,
  database: Database,
}

const SEVERITY_ICONS: Record<string, typeof TriangleAlert> = {
  'triangle-alert': TriangleAlert,
  'circle-alert': CircleAlert,
  hourglass: Hourglass,
}

const HEALTH_ICONS: Record<string, typeof Activity> = {
  activity: Activity,
  gauge: Gauge,
  star: Star,
  zap: Zap,
}

const VENDOR_ICONS: Record<string, typeof Camera> = {
  camera: Camera,
  utensils: Utensils,
  music: Music4,
  flower: Flower2,
  video: Clapperboard,
  bed: Bed,
}

const chartConfig: ChartConfig = {
  value: { label: 'Eventos', color: 'var(--chart-1)' },
}

export function AdminHome() {
  const [toast, setToast] = useState<string | null>(null)

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

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
              Nível de Acesso: <span className="text-foreground">{ADMIN_HEADER.accessLevel}</span>
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Painel Estratégico & <span className="text-primary block">Métricas Globais</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm">
                {ADMIN_HEADER.subtitle} ·{' '}
                <span className="text-foreground">{ADMIN_HEADER.period}</span>
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
                {ADMIN_HEADER.period}
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
          {ADMIN_KPIS.map((kpi) => {
            const Icon = KPI_ICONS[kpi.icon] ?? UsersRound
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
                <p className="text-primary mt-3 flex items-center gap-1.5 text-xs">
                  <ArrowUpRight className="size-3.5" />
                  {kpi.delta}
                </p>
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
                <span className="text-primary text-sm">{ADMIN_DISPUTES.length} abertas</span>
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
                <button
                  type="button"
                  onClick={() => flash('Lista completa em breve')}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Ver todas
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {ADMIN_DISPUTES.map((dispute) => {
                const meta = DISPUTE_SEVERITY_META[dispute.severity]
                const SevIcon = SEVERITY_ICONS[meta.icon] ?? TriangleAlert
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
                              {dispute.contract}
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
                          <p className="text-foreground mt-1 text-sm">{dispute.parties}</p>
                          <p className="text-muted-foreground text-xs">
                            {dispute.openedAgo} · Valor em disputa: {dispute.disputeValue}
                          </p>
                          <p className="text-muted-foreground mt-2 max-w-xl text-xs leading-relaxed">
                            {dispute.description}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs">
                            <span
                              className={cn(
                                'flex items-center gap-1.5',
                                dispute.slaUrgent ? 'text-destructive' : meta.dotClass,
                              )}
                            >
                              <span
                                className={cn(
                                  'size-1.5 rounded-full',
                                  dispute.slaUrgent ? 'bg-destructive' : 'bg-current',
                                )}
                              />
                              {dispute.sla}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <MessageSquare className="size-3.5" />
                              {dispute.messages} mensagens
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => flash(`Canal de mediação do ${dispute.contract} em breve`)}
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
                  2025
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Eventos ativos gerenciados por mês
              </p>
              <ChartContainer config={chartConfig} className="mt-4 h-[180px] w-full">
                <BarChart
                  data={ECOSYSTEM_ACTIVITY}
                  margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 50, 100]}
                    className="text-xs"
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {ECOSYSTEM_ACTIVITY.map((entry, i) => (
                      <Cell
                        key={entry.month}
                        fill={
                          i === ECOSYSTEM_ACTIVITY.length - 1
                            ? 'var(--color-value)'
                            : 'var(--color-value)'
                        }
                        fillOpacity={i === ECOSYSTEM_ACTIVITY.length - 1 ? 1 : 0.55}
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
                {PLATFORM_HEALTH.map((m) => {
                  const Icon = HEALTH_ICONS[m.icon] ?? Activity
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
                <button
                  type="button"
                  onClick={() => flash('Ranking completo em breve')}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Ver ranking
                </button>
              </div>
              <div className="mt-4 space-y-1">
                {ADMIN_TOP_VENDORS.map((v) => {
                  const Icon = VENDOR_ICONS[v.icon] ?? Camera
                  return (
                    <div
                      key={v.rank}
                      className="border-border/40 flex items-center gap-3 border-b py-3 last:border-0"
                    >
                      <span className="text-muted-foreground text-sm font-semibold">#{v.rank}</span>
                      <span className="bg-muted/40 text-primary grid size-9 place-items-center rounded-lg">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">{v.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{v.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-semibold">{v.amount}</p>
                        <p className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                          <Star className="size-3 fill-yellow-500 text-yellow-500" />
                          {v.rating}
                        </p>
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
