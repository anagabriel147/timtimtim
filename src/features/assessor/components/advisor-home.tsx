'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'
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
  const router = useRouter()
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
    <div className="min-h-screen bg-background">
      <AdvisorTopbar active="Início" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border border-primary/40 bg-primary/15 px-5 py-2.5 text-sm font-medium text-primary shadow-lg backdrop-blur"
        >
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold tracking-widest text-primary">
                • ASSESSORA PARCEIRA •
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
              Olá, {ADVISOR_USER.firstName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Você está assessorando <span className="text-foreground">6 casamentos ativos</span> este semestre.
            </p>
          </div>


        </div>

        {/* KPI cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVISOR_STATS.map((stat) => {
            const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS]
            return (
              <div key={stat.id} className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    {Icon ? <Icon className="size-4" /> : <span className="text-xs font-bold">R$</span>}
                  </span>
                  <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[0.6rem] font-semibold tracking-widest text-muted-foreground">
                    {stat.tag}
                  </span>
                </div>
                <p className="mt-6 font-display text-4xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-4 flex items-center gap-1 text-xs text-primary">
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
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Casamentos sob sua Assessoria
                  </h2>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    6 ativos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flash('Lista completa em breve')}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ver todos
                </button>
              </div>

              <div className="mt-4 divide-y divide-border/60">
                {ADVISOR_WEDDINGS.map((w) => (
                  <div key={w.id} className="py-5 first:pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary">
                          {w.initials}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{w.couple}</p>
                          <p className="text-xs text-muted-foreground">
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
                          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
                        >
                          Abrir Painel do Casal ›
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progresso geral</span>
                        <span className="font-semibold text-foreground">{w.progress}%</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${w.progress}%` }} />
                        </div>
                        <span className="flex items-center gap-1 whitespace-nowrap text-xs text-primary">
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
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Evolução de Comissões
                  </h2>
                  <span className="rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    2025
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Acumulado por mês</span>
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
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
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
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Painel do Meu Cupom</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seu código exclusivo TimTim de indicação
                  </p>
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Link2 className="size-4" />
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5 text-center">
                <p className="text-[0.6rem] font-semibold tracking-widest text-muted-foreground">
                  CÓDIGO DE ASSESSORA
                </p>
                <p className="mt-3 font-display text-2xl font-bold tracking-[0.2em] text-primary">
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
                  className="flex items-center justify-center gap-2 rounded-lg border border-border/60 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => flash('Abrindo opções de compartilhamento')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border/60 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Share2 className="size-4" />
                  Compartilhar
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/60 pt-5 text-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">{COUPON.uses}</p>
                  <p className="text-xs text-muted-foreground">Usos</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">{COUPON.converted}</p>
                  <p className="text-xs text-muted-foreground">Convertidos</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">{COUPON.conversion}</p>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                </div>
              </div>
            </section>

            {/* Recent commissions */}
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">Últimas Comissões</h2>
                <button
                  type="button"
                  onClick={() => flash('Extrato completo em breve')}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ver todas
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {RECENT_COMMISSIONS.map((c) => {
                  const Icon = COMMISSION_ICONS[c.icon as keyof typeof COMMISSION_ICONS] ?? Camera
                  return (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted/50 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{c.label}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{c.amount}</p>
                        <p className="text-xs text-muted-foreground">{c.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Balance card */}
              <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo a receber</p>
                    <p className="mt-0.5 font-display text-2xl font-semibold text-foreground">
                      {BALANCE.toReceive}
                    </p>
                  </div>
                  <Button onClick={() => flash('Solicitação de saque enviada!')} className="h-9 gap-1.5 px-4 text-xs font-semibold">
                    <CircleHelp className="size-3.5" />
                    Sacar
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Meta mensal: {BALANCE.goal}</span>
                    <span className="font-semibold text-primary">{BALANCE.goalPercent}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${BALANCE.goalPercent}%` }} />
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
