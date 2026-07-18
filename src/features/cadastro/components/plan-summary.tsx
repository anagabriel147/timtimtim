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
          'rounded-3xl border bg-card/40 p-6 md:p-8',
          isAnnual ? 'border-primary/40' : 'border-border',
        )}
      >
        {isBrand ? (
          /* brand header: icon + title + PRO badge */
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Crown className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {plan.name} <span className="text-primary">{plan.brand}</span>
                </h2>
                {plan.brandSubtitle && (
                  <p className="text-sm text-muted-foreground">{plan.brandSubtitle}</p>
                )}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Star className="size-3.5" />
              {plan.badgeLabel}
            </span>
          </div>
        ) : (
          <>
            {/* status row */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary">
                <Check className="size-3.5" strokeWidth={3} />
                {b.statusBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
                <Crown className="size-3.5" />
                {plan.badgeLabel}
              </span>
            </div>

            {/* title */}
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
              {plan.name}
            </h2>
            <p className="mt-1 font-display text-2xl font-semibold text-primary">
              {plan.brand}
              {b.cycleSuffix && (
                <span className="text-lg font-medium text-foreground">{b.cycleSuffix}</span>
              )}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{b.description}</p>
          </>
        )}

        {/* price */}
        {isAssessor ? (
          <div className="mt-6 flex flex-wrap items-end gap-x-1 gap-y-2">
            <span className="mb-2 text-lg text-muted-foreground">R$</span>
            <span className="font-display text-6xl font-bold leading-none text-foreground">
              {b.intPart}
            </span>
            <span className="mb-1 text-2xl font-semibold text-foreground">{b.cents}</span>
            <span className="mb-2 ml-1 text-sm text-muted-foreground">{b.period}</span>
            {isAnnual && (
              <span className="mb-2 ml-2 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                {b.discountBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-5">
            {isAnnual && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground line-through">{b.original}</span>
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                  {b.discountBadge}
                </span>
              </div>
            )}
            <div className="mt-1 flex items-end gap-1">
              <span className="mb-2 text-lg text-muted-foreground">R$</span>
              <span className="font-display text-6xl font-bold leading-none text-foreground">
                {b.intPart}
              </span>
              <span className="mb-1 text-2xl font-semibold text-foreground">{b.cents}</span>
              <span className="mb-2 ml-1 text-sm text-muted-foreground">{b.period}</span>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              {b.priceNote}
            </p>
          </div>
        )}

        {/* features */}
        <p className="mt-8 text-xs font-semibold tracking-widest text-muted-foreground">
          O QUE ESTÁ INCLUÍDO
        </p>
        <ul className={cn('mt-4', isAssessor ? 'divide-y divide-border/60' : 'space-y-4')}>
          {plan.features.map((f) => (
            <li
              key={f.title}
              className={cn(
                'flex items-start gap-3',
                isAssessor && 'py-4 first:pt-0 last:pb-0',
              )}
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
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {f.title}
                  {f.tag && (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wide text-amber-400">
                      {f.tag}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* annual bonus box */}
        {isAnnual && b.bonus && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <Gift className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-primary">
                {b.bonus.title}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {b.bonus.tag}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{b.bonus.text}</p>
            </div>
          </div>
        )}

        {/* stats */}
        {plan.showStats && (
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {plan.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {s.value}
                  {s.accent && <span className="text-primary">{s.accent}</span>}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
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
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-primary" />
            Pagamento Seguro
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-foreground">Stripe</span>
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
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/40 p-5">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
        <ShieldCheck className="size-4" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{plan.guarantee.title}</p>
        <p className="text-xs text-muted-foreground">{plan.guarantee.text}</p>
      </div>
    </div>
  )
}
