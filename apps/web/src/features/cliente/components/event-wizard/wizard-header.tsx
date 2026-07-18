'use client'

import { Check, CircleHelp, Save } from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { cn } from '@/lib/utils'

import { WIZARD_STEPS } from '../../data/wizard-data'

export function WizardHeader({ currentStep }: { currentStep: number }) {
  return (
    <header className="border-primary/70 border-border/60 bg-background/80 sticky top-0 z-40 w-full border-t-2 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <BrandMark size="md" />

        <ol className="hidden items-center gap-3 md:flex" aria-label="Progresso">
          {WIZARD_STEPS.map((s, i) => {
            const done = currentStep > s.id
            const active = currentStep === s.id
            return (
              <li key={s.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid size-7 place-items-center rounded-full text-xs font-semibold transition-colors',
                      done && 'bg-primary text-primary-foreground',
                      active && 'bg-primary text-primary-foreground ring-primary/20 ring-4',
                      !done &&
                        !active &&
                        'border-border bg-secondary/40 text-muted-foreground border',
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} /> : s.id}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      active ? 'text-primary font-medium' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <span
                    className={cn(
                      'h-0.5 w-12 rounded-full',
                      currentStep > s.id ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors"
          >
            <Save className="size-3.5" />
            <span className="hidden sm:inline">Guardar rascunho</span>
          </button>
          <span className="border-border text-muted-foreground grid size-8 place-items-center rounded-lg border">
            <CircleHelp className="size-4" />
          </span>
        </div>
      </div>
    </header>
  )
}
