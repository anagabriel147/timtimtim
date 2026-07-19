'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  BarChart3,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Coins,
  Download,
  FileText,
  ShieldCheck,
  Trophy,
  Upload,
  Wallet,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Contract, type Payout, listContracts, listPayouts, requestPayout } from '@/lib/api'
import { cn } from '@/lib/utils'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

const WITHDRAW_STATUS_META: Record<
  Payout['status'],
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

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function WalletClient() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [pixKey, setPixKey] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([listContracts(), listPayouts()])
      .then(([c, p]) => {
        setContracts(c)
        setPayouts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 3200)
  }

  const summary = useMemo(() => {
    const earned = contracts
      .filter((c) => c.payment_status === 'garantido' || c.payment_status === 'quitado')
      .reduce((sum, c) => sum + Number.parseFloat(c.value), 0)
    const blocked = contracts
      .filter((c) => c.payment_status === 'aguardando')
      .reduce((sum, c) => sum + Number.parseFloat(c.value), 0)
    const withdrawn = payouts
      .filter((p) => p.status === 'transferido')
      .reduce((sum, p) => sum + Number.parseFloat(p.amount), 0)
    const inAnalysis = payouts
      .filter((p) => p.status === 'analise')
      .reduce((sum, p) => sum + Number.parseFloat(p.amount), 0)
    const pending = payouts
      .filter((p) => p.status === 'pendente')
      .reduce((sum, p) => sum + Number.parseFloat(p.amount), 0)
    const requested = payouts.reduce((sum, p) => sum + Number.parseFloat(p.amount), 0)
    const available = Math.max(0, earned - requested)
    const amounts = payouts.map((p) => Number.parseFloat(p.amount))
    const avgWithdraw = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
    const biggestWithdraw = amounts.length ? Math.max(...amounts) : 0

    return {
      earned,
      blocked,
      withdrawn,
      inAnalysis,
      pending,
      available,
      avgWithdraw,
      biggestWithdraw,
    }
  }, [contracts, payouts])

  const canWithdraw = amount > 0 && amount <= summary.available && pixKey.trim().length > 0

  async function handleTransfer() {
    if (!canWithdraw) {
      flash('Informe uma chave Pix e um valor válido, dentro do saldo disponível.')
      return
    }
    setSubmitting(true)
    try {
      const created = await requestPayout({ amount, pix_key: pixKey })
      setPayouts((prev) => [created, ...prev])
      setAmount(0)
      flash(`Saque de ${formatCurrency(amount)} solicitado via Pix!`)
    } catch {
      flash('Não foi possível solicitar o saque. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const kpiCards = [
    { icon: Coins, label: 'Total Ganho', value: formatCurrency(summary.earned) },
    { icon: Upload, label: 'Total Sacado', value: formatCurrency(summary.withdrawn) },
    {
      icon: CalendarClock,
      label: 'A Confirmar',
      value: formatCurrency(summary.blocked),
      amber: true,
    },
    { icon: Wallet, label: 'Saques Solicitados', value: String(payouts.length) },
  ]

  if (loading) {
    return (
      <div className="text-muted-foreground mx-auto max-w-7xl px-6 py-10 text-sm">
        Carregando...
      </div>
    )
  }

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
            <p className="text-muted-foreground mt-2 text-sm">Saldo atualizado em tempo real</p>
          </div>
          <Button onClick={() => flash('Gerando extrato completo...')} className="h-11 gap-2 px-5">
            <FileText className="size-4" />
            Extrato Completo
          </Button>
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
                R$ {formatBRL(summary.available).split(',')[0]}
                <span className="text-2xl">,{formatBRL(summary.available).split(',')[1]}</span>
              </p>

              <div className="border-primary/15 mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center">
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Ganhos Confirmados</p>
                  <p className="text-primary mt-0.5 text-sm font-semibold">
                    {formatCurrency(summary.earned)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Em Análise</p>
                  <p className="mt-0.5 text-sm font-semibold text-violet-400">
                    {formatCurrency(summary.inAnalysis)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[0.7rem]">Pendente</p>
                  <p className="mt-0.5 text-sm font-semibold text-yellow-500">
                    {formatCurrency(summary.pending)}
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
                  onClick={() => setAmount(summary.available)}
                  className="border-primary/40 bg-primary/10 text-primary shrink-0 rounded-md border px-2.5 py-1 text-[0.7rem] font-semibold"
                >
                  MÁXIMO
                </button>
              </div>

              <p className="text-muted-foreground mt-4 text-xs">Chave Pix</p>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="E-mail, CPF/CNPJ, telefone ou chave aleatória"
                className="border-border bg-input focus-within:border-primary mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
              />

              <Button
                onClick={handleTransfer}
                disabled={submitting || !canWithdraw}
                className="mt-5 h-14 w-full gap-2 text-sm font-semibold"
              >
                <Zap className="size-4" />
                {submitting ? 'ENVIANDO...' : `TRANSFERIR ${formatCurrency(amount || 0)} VIA PIX`}
              </Button>

              <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
                <span className="inline-flex items-center gap-1">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Criptografia 256-bit
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="bg-primary size-1.5 rounded-full" />
                  Sem taxas adicionais
                </span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Withdrawals history */}
            <div className="border-border/60 bg-card/40 rounded-2xl border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-foreground text-lg font-semibold">
                    Histórico de Saques
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[0.7rem] font-medium">
                    {payouts.length} transações
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

              {payouts.length === 0 ? (
                <p className="text-muted-foreground mt-6 text-center text-sm">
                  Você ainda não solicitou nenhum saque.
                </p>
              ) : (
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
                      {payouts.map((p) => {
                        const meta = WITHDRAW_STATUS_META[p.status] ?? WITHDRAW_STATUS_META.analise
                        const isTransfer = p.status === 'transferido'
                        const created = new Date(p.created_at)
                        return (
                          <tr key={p.id} className="border-border/40 border-b last:border-0">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-2.5">
                                <span className={cn('size-2 shrink-0 rounded-full', meta.dot)} />
                                <div>
                                  <p className="text-foreground text-sm font-medium">
                                    {created.toLocaleDateString('pt-BR')}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {created.toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4">
                              <p className="text-foreground text-sm">{p.pix_key ?? '—'}</p>
                              <p className="text-muted-foreground text-xs">{p.reference}</p>
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
                                {formatCurrency(Number.parseFloat(p.amount))}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-border/40 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-muted-foreground text-xs">
                  Mostrando {payouts.length} de {payouts.length} transações
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
                    onClick={() => flash('Não há mais páginas')}
                    className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors"
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
                  {formatCurrency(summary.avgWithdraw)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">por transação</p>
              </div>
              <div className="border-border/60 bg-card/40 rounded-2xl border p-5">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Trophy className="size-4" />
                </span>
                <p className="text-muted-foreground mt-4 text-xs">Maior Saque</p>
                <p className="font-display text-primary mt-1 text-2xl font-semibold">
                  {formatCurrency(summary.biggestWithdraw)}
                </p>
              </div>
              <div className="border-border/60 bg-card/40 rounded-2xl border p-5">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Zap className="size-4" />
                </span>
                <p className="text-muted-foreground mt-4 text-xs">Total de Saques</p>
                <p className="font-display text-foreground mt-1 text-2xl font-semibold">
                  {payouts.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SupplierFooter />
    </div>
  )
}
