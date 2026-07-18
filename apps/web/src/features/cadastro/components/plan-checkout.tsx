'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { CheckCircle2, Gift, HelpCircle, PartyPopper } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { getPlan, type BillingCycle, type PlanData } from '../data/checkout-data'

import { PaymentPanel } from './payment-panel'
import { PlanSummary } from './plan-summary'

export function PlanCheckout({ tipo }: { tipo?: string }) {
  const router = useRouter()
  const plan = getPlan(tipo)
  const [cycle, setCycle] = useState<BillingCycle>(plan.role === 'assessor' ? 'mensal' : 'anual')
  const [activated, setActivated] = useState(false)

  if (activated) {
    return <SuccessCard plan={plan} cycle={cycle} onContinue={() => router.push('/')} />
  }

  const { hero } = plan
  const isAssessor = plan.role === 'assessor'

  return (
    <div className="w-full">
      {/* hero */}
      <div className="flex flex-col items-center text-center">
        {hero.badgeAsPill ? (
          <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest">
            <HelpCircle className="size-3.5" />
            {hero.badge}
          </span>
        ) : (
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em]">
            {hero.badge} {cycle === 'anual' ? '· ANUAL' : '· MENSAL'}
          </p>
        )}
        <h1 className="font-display text-foreground mt-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {isAssessor ? (
            <>
              {hero.titleLead}
              <br />
              <span className="text-primary">{hero.titleAccent}</span>
            </>
          ) : (
            <>
              {hero.titleLead} <span className="text-primary">{hero.titleAccent}</span>
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm text-pretty md:text-base">
          {hero.subtitle}
        </p>
      </div>

      {/* billing toggle */}
      {isAssessor ? (
        <div className="mt-8 flex justify-center">
          <div className="border-border bg-card/60 inline-flex items-center gap-1 rounded-full border p-1">
            <button
              type="button"
              aria-pressed={cycle === 'mensal'}
              onClick={() => setCycle('mensal')}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-medium transition-colors',
                cycle === 'mensal'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Mensal
            </button>
            <button
              type="button"
              aria-pressed={cycle === 'anual'}
              onClick={() => setCycle('anual')}
              className={cn(
                'flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-colors',
                cycle === 'anual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Anual
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[0.6rem] leading-tight font-semibold',
                  cycle === 'anual'
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary/15 text-primary',
                )}
              >
                2 MESES GRÁTIS
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className={cn(
              'text-sm font-medium',
              cycle === 'mensal' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Mensal
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={cycle === 'anual'}
            aria-label="Alternar entre plano mensal e anual"
            onClick={() => setCycle((c) => (c === 'anual' ? 'mensal' : 'anual'))}
            className={cn(
              'relative h-7 w-12 rounded-full transition-colors',
              cycle === 'anual' ? 'bg-primary' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'bg-background absolute top-1 size-5 rounded-full transition-transform',
                cycle === 'anual' ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium',
              cycle === 'anual' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Anual
          </span>
          <span className="border-primary/40 bg-primary/10 text-primary ml-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <Gift className="size-3.5" />2 meses grátis
          </span>
        </div>
      )}
      <p className="text-muted-foreground mt-3 text-center text-xs">
        {plan.billing[cycle].priceNote}
      </p>

      {/* columns */}
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        <PlanSummary plan={plan} cycle={cycle} />
        <PaymentPanel plan={plan} cycle={cycle} onConfirm={() => setActivated(true)} />
      </div>
    </div>
  )
}

function SuccessCard({
  plan,
  cycle,
  onContinue,
}: {
  plan: PlanData
  cycle: BillingCycle
  onContinue: () => void
}) {
  const b = plan.billing[cycle]
  return (
    <div className="border-primary/40 bg-card/50 mx-auto w-full max-w-xl rounded-3xl border p-8 text-center md:p-12">
      <span className="bg-primary/15 text-primary mx-auto grid size-16 place-items-center rounded-full">
        <PartyPopper className="size-8" />
      </span>
      <h1 className="font-display text-foreground mt-6 text-3xl font-bold tracking-tight">
        {plan.successTitle}
      </h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm">{plan.successText}</p>

      <div className="border-border bg-background/40 mx-auto mt-6 flex max-w-sm items-center justify-between rounded-2xl border px-5 py-4 text-left">
        <div>
          <p className="text-muted-foreground text-xs">
            {plan.name} · {b.summaryTag}
          </p>
          <p className="text-foreground text-sm font-medium">Pago com sucesso</p>
        </div>
        <p className="font-display text-primary text-xl font-bold">{b.total}</p>
      </div>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
        {plan.successItems.map((item) => (
          <li key={item} className="text-muted-foreground flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-primary size-4" />
            {item}
          </li>
        ))}
      </ul>

      <Button onClick={onContinue} className="mt-8 h-12 px-8 text-sm font-semibold tracking-wide">
        Ir para o painel
      </Button>
    </div>
  )
}
