import Link from 'next/link'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { cn } from '@/lib/utils'
import { Check, Lock, ShieldCheck } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Cadastro', done: true },
  { id: 2, label: 'Perfil', done: true },
  { id: 3, label: 'Assinatura', done: false },
] as const

export function CheckoutHeader({ variant = 'stepper' }: { variant?: 'stepper' | 'secure' }) {
  if (variant === 'secure') {
    return (
      <header className="w-full border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <Link href="/" aria-label="Ir para a página inicial da TimTim">
            <TimTimLogo />
          </Link>

          <span className="hidden items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-primary md:inline-flex">
            <Lock className="size-3.5" />
            CHECKOUT SEGURO
          </span>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              Já tem conta?{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              SSL 256-bit
            </span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="w-full border-b border-border/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="Ir para a página inicial da TimTim">
          <TimTimLogo />
        </Link>

        <nav aria-label="Progresso do cadastro" className="hidden items-center gap-3 md:flex">
          {STEPS.map((step, i) => {
            const isCurrent = !step.done && step.id === 3
            return (
              <div key={step.id} className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      'grid size-5 place-items-center rounded-full text-[0.65rem] font-semibold',
                      step.done
                        ? 'bg-primary/15 text-primary'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-muted-foreground',
                    )}
                  >
                    {step.done ? <Check className="size-3" strokeWidth={3} /> : step.id}
                  </span>
                  <span
                    className={cn(
                      step.done
                        ? 'text-muted-foreground'
                        : isCurrent
                          ? 'font-medium text-primary'
                          : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </span>
                {i < STEPS.length - 1 && (
                  <span className="h-px w-8 bg-border" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </nav>

        <span className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-primary" />
          Checkout Seguro
          <span className="hidden text-muted-foreground/60 sm:inline">· SSL 256-bit</span>
        </span>
      </div>
    </header>
  )
}
