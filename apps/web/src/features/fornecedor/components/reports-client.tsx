'use client'

import { useMemo, useState } from 'react'

import {
  ArrowUpRight,
  Clock,
  Download,
  Eye,
  Info,
  PieChart as PieIcon,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

// ---- Mocked report data (frontend-only prototype) ----
const REPORT = {
  updatedLabel: 'Atualizado agora',
  year: '2025',
  kpis: {
    conversion: { value: 42, delta: '+5%' },
    couponEarnings: { value: 'R$18.5k', delta: '+R$3.2k', coupon: 'TIM-A42', referrals: 6 },
    profileViews: { value: '1.240', unique: '847 únicos', avgTime: '2m 14s médio', delta: '+18%' },
  },
  revenue: {
    total: 'R$ 284.500',
    bestMonth: 'Abril',
    bestMonthValue: 'R$ 52k',
    vsLastYear: '+31%',
    forecast: 'R$ 48k',
    months: [
      { month: 'Jan', faturado: 27000, meta: 30000 },
      { month: 'Fev', faturado: 33000, meta: 34000 },
      { month: 'Mar', faturado: 40000, meta: 38000 },
      { month: 'Abr', faturado: 52000, meta: 42000 },
      { month: 'Mai', faturado: 47000, meta: 46000 },
      { month: 'Jun', faturado: 45000, meta: 48000 },
    ],
  },
  channels: [
    {
      key: 'assessor',
      label: 'Referências de Assessor',
      short: 'Assessor',
      percent: 60,
      leads: '38 leads · 6 assessores',
      delta: '+8%',
    },
    {
      key: 'busca',
      label: 'Busca Direta',
      short: 'Busca Direta',
      percent: 40,
      leads: '25 leads · orgânico',
      delta: '+3%',
    },
  ],
  ticket: { value: 'R$ 20.3k', note: 'por contrato fechado', delta: '+12%', goalPercent: 81 },
  cycle: {
    value: 8,
    unit: 'dias',
    note: 'tempo médio até fechamento',
    delta: '-2d',
    min: '3d',
    max: '21d',
    median: '7d',
  },
  reputation: { value: '4.9', max: '5.0', reviews: 34, badge: 'TOP 10%', stars: 4.9 },
}

const PERIODS = ['3M', '6M', '1A'] as const

const revenueConfig = {
  faturado: { label: 'Faturado', color: 'var(--chart-1)' },
  meta: { label: 'Meta', color: 'var(--muted-foreground)' },
} satisfies ChartConfig

const channelConfig = {
  assessor: { label: 'Assessor', color: 'var(--chart-1)' },
  busca: { label: 'Busca Direta', color: 'var(--muted)' },
} satisfies ChartConfig

function KpiCard({
  icon: Icon,
  delta,
  deltaTone = 'up',
  children,
}: {
  icon: React.ElementType
  delta: string
  deltaTone?: 'up' | 'down'
  children: React.ReactNode
}) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg">
          <Icon className="size-5" />
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
            deltaTone === 'up'
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500',
          )}
        >
          {deltaTone === 'up' ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {delta}
        </span>
      </div>
      {children}
    </div>
  )
}

