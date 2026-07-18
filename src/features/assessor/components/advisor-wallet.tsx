'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Download,
  FileText,
  Info,
  Mail,
  ShieldCheck,
  Trophy,
  Upload,
  Wallet,
  Zap,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AdvisorFooter, AdvisorTopbar } from './advisor-topbar'

/* -------------------------------------------------------------------------- */
/*  Mocked data (advisor wallet — independent from the supplier wallet)        */
/* -------------------------------------------------------------------------- */

const WALLET = {
  account: 'isabela.m@timtim.com.br',
  period: 'Jun 2025',
  kpis: {
    totalEarned: 'R$ 12.400',
    totalWithdrawn: 'R$ 8.950',
    toConfirm: 'R$ 1.180',
    nextPayment: '15 Jun',
  },
  balance: {
    available: 3450,
    availableFormatted: '3.450',
    thisMonth: '+R$ 760 este mês',
    blocked: 'R$ 1.180 bloqueado',
    confirmed: 'R$ 3.450',
    inReview: 'R$ 420',
    pending: 'R$ 760',
  },
  quickValues: [500, 1000, 2000],
  pixKey: {
    value: 'isabela.m@timtim.com.br',
    type: 'E-mail',
    registeredAt: '03/01/2025',
  },
} as const

type WithdrawalStatus = 'transferido' | 'pendente' | 'analise'

type Withdrawal = {
  id: string
  date: string
  time: string
  reference: string
  code: string
  status: WithdrawalStatus
  method: string
  amount: string
}

const WITHDRAWAL_STATUS: Record<WithdrawalStatus, { label: string; className: string; dot: string }> = {
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
    className: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
    dot: 'bg-purple-400',
  },
}

const WITHDRAWALS: Withdrawal[] = [
  {
    id: 'w-1',
    date: '10/05/2025',
    time: '09:42',
    reference: 'Comissões — Abr/Mai',
    code: 'ID: PIX-2025-0510-001',
    status: 'transferido',
    method: 'Pix',
    amount: 'R$ 1.200,00',
  },
  {
    id: 'w-2',
    date: '18/04/2025',
    time: '14:17',
    reference: 'Comissões — Mar/Abr',
    code: 'ID: PIX-2025-0418-003',
    status: 'transferido',
    method: 'Pix',
    amount: 'R$ 2.100,00',
  },
  {
    id: 'w-3',
    date: '05/03/2025',
    time: '10:03',
    reference: 'Comissões — Fev/Mar',
    code: 'ID: PIX-2025-0305-007',
    status: 'transferido',
    method: 'Pix',
    amount: 'R$ 1.750,00',
  },
  {
    id: 'w-4',
    date: '21/02/2025',
    time: '16:55',
    reference: 'Saque Parcial — Jan',
    code: 'ID: PIX-2025-0221-002',
    status: 'pendente',
    method: 'Pix',
    amount: 'R$ 900,00',
  },
  {
    id: 'w-5',
    date: '09/01/2025',
    time: '11:28',
    reference: 'Comissões — Dez 2024',
    code: 'ID: PIX-2025-0109-001',
    status: 'transferido',
    method: 'Pix',
    amount: 'R$ 1.600,00',
  },
  {
    id: 'w-6',
    date: '28/11/2024',
    time: '08:14',
    reference: 'Comissões — Nov 2024',
    code: 'ID: PIX-2024-1128-005',
    status: 'analise',
    method: 'Pix',
    amount: 'R$ 800,00',
  },
  {
    id: 'w-7',
    date: '14/10/2024',
    time: '13:50',
    reference: 'Comissões — Out 2024',
    code: 'ID: PIX-2024-1014-009',
    status: 'transferido',
    method: 'Pix',
    amount: 'R$ 1.300,00',
  },
]

const EARNINGS_TREND = [
  { month: 'Jan', comissoes: 1200, saques: 1500 },
  { month: 'Fev', comissoes: 1600, saques: 1300 },
  { month: 'Mar', comissoes: 1500, saques: 1750 },
  { month: 'Abr', comissoes: 2100, saques: 2100 },
  { month: 'Mai', comissoes: 2500, saques: 1200 },
  { month: 'Jun', comissoes: 3450, saques: 900 },
]

