import { FileText, MessageSquare, ShieldCheck } from 'lucide-react'

import { HOW_IT_WORKS } from '../data/home-data'

const ICONS = [FileText, MessageSquare, ShieldCheck]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-border/40 border-t px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
          COMO FUNCIONA
        </span>
        <h2 className="font-display text-foreground mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Simples. Rápido. Sem complicações.
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Desde a ideia ao evento perfeito em apenas três passos.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3">
        {HOW_IT_WORKS.map((item, i) => {
          const Icon = ICONS[i]
          return (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <span className="border-primary/40 bg-primary/10 text-primary relative grid size-16 place-items-center rounded-2xl border">
                <Icon className="size-6" />
                <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 grid size-6 place-items-center rounded-full text-xs font-bold">
                  {item.step}
                </span>
              </span>
              <h3 className="font-display text-foreground mt-5 text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