export function ReportsClient() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('1A')
  const [series, setSeries] = useState({ faturado: true, meta: true })
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600)
  }

  const pieData = useMemo(
    () => REPORT.channels.map((c) => ({ key: c.key, label: c.short, value: c.percent })),
    [],
  )

  return (
    <div className="bg-background min-h-screen">
      <SupplierTopbar active="Relatórios" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="border-primary/40 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-md border px-3 py-1 text-[0.7rem] font-semibold tracking-widest">
                • ANALYTICS & RELATÓRIOS •
              </span>
              <span className="text-muted-foreground text-sm">{REPORT.updatedLabel}</span>
            </div>
            <h1 className="font-display text-foreground text-4xl font-semibold">
              Performance <span className="text-muted-foreground">Overview</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Visão consolidada do seu desempenho como fornecedor em {REPORT.year}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border-border/60 bg-muted/30 flex items-center gap-1 rounded-lg border p-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p)
                    flash(`Período alterado para ${p}`)
                  }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    period === p
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => flash('Relatório exportado com sucesso!')}
              className="h-10 gap-2"
            >
              <Download className="size-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <KpiCard icon={PieIcon} delta={REPORT.kpis.conversion.delta}>
            <p className="font-display text-foreground text-5xl font-semibold">
              {REPORT.kpis.conversion.value}
              <span className="text-muted-foreground text-3xl">%</span>
            </p>
            <p className="text-muted-foreground mt-2 text-sm">Taxa de Conversão</p>
            <div className="mt-4">
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${REPORT.kpis.conversion.value}%` }}
                />
              </div>
              <div className="text-muted-foreground mt-1.5 flex justify-between text-xs">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </KpiCard>

          <KpiCard icon={Wallet} delta={REPORT.kpis.couponEarnings.delta}>
            <p className="font-display text-foreground text-5xl font-semibold">
              {REPORT.kpis.couponEarnings.value}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">Ganhos via Cupom de Assessor</p>
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <span className="bg-primary size-2 rounded-full" />
              Cupom{' '}
              <span className="text-foreground font-medium">
                {REPORT.kpis.couponEarnings.coupon}
              </span>{' '}
              · {REPORT.kpis.couponEarnings.referrals} indicações este mês
            </div>
          </KpiCard>

          <KpiCard icon={Eye} delta={REPORT.kpis.profileViews.delta}>
            <p className="font-display text-foreground text-5xl font-semibold">
              {REPORT.kpis.profileViews.value}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">Visualizações do Perfil</p>
            <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" />
                {REPORT.kpis.profileViews.unique}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {REPORT.kpis.profileViews.avgTime}
              </span>
            </div>
          </KpiCard>
        </div>

        {/* Revenue + Channels */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Revenue evolution */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Evolução Mensal de Faturamento
                </h2>
                <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                  {REPORT.year}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setSeries((s) => ({ ...s, faturado: !s.faturado }))}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className={cn('size-3 rounded-sm', series.faturado ? 'bg-primary' : 'bg-muted')}
                  />
                  <span className={series.faturado ? 'text-foreground' : 'text-muted-foreground'}>
                    Faturado
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeries((s) => ({ ...s, meta: !s.meta }))}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className={cn(
                      'size-3 rounded-sm',
                      series.meta ? 'bg-muted-foreground' : 'bg-muted',
                    )}
                  />
                  <span className={series.meta ? 'text-foreground' : 'text-muted-foreground'}>
                    Meta
                  </span>
                </button>
              </div>
            </div>

            {/* mini stats */}
            <div className="border-border/50 mt-5 grid grid-cols-2 gap-4 border-y py-4 sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Total Acumulado</p>
                <p className="font-display text-foreground text-lg font-semibold">
                  {REPORT.revenue.total}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Melhor Mês</p>
                <p className="text-foreground text-sm font-medium">
                  {REPORT.revenue.bestMonth}{' '}
                  <span className="text-muted-foreground text-xs">
                    · {REPORT.revenue.bestMonthValue}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">vs. Ano Anterior</p>
                <p className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                  <TrendingUp className="size-3.5" />
                  {REPORT.revenue.vsLastYear}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Previsão Jun</p>
                <p className="text-foreground text-sm font-medium">{REPORT.revenue.forecast}</p>
              </div>
            </div>

            <ChartContainer config={revenueConfig} className="mt-4 h-[340px] w-full">
              <BarChart data={REPORT.revenue.months} margin={{ left: 4, right: 4, top: 10 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => `R$${v / 1000}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`}
                    />
                  }
                />
                {series.faturado && (
                  <Bar
                    dataKey="faturado"
                    fill="var(--color-faturado)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={54}
                  />
                )}
                {series.meta && (
                  <Line
                    type="monotone"
                    dataKey="meta"
                    stroke="var(--color-meta)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: 'var(--color-meta)' }}
                  />
                )}
              </BarChart>
            </ChartContainer>
          </div>

          {/* Channels */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-foreground text-lg font-semibold">
                Canais de Atração
              </h2>
              <span className="border-border bg-muted/40 text-muted-foreground rounded-md border px-2 py-0.5 text-xs font-medium">
                LEADS
              </span>
            </div>

            <ChartContainer config={channelConfig} className="mx-auto mt-4 aspect-square h-[220px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={64}
                  outerRadius={90}
                  strokeWidth={4}
                  stroke="var(--card)"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={entry.key === 'assessor' ? 'var(--chart-1)' : 'var(--muted)'}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) - 6}
                              className="fill-muted-foreground text-xs"
                            >
                              Assessor
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 16}
                              className="fill-foreground font-display text-2xl font-semibold"
                            >
                              60%
                            </tspan>
                          </text>
                        )
                      }
                      return null
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span className="bg-primary size-2 rounded-full" />
                Assessor
              </span>
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span className="bg-muted size-2 rounded-full" />
                Busca Direta
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {REPORT.channels.map((c) => (
                <div
                  key={c.key}
                  className={cn(
                    'border-border/50 rounded-lg border p-3',
                    c.key === 'assessor' && 'border-l-primary border-l-2',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary grid size-6 place-items-center rounded">
                        {c.key === 'assessor' ? (
                          <Users className="size-3.5" />
                        ) : (
                          <Search className="size-3.5" />
                        )}
                      </span>
                      <span className="text-foreground text-sm font-medium">{c.label}</span>
                    </div>
                    <span className="text-foreground text-sm font-semibold">{c.percent}%</span>
                  </div>
                  <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        c.key === 'assessor' ? 'bg-primary' : 'bg-muted-foreground',
                      )}
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                    <span>{c.leads}</span>
                    <span className="text-primary inline-flex items-center gap-1">
                      <ArrowUpRight className="size-3" />
                      {c.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-primary/20 bg-primary/5 mt-4 flex gap-2 rounded-lg border p-3">
              <Info className="text-primary mt-0.5 size-4 shrink-0" />
              <p className="text-muted-foreground text-xs">
                Assessores geram <span className="text-primary">1.5× mais conversões</span> que
                busca orgânica. Considere ampliar sua rede de parceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom KPIs */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* Ticket médio */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg">
                  <Wallet className="size-4" />
                </span>
                <h3 className="text-foreground text-sm font-semibold">Ticket Médio</h3>
              </div>
              <span className="text-primary inline-flex items-center gap-1 text-xs">
                <TrendingUp className="size-3" />
                {REPORT.ticket.delta}
              </span>
            </div>
            <p className="font-display text-foreground text-4xl font-semibold">
              {REPORT.ticket.value}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{REPORT.ticket.note}</p>
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Meta mensal</span>
                <span className="text-foreground font-medium">{REPORT.ticket.goalPercent}%</span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${REPORT.ticket.goalPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ciclo de venda */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg">
                  <Clock className="size-4" />
                </span>
                <h3 className="text-foreground text-sm font-semibold">Ciclo de Venda</h3>
              </div>
              <span className="text-primary inline-flex items-center gap-1 text-xs">
                <TrendingDown className="size-3" />
                {REPORT.cycle.delta}
              </span>
            </div>
            <p className="font-display text-foreground text-4xl font-semibold">
              {REPORT.cycle.value}{' '}
              <span className="text-muted-foreground text-2xl">{REPORT.cycle.unit}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{REPORT.cycle.note}</p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { label: 'Mín', value: REPORT.cycle.min },
                { label: 'Máx', value: REPORT.cycle.max },
                { label: 'Mediana', value: REPORT.cycle.median },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border-border/50 bg-muted/20 flex-1 rounded-lg border px-3 py-2 text-center"
                >
                  <span className="text-muted-foreground text-xs">{s.label}: </span>
                  <span className="text-foreground text-xs font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score reputação */}
          <div className="border-border/60 bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg">
                  <Star className="size-4" />
                </span>
                <h3 className="text-foreground text-sm font-semibold">Score de Reputação</h3>
              </div>
              <span className="border-primary/30 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-xs font-medium">
                {REPORT.reputation.badge}
              </span>
            </div>
            <p className="font-display text-foreground text-4xl font-semibold">
              {REPORT.reputation.value}{' '}
              <span className="text-muted-foreground text-2xl">/ {REPORT.reputation.max}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              baseado em {REPORT.reputation.reviews} avaliações
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      'size-4',
                      n <= Math.floor(REPORT.reputation.stars)
                        ? 'fill-primary text-primary'
                        : n - REPORT.reputation.stars < 1
                          ? 'fill-primary/50 text-primary'
                          : 'text-muted-foreground',
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-xs">
                {REPORT.reputation.reviews} avaliações · Fornecedor Verificado
              </span>
            </div>
          </div>
        </div>
      </main>

      <SupplierFooter />
    </div>
  )
}
