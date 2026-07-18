'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Calendar,
  FileText,
  Filter,
  Laptop,
  SendHorizonal,
  Shirt,
  SquarePen,
  TrendingUp,
  Users,
  Utensils,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  OPPORTUNITIES,
  STATS,
  SUPPLIER_MESSAGES,
  SUPPLIER_USER,
  type Opportunity,
} from '../data/supplier-data'

import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

const STAT_ICONS = {
  zap: Zap,
  file: FileText,
  currency: null,
} as const

const OPP_ICONS = {
  shirt: Shirt,
  utensils: Utensils,
  laptop: Laptop,
} as const

const TAG_STYLES: Record<Opportunity['tag'], string> = {
  URGENTE: 'border-destructive/40 bg-destructive/10 text-destructive',
  'ALTO VALOR': 'border-primary/40 bg-primary/10 text-primary',
  RECORRENTE: 'border-border bg-muted/40 text-muted-foreground',
}

export function SupplierDashboard() {
  const router = useRouter()
  const [draft, setDraft] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2400)
  }

  const unreadCount = SUPPLIER_MESSAGES.filter((m) => m.unread).length

  return (
    <div className="bg-background min-h-screen">
      <SupplierTopbar active="Início" onUnavailable={(l) => flash(`${l} em breve`)} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-3 py-1 text-xs font-semibold tracking-wider">
                {'• '}
                {SUPPLIER_USER.tier}
                {' •'}
              </span>
            </div>
            <h1 className="font-display text-foreground mt-4 text-4xl font-semibold tracking-tight text-balance">
              Bom dia, {SUPPLIER_USER.firstName}
            </h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Você tem{' '}
              <span className="text-foreground font-semibold">
                {SUPPLIER_USER.newOpportunities} novas oportunidades
              </span>{' '}
              aguardando sua proposta.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STATS.map((stat) => {
            const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS]
            return (
              <div
                key={stat.id}
                className="border-border/60 bg-card/40 hover:border-border rounded-2xl border p-6 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
                    {Icon ? (
                      <Icon className="size-5" />
                    ) : (
                      <span className="text-sm font-semibold">R$</span>
                    )}
                  </span>
                  <span className="border-border/60 text-muted-foreground rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider">
                    {stat.tag}
                  </span>
                </div>
                <p className="font-display text-foreground mt-6 text-5xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">{stat.label}</p>
                <p className="text-primary mt-4 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="size-3.5" />
                  {stat.trend}
                </p>
              </div>
            )
          })}
        </div>

        {/* Content grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* Opportunities */}
          <section className="border-border/60 bg-card/40 rounded-2xl border">
            <div className="border-border/60 flex items-center justify-between border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-foreground text-lg font-semibold">
                  Novas Oportunidades
                </h2>
                <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-xs font-semibold">
                  {SUPPLIER_USER.newOpportunities} novos
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  onClick={() => flash('Exibindo todas as oportunidades')}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Ver todos
                </button>
              </div>
            </div>

            <div className="divide-border/60 divide-y">
              {OPPORTUNITIES.map((op) => {
                const Icon = OPP_ICONS[op.icon as keyof typeof OPP_ICONS] ?? FileText
                return (
                  <article key={op.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <span className="bg-muted/50 text-muted-foreground grid size-11 shrink-0 place-items-center rounded-xl">
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-foreground font-semibold">{op.title}</h3>
                            <span
                              className={cn(
                                'rounded border px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wider',
                                TAG_STYLES[op.tag],
                              )}
                            >
                              {op.tag}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {op.company} · {op.location}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-foreground text-lg font-semibold">
                          {op.budget}
                        </p>
                        <p className="text-muted-foreground text-xs">Orçamento</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                      {op.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {op.expires}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          {op.proposals} propostas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => flash(`Abrindo detalhes de "${op.title}"`)}
                          className="h-9 px-4 text-xs"
                        >
                          Detalhes
                        </Button>
                        <Button
                          onClick={() => router.push(`/fornecedor/proposta/${op.id}`)}
                          className="h-9 px-4 text-xs font-semibold"
                        >
                          Enviar Proposta
                        </Button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Messages */}
          <section className="border-border/60 bg-card/40 flex flex-col rounded-2xl border">
            <div className="border-border/60 flex items-center justify-between border-b px-5 py-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-foreground text-lg font-semibold">Mensagens</h2>
                <span className="border-primary/40 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-xs font-semibold">
                  {unreadCount} novas
                </span>
              </div>
              <button
                type="button"
                aria-label="Nova mensagem"
                onClick={() => flash('Compositor de mensagem em breve')}
                className="border-border/60 text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-lg border transition-colors"
              >
                <SquarePen className="size-4" />
              </button>
            </div>

            <div className="divide-border/60 flex-1 divide-y overflow-y-auto">
              {SUPPLIER_MESSAGES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => flash(`Abrindo conversa com ${m.name}`)}
                  className="hover:bg-muted/30 flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"
                >
                  <Image
                    src={m.avatar || '/placeholder.svg'}
                    alt={m.name}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-foreground truncate text-sm font-semibold">{m.name}</p>
                      <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs">
                        {m.time}
                        {m.unread && <span className="bg-primary size-1.5 rounded-full" />}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">{m.company}</p>
                    <p className="text-muted-foreground/80 mt-0.5 truncate text-xs">{m.preview}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-border/60 border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!draft.trim()) return
                  flash('Mensagem enviada')
                  setDraft('')
                }}
                className="border-border/60 bg-background/60 flex items-center gap-2 rounded-xl border px-3 py-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Nova mensagem..."
                  className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  aria-label="Enviar mensagem"
                  className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-lg transition-opacity hover:opacity-90"
                >
                  <SendHorizonal className="size-4" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <SupplierFooter />

      {/* Toast */}
      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
