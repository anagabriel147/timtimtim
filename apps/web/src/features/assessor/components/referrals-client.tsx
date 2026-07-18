'use client'

import { useMemo, useState } from 'react'

import {
  BedDouble,
  CakeSlice,
  Camera,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clapperboard,
  Copy,
  Download,
  Flower2,
  MessageCircle,
  Music4,
  Scissors,
  Share2,
  Ticket,
  TrendingUp,
  Utensils,
  Wallet,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import {
  CONVERSION_TREND,
  REFERRAL_BALANCE,
  REFERRAL_COUPON,
  REFERRAL_FILTERS,
  REFERRAL_STATUS_META,
  REFERRAL_SUMMARY,
  REFERRALS,
  TOP_VENDORS,
  type Referral,
} from '../data/advisor-data'

import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'

const VENDOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bed: BedDouble,
  music: Music4,
  flower: Flower2,
  utensils: Utensils,
  camera: Camera,
  video: Clapperboard,
  scissors: Scissors,
  car: Car,
  cake: CakeSlice,
}

const chartConfig: ChartConfig = {
  cupons: { label: 'Cupons', color: 'var(--chart-2)' },
  convertidos: { label: 'Convertidos', color: 'var(--chart-1)' },
}

export function ReferralsClient() {
  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState<(typeof REFERRAL_FILTERS)[number]['id']>('todas')
  const [copied, setCopied] = useState(false)

  function flash(message: string) {
    setToast(message)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600)
  }

  const filtered = useMemo(() => {
    if (filter === 'todas') return REFERRALS
    return REFERRALS.filter((r) => r.status === filter)
  }, [filter])

  function copyCoupon() {
    navigator.clipboard?.writeText(REFERRAL_COUPON.code).catch(() => {})
    setCopied(true)
    flash('Código copiado para a área de transferência!')
    window.setTimeout(() => setCopied(false), 2000)
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
            <p className="text-muted-foreground mt-2 text-sm">
              Período de referência:{' '}
              <span className="text-foreground">{REFERRAL_SUMMARY.period}</span> · Atualizado{' '}
              {REFERRAL_SUMMARY.updatedAt}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => flash('Seletor de período em breve')}
              className="border-border/60 text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors"
            >
              <span className="text-muted-foreground">Jun 2025</span>
              <ChevronDown className="size-4" />
            </button>
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
            value={String(REFERRAL_SUMMARY.couponsApplied)}
            label="Cupons Aplicados"
            footer={
              <div className="mt-3">
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${REFERRAL_SUMMARY.couponsPercent}%` }}
                  />
                </div>
                <div className="text-muted-foreground mt-1.5 flex items-center justify-between text-xs">
                  <span>Meta: {REFERRAL_SUMMARY.couponsGoal}</span>
                  <span className="text-primary">{REFERRAL_SUMMARY.couponsPercent}%</span>
                </div>
              </div>
            }
          />
          <KpiCard
            icon={<CircleCheck className="text-primary size-5" />}
            tag="MÊS"
            value={String(REFERRAL_SUMMARY.confirmed)}
            label="Conversões Confirmadas"
            footer={
              <p className="text-primary mt-3 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3.5" />
                Taxa de conversão: {REFERRAL_SUMMARY.conversionRate}%
              </p>
            }
          />
          <KpiCard
            icon={<span className="text-primary text-sm font-semibold">R$</span>}
            tag="ACUM."
            value={REFERRAL_SUMMARY.contractsVolume}
            label="Volume de Contratos"
            footer={
              <p className="text-primary mt-3 flex items-center gap-1 text-xs">
                <TrendingUp className="size-3.5" />
                {REFERRAL_SUMMARY.contractsDelta}
              </p>
            }
          />
          <KpiCard
            highlight
            icon={<Wallet className="text-primary size-5" />}
            tag="Ganhos"
            value={REFERRAL_SUMMARY.totalCommissions}
            label="Total em Comissões"
            footer={
              <p className="text-primary mt-3 flex items-center gap-1 text-xs">
                <CircleCheck className="size-3.5" />
                Média {REFERRAL_SUMMARY.averagePerReferral}
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
                    {REFERRAL_SUMMARY.confirmed} confirmadas
                  </span>
                </div>
                <div className="border-border/60 bg-muted/30 flex items-center gap-1 rounded-full border p-1">
                  {REFERRAL_FILTERS.map((f) => (
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
                <span>CASAMENTO</span>
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

              <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t p-5">
                <span className="text-muted-foreground text-xs">
                  Mostrando {filtered.length} de {REFERRAL_SUMMARY.couponsApplied} indicações
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => flash('Você já está na primeira página')}
                    className="border-border/60 text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => flash('Carregando próxima página...')}
                    className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    Próxima
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Conversion trend chart */}
            <section className="border-border/60 bg-card rounded-xl border p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Tendência de Conversões
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                    Jan–Jun 2025
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: 'var(--chart-2)' }}
                    />
                    Cupons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: 'var(--chart-1)' }}
                    />
                    Convertidos
                  </span>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[240px] w-full">
                <BarChart data={CONVERSION_TREND} barGap={4}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} width={24} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cupons" fill="var(--color-cupons)" radius={[3, 3, 0, 0]} />
                  <Bar
                    dataKey="convertidos"
                    fill="var(--color-convertidos)"
                    radius={[3, 3, 0, 0]}
                  />
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
                  {REFERRAL_COUPON.code}
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
                    {REFERRAL_COUPON.uses}
                  </p>
                  <p className="text-muted-foreground text-xs">Usos</p>
                </div>
                <div className="border-border/60 border-x">
                  <p className="font-display text-foreground text-xl font-semibold">
                    {REFERRAL_COUPON.converted}
                  </p>
                  <p className="text-muted-foreground text-xs">Convertidos</p>
                </div>
                <div>
                  <p className="font-display text-primary text-xl font-semibold">
                    {REFERRAL_COUPON.conversion}
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
                <button
                  type="button"
                  onClick={() => flash('Lista completa de fornecedores em breve')}
                  className="text-muted-foreground hover:text-primary text-xs transition-colors"
                >
                  Ver todos
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {TOP_VENDORS.map((v) => {
                  const Icon = VENDOR_ICONS[v.icon] ?? Utensils
                  return (
                    <div key={v.id} className="flex items-center gap-3">
                      <div className="border-border/60 bg-muted/30 grid size-9 shrink-0 place-items-center rounded-lg border">
                        <Icon className="text-primary size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-foreground truncate text-sm">{v.name}</span>
                          <span className="text-primary text-sm font-semibold">{v.amount}</span>
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

              <div className="border-primary/30 bg-primary/5 mt-5 flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="text-muted-foreground text-xs">Saldo Disponível</p>
                  <p className="font-display text-foreground text-xl font-semibold">
                    {REFERRAL_BALANCE.toReceive}
                  </p>
                </div>
                <Button
                  onClick={() => flash('Solicitação de saque enviada!')}
                  className="h-9 gap-1.5 px-4 text-sm font-semibold"
                >
                  <Wallet className="size-4" />
                  Sacar
                </Button>
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
  const Icon = VENDOR_ICONS[referral.vendorIcon] ?? Utensils
  const meta = REFERRAL_STATUS_META[referral.status]
  const dim = referral.status !== 'confirmada'

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.4fr_1.4fr_0.9fr_1fr_1fr] md:items-center md:gap-4">
      {/* Wedding */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-full border text-xs font-semibold',
            dim ? 'border-border/60 text-muted-foreground' : 'border-primary/40 text-primary',
          )}
        >
          {referral.initials}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              'truncate text-sm font-medium',
              dim ? 'text-muted-foreground' : 'text-foreground',
            )}
          >
            {referral.couple}
          </p>
          <p className="text-muted-foreground text-xs">{referral.date}</p>
        </div>
      </div>

      {/* Vendor */}
      <div className="flex items-center gap-2.5">
        <div className="border-border/60 bg-muted/30 grid size-8 shrink-0 place-items-center rounded-lg border">
          <Icon className={cn('size-4', dim ? 'text-muted-foreground' : 'text-primary')} />
        </div>
        <div className="min-w-0">
          <p className={cn('truncate text-sm', dim ? 'text-muted-foreground' : 'text-foreground')}>
            {referral.vendor}
          </p>
          <p className="text-muted-foreground text-xs">{referral.vendorCategory}</p>
        </div>
      </div>

      {/* Status */}
      <div>
        <span
          className={cn(
            'inline-flex rounded-md border px-2 py-1 text-[0.65rem] font-semibold tracking-wider',
            meta.className,
          )}
        >
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
        {referral.contractValue}
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
          {referral.commission}
        </span>
      </div>
    </div>
  )
}
