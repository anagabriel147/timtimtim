import { Check, Crown, Gift, Lock, RotateCcw, ShieldCheck, Star } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { BillingCycle, PlanData } from '../data/checkout-data'

export function PlanSummary({ plan, cycle }: { plan: PlanData; cycle: BillingCycle }) {
  const b = plan.billing[cycle]
  const isAnnual = cycle === 'anual'
  const isBrand = plan.headerVariant === 'brand'
  const isAssessor = plan.role === 'assessor'

  return (
    <div className="space-y-4">
      <section
        className={cn(
          'bg-card/40 rounded-3xl border p-6 md:p-8',
          isAnnual ? 'border-primary/40' : 'border-border',
        )}
      >
        {isBrand ? (
          /* brand header: icon + title + PRO badge */
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary grid size-12 shrink-0 place-items-center rounded-xl">
                <Crown className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-foreground text-2xl font-semibold tracking-tight">
                  {plan.name} <span className="text-primary">{plan.brand}</span>
                </h2>
                {plan.brandSubtitle && (
                  <p className="text-muted-foreground text-sm">{plan.brandSubtitle}</p>
                )}
              </div>
            </div>
            <span className="border-primary/40 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold">
              <Star className="size-3.5" />
              {plan.badgeLabel}
            </span>
          </div>
        ) : (
          <>
            {/* status row */}
            <div className="flex items-center justify-between gap-3">
              <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide">
                <Check className="size-3.5" strokeWidth={3} />
                {b.statusBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
                <Crown className="size-3.5" />
                {plan.badgeLabel}
              </span>
            </div>

            {/* title */}
            <h2 className="font-display text-foreground mt-6 text-3xl font-semibold tracking-tight">
              {plan.name}
            </h2>
            <p className="font-display text-primary mt-1 text-2xl font-semibold">
              {plan.brand}
              {b.cycleSuffix && (
                <span className="text-foreground text-lg font-medium">{b.cycleSuffix}</span>
              )}
            </p>
            <p className="text-muted-foreground mt-3 text-sm">{b.description}</p>
          </>
        )}

        {/* price */}
        {isAssessor ? (
          <div className="mt-6 flex flex-wrap items-end gap-x-1 gap-y-2">
            <span className="text-muted-foreground mb-2 text-lg">R$</span>
            <span className="font-display text-foreground text-6xl leading-none font-bold">
              {b.intPart}
            </span>
            <span className="text-foreground mb-1 text-2xl font-semibold">{b.cents}</span>
            <span className="text-muted-foreground mb-2 ml-1 text-sm">{b.period}</span>
            {isAnnual && (
              <span className="bg-primary/15 text-primary mb-2 ml-2 rounded-md px-2 py-0.5 text-xs font-semibold">
                {b.discountBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="border-border/70 bg-background/40 mt-6 rounded-2xl border p-5">
            {isAnnual && (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm line-through">{b.original}</span>
                <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-xs font-semibold">
                  {b.discountBadge}
                </span>
              </div>
            )}
            <div className="mt-1 flex items-end gap-1">
              <span className="text-muted-foreground mb-2 text-lg">R$</span>
              <span className="font-display text-foreground text-6xl leading-none font-bold">
                {b.intPart}
              </span>
              <span className="text-foreground mb-1 text-2xl font-semibold">{b.cents}</span>
              <span className="text-muted-foreground mb-2 ml-1 text-sm">{b.period}</span>
            </div>
            <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
              <span className="bg-primary size-1.5 rounded-full" aria-hidden="true" />
              {b.priceNote}
            </p>
          </div>
        )}

        {/* features */}
        <p className="text-muted-foreground mt-8 text-xs font-semibold tracking-widest">
          O QUE ESTÁ INCLUÍDO
        </p>
        <ul className={cn('mt-4', isAssessor ? 'divide-border/60 divide-y' : 'space-y-4')}>
          {plan.features.map((f) => (
            <li
              key={f.title}
              className={cn('flex items-start gap-3', isAssessor && 'py-4 first:pt-0 last:pb-0')}
            >
              <span
                className={cn(
                  'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                  f.gold ? 'bg-amber-500/15 text-amber-400' : 'bg-primary/15 text-primary',
                )}
                aria-hidden="true"
              >
                {f.gold ? (
                  <Crown className="size-3" />
                ) : (
                  <Check className="size-3" strokeWidth={3} />
                )}
              </span>
              <div>
                <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                  {f.title}
                  {f.tag && (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wide text-amber-400">
                      {f.tag}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-xs">{f.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* annual bonus box */}
        {isAnnual && b.bonus && (
          <div className="border-primary/30 bg-primary/5 mt-6 flex items-start gap-3 rounded-2xl border p-4">
            <span className="bg-primary/15 text-primary mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg">
              <Gift className="size-4" />
            </span>
            <div>
              <p className="text-primary text-sm font-medium">
                {b.bonus.title}
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  {b.bonus.tag}
                </span>
              </p>
              <p className="text-muted-foreground text-xs">{b.bonus.text}</p>
            </div>
          </div>
        )}

        {/* stats */}
        {plan.showStats && (
          <div className="border-border/60 mt-8 grid grid-cols-3 gap-4 border-t pt-6">
            {plan.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-foreground text-2xl font-bold">
                  {s.value}
                  {s.accent && <span className="text-primary">{s.accent}</span>}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* guarantee inside card (assessor) */}
        {isAssessor && (
          <div className="mt-6">
            <GuaranteeBox plan={plan} />
          </div>
        )}
      </section>

      {isAssessor ? (
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5">
            <Lock className="text-primary size-3.5" />
            Pagamento Seguro
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-foreground font-medium">Stripe</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            Cancele quando quiser
          </span>
        </div>
      ) : (
        <GuaranteeBox plan={plan} />
      )}
    </div>
  )
}

function GuaranteeBox({ plan }: { plan: PlanData }) {
  return (
    <div className="border-border bg-card/40 flex items-start gap-3 rounded-2xl border p-5">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
        <ShieldCheck className="size-4" />
      </span>
      <div>
        <p className="text-foreground text-sm font-medium">{plan.guarantee.title}</p>
        <p className="text-muted-foreground text-xs">{plan.guarantee.text}</p>
      </div>
    </div>
  )
}
