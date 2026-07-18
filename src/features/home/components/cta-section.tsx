'use client'

import { CircleHelp } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CtaSection({
  onCreateEvent,
  onExplore,
}: {
  onCreateEvent: () => void
  onExplore: () => void
}) {
  return (
    <section id="categorias" className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card/40 px-6 py-14 text-center md:py-16">
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
          COMECE HOJE
        </span>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl">
          O seu evento perfeito começa <span className="text-primary">aqui</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Crie o seu evento gratuitamente e receba propostas dos melhores fornecedores de Portugal
          em menos de 24 horas.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={onCreateEvent} className="h-12 px-6 text-sm font-semibold">
            Criar Evento Grátis
          </Button>
          <Button variant="outline" onClick={onExplore} className="h-12 px-6 text-sm">
            Explorar Fornecedores
          </Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CircleHelp className="size-3.5" />
          Sem cartão de crédito. 100% gratuito para clientes.
        </p>
      </div>
    </section>
  )
}