const STAT_CARDS = [
  { id: 'avg', icon: BarChart3, label: 'Saque Médio', value: 'R$ 1.277', note: 'por transação', accent: false },
  { id: 'max', icon: Trophy, label: 'Maior Saque', value: 'R$ 2.100', note: '18 Abr 2025', accent: true },
  { id: 'time', icon: Zap, label: 'Tempo Médio', value: '~12 min', note: 'para receber via Pix', accent: false },
] as const

const chartConfig: ChartConfig = {
  comissoes: { label: 'Comissões', color: 'var(--chart-1)' },
  saques: { label: 'Saques', color: 'var(--chart-3)' },
}

/* -------------------------------------------------------------------------- */

export function AdvisorWallet() {
  const [toast, setToast] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>(WALLET.balance.availableFormatted + ',00')
  const [transferDone, setTransferDone] = useState(false)
  const [rows, setRows] = useState<Withdrawal[]>(WITHDRAWALS)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

  const parsedAmount = useMemo(() => {
    const digits = amount.replace(/[^\d,]/g, '').replace(',', '.')
    return Number.parseFloat(digits) || 0
  }, [amount])

  function setQuick(value: number | 'max') {
    const v = value === 'max' ? WALLET.balance.available : value
    setAmount(v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
  }

  function handleTransfer() {
    if (transferDone) return
    if (parsedAmount <= 0) {
      flash('Informe um valor válido para saque.')
      return
    }
    if (parsedAmount > WALLET.balance.available) {
      flash('Valor acima do saldo disponível para saque.')
      return
    }
    const newRow: Withdrawal = {
      id: `w-new-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      reference: 'Saque via Pix — Jun',
      code: 'ID: PIX-2025-0615-010',
      status: 'analise',
      method: 'Pix',
      amount: `R$ ${parsedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    }
    setRows((prev) => [newRow, ...prev])
    setTransferDone(true)
    flash(`Transferência de R$ ${parsedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} solicitada via Pix.`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdvisorTopbar active="Meu Perfil" onUnavailable={(l) => flash(`${l} em breve`)} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/40 bg-primary/15 px-5 py-2.5 text-sm font-medium text-primary shadow-lg backdrop-blur">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Gestão Financeira</span>
            </div>
            <h1 className="text-pretty text-4xl font-semibold tracking-tight md:text-5xl">Minha Carteira &amp; Resgates</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Conta registrada em <span className="text-foreground">{WALLET.account}</span> · Saldo atualizado em tempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => flash('Seletor de período em breve')}
              className="flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <CalendarClock className="size-4" />
              {WALLET.period}
              <ChevronDown className="size-4" />
            </button>
            <Button onClick={() => flash('Extrato completo exportado.')} className="h-11 gap-2 px-5 text-sm font-semibold">
              <FileText className="size-4" />
              Extrato Completo
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard icon={Coins} label="Total Ganho (2025)" value={WALLET.kpis.totalEarned} tone="cyan" />
          <KpiCard icon={Upload} label="Total Sacado" value={WALLET.kpis.totalWithdrawn} tone="cyan" />
          <KpiCard icon={Clock} label="A Confirmar" value={WALLET.kpis.toConfirm} tone="amber" />
          <KpiCard icon={CalendarClock} label="Próximo Pagamento" value={WALLET.kpis.nextPayment} tone="violet" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Available balance */}
            <section className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Saldo Disponível para Saque</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Disponibilidade imediata · Pix 24h</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Wallet className="size-5" />
                </span>
              </div>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-semibold tracking-tight text-primary">R$ {WALLET.balance.availableFormatted}</span>
                <span className="pb-1.5 text-xl font-semibold text-primary/80">,00</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {WALLET.balance.thisMonth}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {WALLET.balance.blocked}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-5 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Confirmadas</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{WALLET.balance.confirmed}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Em Análise</p>
                  <p className="mt-1 text-lg font-semibold text-purple-300">{WALLET.balance.inReview}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pendente</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-500">{WALLET.balance.pending}</p>
                </div>
              </div>
            </section>

            {/* Withdraw form */}
            <section className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Solicitar Saque via Pix</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Transferência segura
                </span>
              </div>

              <label className="mt-5 block text-xs text-muted-foreground">Valor do Saque (R$)</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-3">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setTransferDone(false)
                  }}
                  className="w-full bg-transparent text-right text-2xl font-semibold tracking-tight outline-none"
                  aria-label="Valor do saque"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuick('max')
                    setTransferDone(false)
                  }}
                  className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  MÁXIMO
                </button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">Valores rápidos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {WALLET.quickValues.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setQuick(v)
                      setTransferDone(false)
                    }}
                    className="rounded-lg border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    R$ {v.toLocaleString('pt-BR')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setQuick('max')
                    setTransferDone(false)
                  }}
                  className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Tudo
                </button>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">Chave Pix Cadastrada</p>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{WALLET.pixKey.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {WALLET.pixKey.type} · Registrada em {WALLET.pixKey.registeredAt}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Ativa
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="size-3.5" />
                Para alterar sua chave Pix, acesse as configurações de perfil.
              </p>

              <button
                type="button"
                onClick={handleTransfer}
                disabled={transferDone}
                className={cn(
                  'mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-semibold transition-colors',
                  transferDone
                    ? 'cursor-not-allowed border border-border/60 bg-muted/40 text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                <Upload className="size-4" />
                {transferDone
                  ? 'Saque solicitado com sucesso'
                  : `TRANSFERIR R$ ${parsedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} VIA PIX`}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary" /> Criptografia 256-bit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary" /> Processado em até 30 min
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary" /> Sem taxas adicionais
                </span>
              </div>
            </section>

            {/* Earnings chart */}
            <section className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">Evolução de Ganhos</h2>
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Jan–Jun 2025
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[var(--chart-1)]" /> Comissões
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[var(--chart-3)]" /> Saques
                  </span>
                </div>
              </div>

              <ChartContainer config={chartConfig} className="mt-4 h-[240px] w-full">
                <ComposedChart data={EARNINGS_TREND} margin={{ left: 4, right: 4, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`}
                    className="text-xs"
                    width={64}
                  />
                  <ChartTooltip />
                  <Bar dataKey="saques" fill="var(--color-saques)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Line
                    type="monotone"
                    dataKey="comissoes"
                    stroke="var(--color-comissoes)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: 'var(--color-comissoes)' }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Withdrawals history */}
            <section className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">Histórico de Saques Realizados</h2>
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {rows.length} transações
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flash('Histórico exportado.')}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Download className="size-3.5" />
                  Exportar
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">Data</th>
                      <th className="pb-3 font-medium">Referência</th>
                      <th className="pb-3 text-center font-medium">Status</th>
                      <th className="pb-3 font-medium">Método</th>
                      <th className="pb-3 text-right font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 7).map((row) => {
                      const meta = WITHDRAWAL_STATUS[row.status]
                      const isTransfer = row.status === 'transferido'
                      return (
                        <tr key={row.id} className="border-b border-border/40 last:border-0">
                          <td className="py-4 align-top">
                            <div className="flex items-start gap-2">
                              <span className={cn('mt-1 size-2 shrink-0 rounded-full', meta.dot)} />
                              <div>
                                <p className="text-sm font-medium text-foreground">{row.date}</p>
                                <p className="text-xs text-muted-foreground">{row.time}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 align-top">
                            <p className="text-sm font-medium text-foreground">{row.reference}</p>
                            <p className="text-xs text-muted-foreground">{row.code}</p>
                          </td>
                          <td className="py-4 text-center align-top">
                            <span className={cn('inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', meta.className)}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                              <span className="grid size-4 place-items-center rounded-sm bg-primary/20 text-[8px] font-bold text-primary">P</span>
                              {row.method}
                            </span>
                          </td>
                          <td className="py-4 text-right align-top">
                            {isTransfer ? (
                              <span className="inline-block rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                                {row.amount}
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">{row.amount}</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground">Mostrando 7 de 14 transações</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => flash('Você já está na primeira página.')}
                    className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronLeft className="size-3.5" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => flash('Carregando próxima página.')}
                    className="flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    Próxima
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STAT_CARDS.map((s) => (
                <div key={s.id} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                  <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <s.icon className="size-4" />
                  </span>
                  <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
                  <p className={cn('mt-1 text-2xl font-semibold tracking-tight', s.accent ? 'text-primary' : 'text-foreground')}>
                    {s.value}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AdvisorFooter />
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Coins
  label: string
  value: string
  tone: 'cyan' | 'amber' | 'violet'
}) {
  const toneMap = {
    cyan: 'border-primary/30 bg-primary/10 text-primary',
    amber: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500',
    violet: 'border-purple-400/30 bg-purple-400/10 text-purple-300',
  } as const
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <span className={cn('grid size-10 place-items-center rounded-lg border', toneMap[tone])}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  )
}
