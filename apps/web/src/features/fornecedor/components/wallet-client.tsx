'use client'

import { useState } from 'react'

import {
  BarChart3,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Download,
  FileText,
  Info,
  Mail,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Upload,
  Wallet,
  Zap,
} from 'lucide-react'
import { Bar, ComposedChart, Line, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

// ---- Mocked wallet data (frontend-only prototype) ----
const WALLET = {
  account: 'carlos.m@timtim.com.br',
  period: 'Jun 2025',
  pixKey: 'carlos.m@timtim.com.br',
  pixType: 'E-mail',
  pixSince: '03/01/2025',
  available: 3450,
  blocked: 1180,
  monthGain: 760,
  breakdown: { confirmed: 3450, review: 420, pending: 760 },
  kpis: {
    totalEarned: 'R$ 45.200',
    totalWithdrawn: 'R$ 32.100',
    toConfirm: 'R$ 4.180',
    nextPayment: '15 Jul',
  },
  stats: {
    avgWithdraw: 'R$ 3.850',
    biggestWithdraw: 'R$ 8.500',
    biggestWithdrawDate: '18 Abr 2025',
    avgTime: '~12 min',
  },
  quickValues: [500, 1000, 2000],
}

type WithdrawStatus = 'transferido' | 'pendente' | 'analise'

const WITHDRAW_STATUS_META: Record<
  WithdrawStatus,
  { label: string; className: string; dot: string }
> = {
  transferido: {
    label: 'TRANSFERIDO',
    className: 'border-primary/40 bg-primary/10 text-primary',
    dot: 'bg-primary',
  },
  pendente: {
    label: 'PENDENTE',
    className: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
    dot: 'bg-yellow-500',
  },
  analise: {
    label: 'EM ANÁLISE',
    className: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
    dot: 'bg-violet-400',
  },
}

type Withdraw = {
  id: string
  date: string
  time: string
  reference: string
  ref: string
  status: WithdrawStatus
  value: string
}

const WITHDRAWALS: Withdraw[] = [
  {
    id: 'w-1',
    date: '10/06/2025',
    time: '09:42',
    reference: 'Contrato — Vídeo Financetech',
    ref: 'ID: PIX-2025-0610-001',
    status: 'transferido',
    value: 'R$ 12.000,00',
  },
  {
    id: 'w-2',
    date: '18/05/2025',
    time: '14:17',
    reference: 'Contrato — Festa 15 Anos',
    ref: 'ID: PIX-2025-0518-003',
    status: 'transferido',
    value: 'R$ 8.500,00',
  },
  {
    id: 'w-3',
    date: '05/05/2025',
    time: '10:03',
    reference: 'Parcela — Casamento Isabela',
    ref: 'ID: PIX-2025-0505-007',
    status: 'transferido',
    value: 'R$ 5.600,00',
  },
  {
    id: 'w-4',
    date: '21/04/2025',
    time: '16:55',
    reference: 'Saque Parcial — Abr',
    ref: 'ID: PIX-2025-0421-002',
    status: 'pendente',
    value: 'R$ 900,00',
  },
  {
    id: 'w-5',
    date: '09/04/2025',
    time: '11:28',
    reference: 'Parcela — Ensaio Pré-Wedding',
    ref: 'ID: PIX-2025-0409-001',
    status: 'transferido',
    value: 'R$ 2.400,00',
  },
  {
    id: 'w-6',
    date: '28/03/2025',
    time: '08:14',
    reference: 'Parcela — Decoração Gala',
    ref: 'ID: PIX-2025-0328-005',
    status: 'analise',
    value: 'R$ 3.800,00',
  },
  {
    id: 'w-7',
    date: '14/03/2025',
    time: '13:50',
    reference: 'Contrato — Buffet Corporativo',
    ref: 'ID: PIX-2025-0314-009',
    status: 'transferido',
    value: 'R$ 6.300,00',
  },
]

const EARNINGS = [
  { month: 'Jan', comissoes: 1200, saques: 1000 },
  { month: 'Fev', comissoes: 1600, saques: 1400 },
  { month: 'Mar', comissoes: 1750, saques: 1500 },
  { month: 'Abr', comissoes: 2100, saques: 1800 },
  { month: 'Mai', comissoes: 2400, saques: 1900 },
  { month: 'Jun', comissoes: 3200, saques: 1300 },
]

const chartConfig = {
  comissoes: { label: 'Recebido', color: 'var(--chart-2)' },
  saques: { label: 'Saques', color: 'var(--chart-1)' },
} satisfies ChartConfig

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function WalletClient() {
  const [toast, setToast] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(WALLET.available)
  const [withdrawals, setWithdrawals] = useState<Withdraw[]>(WITHDRAWALS)
  const [transferred, setTransferred] = useState(false)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 3200)
  }

  const total = WALLET.kpis
  const canWithdraw = amount > 0 && amount <= WALLET.available

  function handleTransfer() {
    if (!canWithdraw) {
      flash('Informe um valor válido, dentro do saldo disponível.')
      return
    }
    const newItem: Withdraw = {
      id: `w-${Date.now()}`,
      date: '11/06/2025',
      time: 'agora',
      reference: 'Saque via Pix',
      ref: 'ID: PIX-2025-0611-010',
      status: 'analise',
      value: `R$ ${formatBRL(amount)}`,
    }
    setWithdrawals((prev) => [newItem, ...prev])
    setTransferred(true)
    flash(`Transferência de R$ ${formatBRL(amount)} solicitada via Pix!`)
  }

  const kpiCards = [
    { icon: Coins, label: 'Total Ganho (2025)', value: total.totalEarned },
    { icon: Upload, label: 'Total Sacado', value: total.totalWithdrawn },
    { icon: CalendarClock, label: 'A Confirmar', value: total.toConfirm, amber: true },
    { icon: Wallet, label: 'Próximo Pagamento', value: total.nextPayment },
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SupplierTopbar active="Carteira" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div className="border-primary/40 bg-primary/10 text-primary fixed inset-x-0 top-20 z-50 mx-auto w-fit max-w-[90vw] rounded-full border px-5 py-2.5 text-center text-sm font-medium shadow-lg backdrop-blur">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-primary h-px w-6" />
              <span className="text-primary text-xs font-semibold tracking-widest">
                GESTÃO FINANCEIRA
              </span>
            </div>
            <h1 className="font-display text-foreground text-4xl font-semibold tracking-tight text-balance">
              Minha Carteira & Resgates
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Conta registrada em <span className="text-foreground">{WALLET.account}</span> · Saldo
              atualizado em tempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => flash('Filtro de período em breve')}
              className="border-border/60 bg-muted/30 text-foreground hover:border-border flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors"
            >
              <CalendarClock className="text-muted-foreground size-4" />
              {WALLET.period}
              <ChevronDown className="text-muted-foreground size-4" />
            </button>
            <Button
              onClick={() => flash('Gerando extrato completo...')}
              className="h-11 gap-2 px-5"
            >
              <FileText className="size-4" />
              Extrato Completo
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="border-border/60 bg-card/40 rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid size-10 place-items-center rounded-lg',
                    k.amber ? 'bg-yellow-500/10 text-yellow-500' : 'bg-primary/10 text-primary',
                  )}
                >
                  <k.icon className="size-5" />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">{k.label}</p>
                  <p className="font-display text-foreground text-xl font-semibold">{k.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Available balance */}
            <div className="border-primary/30 bg-primary/[0.04] rounded-2xl border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary size-2 rounded-full" />
                    <span className="text-primary text-xs font-semibold tracking-widest">
                      SALDO DISPONÍVEL PARA SAQUE
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Disponibilidade imediata · Pix 24h
                  </p>
                </div>
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Wallet className="size-4" />
                </span>
              </div>

              <p className="font-display text-primary mt-4 text-5xl font-semibold">
                R$ {formatBRL(WALLET.available).split(',')[0]}
                <span className="text-2xl">,{formatBRL(WALLET.available).split(',')[1]}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium">
                  <TrendingUp className="size-3" />
                  +R$ {WALLET.monthGain} este mês
                </span>
                <span className="border-border/60 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs">
                  R$ {WALLET.blocked} bloqueado
                </span>
              </div>

              <div className="border-primary/15 mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center">
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Confirmadas</p>
                  <p className="text-primary mt-0.5 text-sm font-semibold">
                    R$ {WALLET.breakdown.confirmed}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Em Análise</p>
                  <p className="mt-0.5 text-sm font-semibold text-violet-400">
                    R$ {WALLET.breakdown.review}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Pendente</p>
                  <p className="mt-0.5 text-sm font-semibold text-yellow-500">
                    R$ {WALLET.breakdown.pending}
                  </p>
                </div>
              </div>
            </div>

            {/* Withdraw form */}
            <div className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Solicitar Saque via Pix
                </h2>
                <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                  <ShieldCheck className="text-primary size-3.5" />
                  Transferência segura
                </span>
              </div>

              <p className="text-muted-foreground mt-5 text-xs">Valor do Saque (R$)</p>
              <div className="border-border bg-input focus-within:border-primary mt-2 flex items-center gap-2 rounded-xl border px-4 py-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="font-display text-foreground w-full bg-transparent text-right text-2xl font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAmount(WALLET.available)}
                  className="border-primary/40 bg-primary/10 text-primary shrink-0 rounded-md border px-2.5 py-1 text-[0.7rem] font-semibold"
                >
                  MÁXIMO
                </button>
              </div>

              <p className="text-muted-foreground mt-4 text-xs">Valores rápidos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {WALLET.quickValues.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                      amount === v
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/60 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    R$ {v.toLocaleString('pt-BR')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(WALLET.available)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    amount === WALLET.available
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border/60 text-muted-foreground hover:text-foreground',
                  )}
                >
                  Tudo
                </button>
              </div>

              <p className="text-muted-foreground mt-5 text-xs">Chave Pix Cadastrada</p>
              <div className="border-border/60 bg-muted/20 mt-2 flex items-center gap-3 rounded-xl border px-4 py-3">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{WALLET.pixKey}</p>
                  <p className="text-muted-foreground text-xs">
                    {WALLET.pixType} · Registrada em {WALLET.pixSince}
                  </p>
                </div>
                <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold">
                  ATIVA
                </span>
              </div>
              <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                <Info className="size-3.5" />
                Para alterar sua chave Pix, acesse as configurações de perfil.
              </p>

              <Button
                onClick={handleTransfer}
                disabled={transferred}
                className="mt-5 h-14 w-full gap-2 text-sm font-semibold"
              >
                <Zap className="size-4" />
                {transferred ? 'SAQUE SOLICITADO' : `TRANSFERIR R$ ${formatBRL(amount)} VIA PIX`}
              </Button>

              <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
                <span className="inline-flex items-center gap-1">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Criptografia 256-bit
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Processado em até 30 min
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Sem taxas adicionais
                </span>
              </div>
            </div>

            {/* Earnings chart */}
            <div className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Evolução de Ganhos
                </h2>
                <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[0.7rem] font-medium">
                  Jan–Jun 2025
                </span>
              </div>
              <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[var(--chart-2)]" />
                  Recebido
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[var(--chart-1)]" />
                  Saques
                </span>
              </div>
              <ChartContainer config={chartConfig} className="mt-4 h-56 w-full">
                <ComposedChart data={EARNINGS} margin={{ left: -12, right: 8, top: 8 }}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={56}
                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="saques"
                    fill="var(--color-saques)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Line
                    dataKey="comissoes"
                    type="monotone"
                    stroke="var(--color-comissoes)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Withdrawals history */}
            <div className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Histórico de Saques Realizados
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[0.7rem] font-medium">
                    {withdrawals.length} transações
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flash('Exportando histórico...')}
                  className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors"
                >
                  <Download className="size-3.5" />
                  Exportar
                </button>
              </div>

              {/* Table */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse">
                  <thead>
                    <tr className="border-border/60 text-muted-foreground border-b text-left text-[0.65rem] font-semibold tracking-widest">
                      <th className="pb-3 font-semibold">DATA</th>
                      <th className="pb-3 font-semibold">REFERÊNCIA</th>
                      <th className="pb-3 font-semibold">STATUS</th>
                      <th className="pb-3 font-semibold">MÉTODO</th>
                      <th className="pb-3 text-right font-semibold">VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.slice(0, 7).map((w) => {
                      const meta = WITHDRAW_STATUS_META[w.status]
                      const isTransfer = w.status === 'transferido'
                      return (
                        <tr key={w.id} className="border-border/40 border-b last:border-0">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className={cn('size-2 shrink-0 rounded-full', meta.dot)} />
                              <div>
                                <p className="text-foreground text-sm font-medium">{w.date}</p>
                                <p className="text-muted-foreground text-xs">{w.time}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-foreground text-sm">{w.reference}</p>
                            <p className="text-muted-foreground text-xs">{w.ref}</p>
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={cn(
                                'inline-block rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold',
                                meta.className,
                              )}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                              <span className="bg-primary/20 text-primary grid size-4 place-items-center rounded text-[0.6rem] font-bold">
                                P
                              </span>
                              Pix
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span
                              className={cn(
                                'inline-block rounded-md px-2.5 py-1 text-sm font-semibold',
                                isTransfer ? 'bg-primary/10 text-primary' : 'text-foreground',
                              )}
                            >
                              {w.value}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-border/40 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-muted-foreground text-xs">
                  Mostrando {Math.min(7, withdrawals.length)} de {withdrawals.length + 7} transações
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => flash('Você já está na primeira página')}
                    className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => flash('Carregando próxima página...')}
                    className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                  >
                    Próxima
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border-border/60 bg-card/40 rounded-2xl border p-5">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <BarChart3 className="size-4" />
                </span>
                <p className="text-muted-foreground mt-4 text-xs">Saque Médio</p>
                <p className="font-display text-foreground mt-1 text-2xl font-semibold">
                  {WALLET.stats.avgWithdraw}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">por transação</p>
              </div>
              <div className="border-border/60 bg-card/40 rounded-2xl border p-5">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Trophy className="size-4" />
                </span>
                <p className="text-muted-foreground mt-4 text-xs">Maior Saque</p>
                <p className="font-display text-primary mt-1 text-2xl font-semibold">
                  {WALLET.stats.biggestWithdraw}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {WALLET.stats.biggestWithdrawDate}
                </p>
              </div>
              <div className="border-border/60 bg-card/40 rounded-2xl border p-5">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Zap className="size-4" />
                </span>
                <p className="text-muted-foreground mt-4 text-xs">Tempo Médio</p>
                <p className="font-display text-foreground mt-1 text-2xl font-semibold">
                  {WALLET.stats.avgTime}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">para receber via Pix</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SupplierFooter />
    </div>
  )
}
