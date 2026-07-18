import Link from 'next/link'

import { Check, Lock, ShieldCheck } from 'lucide-react'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Cadastro', done: true },
  { id: 2, label: 'Perfil', done: true },
  { id: 3, label: 'Assinatura', done: false },
] as const

export function CheckoutHeader({ variant = 'stepper' }: { variant?: 'stepper' | 'secure' }) {
  if (variant === 'secure') {
    return (
      <header className="border-border/60 w-full border-b">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <Link href="/" aria-label="Ir para a página inicial da TimTim">
            <TimTimLogo />
          </Link>

          <span className="border-primary/40 bg-primary/10 text-primary hidden items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest md:inline-flex">
            <Lock className="size-3.5" />
            CHECKOUT SEGURO
          </span>

          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="hidden sm:inline">
              Já tem conta?{' '}
              <Link href="/" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="text-primary size-3.5" />
              SSL 256-bit
            </span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-border/60 w-full border-b">
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
                          : 'border-border text-muted-foreground border',
                    )}
                  >
                    {step.done ? <Check className="size-3" strokeWidth={3} /> : step.id}
                  </span>
                  <span
                    className={cn(
                      step.done
                        ? 'text-muted-foreground'
                        : isCurrent
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </span>
                {i < STEPS.length - 1 && <span className="bg-border h-px w-8" aria-hidden="true" />}
              </div>
            )
          })}
        </nav>

        <span className="border-border/60 text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
          <Lock className="text-primary size-3.5" />
          Checkout Seguro
          <span className="text-muted-foreground/60 hidden sm:inline">· SSL 256-bit</span>
        </span>
      </div>
    </header>
  )
}
