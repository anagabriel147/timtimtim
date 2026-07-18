import { FileText, MessageSquare, ShieldCheck } from 'lucide-react'

import { HOW_IT_WORKS } from '../data/home-data'

const ICONS = [FileText, MessageSquare, ShieldCheck]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-border/40 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
          COMO FUNCIONA
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Simples. Rápido. Sem complicações.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Desde a ideia ao evento perfeito em apenas três passos.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3">
        {HOW_IT_WORKS.map((item, i) => {
          const Icon = ICONS[i]
          return (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <span className="relative grid size-16 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-primary">
                <Icon className="size-6" />
                <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
