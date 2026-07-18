'use client'

import { useState } from 'react'

import {
  Camera,
  Check,
  Clapperboard,
  CircleHelp,
  Copy,
  Flower2,
  Link2,
  MessageCircle,
  Music4,
  Share2,
  Star,
  TrendingUp,
  Utensils,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import {
  ADVISOR_STATS,
  ADVISOR_USER,
  ADVISOR_WEDDINGS,
  BALANCE,
  COMMISSION_EVOLUTION,
  COUPON,
  PHASE_STYLES,
  RECENT_COMMISSIONS,
} from '../data/advisor-data'

import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'

const STAT_ICONS = { help: CircleHelp, link: Link2, rs: null, star: Star } as const
const COMMISSION_ICONS = {
  camera: Camera,
  music: Music4,
  flower: Flower2,
  utensils: Utensils,
  video: Clapperboard,
} as const

const chartConfig = {
  value: { label: 'Comissões', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function AdvisorHome() {
  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

  function copyCoupon() {
    setCopied(true)
    flash(`Código ${COUPON.code} copiado!`)
    window.setTimeout(() => setCopied(false), 2000)
  }

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
              Olá, {ADVISOR_USER.firstName}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Você está assessorando <span className="text-foreground">6 casamentos ativos</span>{' '}
              este semestre.
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVISOR_STATS.map((stat) => {
            const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS]
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
                <p className="text-primary mt-4 flex items-center gap-1 text-xs">
                  <TrendingUp className="size-3.5" />
                  {stat.delta}
                </p>
              </div>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Weddings */}
            <section className="border-border/60 bg-card rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Casamentos sob sua Assessoria
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-semibold">
                    6 ativos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flash('Lista completa em breve')}
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
                  <span className="bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
                    2025
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">Acumulado por mês</span>
              </div>

              <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
                <AreaChart data={COMMISSION_EVOLUTION} margin={{ left: 4, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="advisorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
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
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2.5}
                    fill="url(#advisorFill)"
                    dot={{ r: 3, fill: 'var(--color-value)' }}
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
                  {COUPON.code}
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
                    {COUPON.uses}
                  </p>
                  <p className="text-muted-foreground text-xs">Usos</p>
                </div>
                <div>
                  <p className="font-display text-foreground text-2xl font-semibold">
                    {COUPON.converted}
                  </p>
                  <p className="text-muted-foreground text-xs">Convertidos</p>
                </div>
                <div>
                  <p className="font-display text-primary text-2xl font-semibold">
                    {COUPON.conversion}
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
                <button
                  type="button"
                  onClick={() => flash('Extrato completo em breve')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Ver todas
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {RECENT_COMMISSIONS.map((c) => {
                  const Icon = COMMISSION_ICONS[c.icon as keyof typeof COMMISSION_ICONS] ?? Camera
                  return (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                      <span className="bg-muted/50 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">{c.label}</p>
                        <p className="text-muted-foreground truncate text-xs">{c.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary text-sm font-semibold">{c.amount}</p>
                        <p className="text-muted-foreground text-xs">{c.date}</p>
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
                      {BALANCE.toReceive}
                    </p>
                  </div>
                  <Button
                    onClick={() => flash('Solicitação de saque enviada!')}
                    className="h-9 gap-1.5 px-4 text-xs font-semibold"
                  >
                    <CircleHelp className="size-3.5" />
                    Sacar
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Meta mensal: {BALANCE.goal}</span>
                    <span className="text-primary font-semibold">{BALANCE.goalPercent}%</span>
                  </div>
                  <div className="bg-muted mt-1.5 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${BALANCE.goalPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AdvisorFooter />
    </div>
  )
}
