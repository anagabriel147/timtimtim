'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Cake,
  Camera,
  Check,
  ChevronRight,
  Download,
  FileText,
  Flower2,
  Gavel,
  Gift,
  Hourglass,
  Lightbulb,
  Lock,
  MapPin,
  MessageSquare,
  Music4,
  ShieldCheck,
  Star,
} from 'lucide-react'

import { AppTopbar } from '@/components/layout/app-topbar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useContracts } from '../store/contracts-store'
import { PAYMENT_STATUS_META, SERVICE_STATUS_META } from '../data/contracts-data'

const CATEGORY_ICONS = {
  flower: Flower2,
  cake: Cake,
  music: Music4,
  lightbulb: Lightbulb,
  camera: Camera,
  gift: Gift,
  file: FileText,
} as const

const PAYMENT_ICONS = { lock: Lock, check: Check, hourglass: Hourglass, x: FileText } as const

// Mocked contract clauses shown on every contract detail (frontend-only prototype).
const CLAUSES = [
  {
    title: '1. Objeto do Contrato',
    body: 'O fornecedor compromete-se a prestar os serviços descritos na proposta aceita, na data e local do evento, conforme as especificações acordadas entre as partes.',
  },
  {
    title: '2. Pagamento e Escrow',
    body: 'Os valores são retidos em custódia (escrow) pela TimTim e liberados ao fornecedor conforme as etapas de confirmação do serviço, garantindo segurança para ambas as partes.',
  },
  {
    title: '3. Cancelamento e Reembolso',
    body: 'Cancelamentos com mais de 30 dias de antecedência garantem reembolso integral dos valores em custódia. Prazos menores seguem a política de reembolso proporcional da plataforma.',
  },
  {
    title: '4. Resolução de Disputas',
    body: 'Eventuais divergências serão mediadas pela arbitragem TimTim, com decisão vinculante para ambas as partes, mantendo o valor protegido até a resolução.',
  },
]

