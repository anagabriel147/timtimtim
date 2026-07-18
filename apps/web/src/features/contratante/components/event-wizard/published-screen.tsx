'use client'

import { ArrowRight, CheckCircle2, PartyPopper } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { WizardFooter } from './wizard-footer'
import { WizardHeader } from './wizard-header'

export function PublishedScreen({
  displayName,
  onBack,
}: {
  displayName: string
  onBack: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <WizardHeader currentStep={4} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-16">
        <div className="border-primary/30 bg-card/40 w-full rounded-3xl border p-8 text-center md:p-12">
          <span className="bg-primary/15 text-primary mx-auto grid size-20 place-items-center rounded-3xl">
            <CheckCircle2 className="size-10" />
          </span>
          <p className="text-primary mt-6 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest">
            <PartyPopper className="size-3.5" />
            EVENTO PUBLICADO
          </p>
          <h1 className="font-display text-foreground mt-3 text-3xl font-bold tracking-tight text-balance">
            {displayName} está no ar!
          </h1>
          <p className="text-muted-foreground mt-3 text-sm text-pretty">
            O seu pedido foi enviado aos fornecedores correspondentes. Vai começar a receber
            propostas personalizadas em menos de 24 horas.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={onBack}
              className="h-12 w-full gap-2 px-6 text-sm font-semibold sm:w-auto"
            >
              Ir para o painel
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="border-border h-12 w-full border px-6 text-sm sm:w-auto"
            >
              Ver propostas recebidas
            </Button>
          </div>
        </div>
      </main>
      <WizardFooter />
    </div>
  )
}