export function ContractDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { contracts } = useContracts()
  const [toast, setToast] = useState<string | null>(null)

  const flash = (msg: string) => {
    setToast(msg)
    window.clearTimeout((flash as unknown as { _t?: number })._t)
    ;(flash as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600)
  }

  const contract = contracts.find((c) => c.id === id)

  if (!contract) {
    return (
      <div className="min-h-svh bg-background">
        <AppTopbar activeLabel="Contratos" />
        <main className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-secondary/60 text-muted-foreground">
            <FileText className="size-7" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
            Contrato não encontrado
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Este contrato pode ter sido criado em outra sessão. Os contratos deste protótipo ficam
            em memória e são reiniciados ao recarregar a página.
          </p>
          <Button onClick={() => router.push('/cliente/contratos')} className="mt-6 gap-2">
            <ArrowLeft className="size-4" />
            Voltar aos contratos
          </Button>
        </main>
      </div>
    )
  }

  const c = contract
  const Icon = CATEGORY_ICONS[c.icon as keyof typeof CATEGORY_ICONS] ?? FileText
  const service = SERVICE_STATUS_META[c.serviceStatus]
  const payment = PAYMENT_STATUS_META[c.paymentStatus]
  const PaymentIcon = PAYMENT_ICONS[payment.icon as keyof typeof PAYMENT_ICONS]
  const cancelled = c.paymentStatus === 'cancelado'

  const timeline = [
    { label: 'Proposta aceita', caption: 'Contrato gerado automaticamente', done: true },
    {
      label: 'Pagamento em escrow',
      caption: c.receiptCaption,
      done: c.paymentStatus === 'garantido' || c.paymentStatus === 'quitado',
    },
    {
      label: 'Serviço realizado',
      caption: service.label,
      done: c.serviceStatus === 'concluido',
    },
    {
      label: 'Pagamento liberado',
      caption: c.paymentStatus === 'quitado' ? 'Concluído' : 'Após o evento',
      done: c.paymentStatus === 'quitado',
    },
  ]

  return (
    <div className="min-h-svh bg-background">
      <AppTopbar activeLabel="Contratos" />

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push('/cliente/contratos')}
            className="transition-colors hover:text-foreground"
          >
            Contratos
          </button>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{c.contractCode}</span>
        </nav>

        {/* header */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="relative shrink-0">
              <Image
                src={c.avatar || '/placeholder.svg'}
                alt={c.vendor}
                width={64}
                height={64}
                className="size-16 rounded-2xl object-cover"
              />
              <span className="absolute -bottom-1.5 -right-1.5 grid size-7 place-items-center rounded-lg bg-card text-primary">
                <Icon className="size-4" />
              </span>
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                {c.vendor}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.event} · {c.category} · Contrato {c.contractCode}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/cliente/contratos')}
            className="h-10 gap-2 px-4 text-sm"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        </div>

        {/* status badges */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
              service.bg,
              service.text,
            )}
          >
            <span className={cn('size-1.5 rounded-full', service.dot)} />
            Serviço: {service.label}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold',
              payment.bg,
              payment.text,
            )}
          >
            <PaymentIcon className="size-3.5" />
            {payment.label}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* left column */}
          <div className="space-y-6">
            {/* financial summary */}
            <section className="rounded-2xl border border-border bg-card/40 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Resumo Financeiro
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Valor do contrato</p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.installments}</p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/[0.05] p-4">
                  <p className="text-xs text-muted-foreground">Em custódia (escrow)</p>
                  <p className="mt-1 font-display text-2xl font-bold text-primary">
                    {c.receiptLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.receiptCaption}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Data do evento</p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">{c.date}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {c.location}
                  </p>
                </div>
              </div>
            </section>

            {/* timeline */}
            <section className="rounded-2xl border border-border bg-card/40 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Andamento do Contrato
              </h2>
              <ol className="mt-5 space-y-5">
                {timeline.map((step, i) => (
                  <li key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'grid size-7 place-items-center rounded-full border text-xs',
                          step.done
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground',
                        )}
                      >
                        {step.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      {i < timeline.length - 1 && (
                        <span
                          className={cn(
                            'mt-1 h-8 w-px',
                            step.done ? 'bg-primary/50' : 'bg-border',
                          )}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          step.done ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.caption}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* clauses */}
            <section className="rounded-2xl border border-border bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Cláusulas do Contrato
                </h2>
                <Button
                  variant="outline"
                  onClick={() => flash(`Abrindo contrato ${c.contractCode} em PDF...`)}
                  className="h-9 gap-2 px-3 text-xs"
                >
                  <Download className="size-3.5" />
                  Baixar PDF
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {CLAUSES.map((clause) => (
                  <div key={clause.title}>
                    <p className="text-sm font-semibold text-foreground">{clause.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {clause.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* right column */}
          <div className="space-y-6">
            {/* actions */}
            <section className="rounded-2xl border border-border bg-card/40 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Ações</h2>
              <div className="mt-4 space-y-3">
                {!cancelled && (
                  <Button
                    onClick={() => router.push('/cliente/mensagens')}
                    className="h-11 w-full justify-start gap-2 text-sm font-semibold"
                  >
                    <MessageSquare className="size-4" />
                    Conversar com o fornecedor
                  </Button>
                )}

                {!cancelled && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/cliente/avaliacoes/${id}`)}
                    className="h-11 w-full justify-start gap-2 text-sm"
                  >
                    <Star className="size-4" />
                    Avaliar fornecedor
                  </Button>
                )}

                {!cancelled && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/cliente/disputas/nova')}
                    className="h-11 w-full justify-start gap-2 text-sm"
                  >
                    <Gavel className="size-4" />
                    Abrir disputa
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => flash(`Abrindo contrato ${c.contractCode} em PDF...`)}
                  className="h-11 w-full justify-start gap-2 text-sm text-muted-foreground"
                >
                  <FileText className="size-4" />
                  Ver contrato em PDF
                </Button>
              </div>
            </section>

            {/* escrow note */}
            <section className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <p className="mt-3 font-semibold text-foreground">Pagamento protegido</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                O valor deste contrato fica em custódia pela TimTim e só é liberado ao fornecedor
                após a confirmação do serviço.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <span>TimTim · Plataforma de Eventos</span>
          <span>Termos · Privacidade · Suporte · © 2025</span>
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/40 bg-popover px-5 py-3 text-sm text-foreground shadow-xl"
        >
          <Check className="size-4 text-primary" strokeWidth={3} />
          {toast}
        </div>
      )}
    </div>
  )
}
