'use client'

import { ArrowRight, ChevronDown, ChevronUp, Clock, Save, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { EVENT_TYPES } from '../../data/wizard-data'

import { ICONS } from './icons'
import { FieldLabel, inputClass } from './wizard-field'

export function StepOne(props: {
  eventType: string
  setEventType: (v: string) => void
  name: string
  setName: (v: string) => void
  date: string
  setDate: (v: string) => void
  guests: number
  setGuests: (v: number) => void
  notes: string
  setNotes: (v: string) => void
  onCancel: () => void
  onNext: () => void
}) {
  return (
    <>
      <div className="mb-6">
        <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest">
          <Sparkles className="size-3.5" />
          NOVO EVENTO
        </p>
        <h1 className="font-display text-foreground mt-2 text-4xl font-bold tracking-tight text-balance">
          Criar o seu <span className="text-primary">Grande Dia</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Preencha os detalhes abaixo para começar a receber propostas dos melhores fornecedores.
        </p>
      </div>

      <div className="border-border bg-card/40 rounded-3xl border">
        {/* card step header */}
        <div className="border-border/60 border-b p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-full text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-primary text-xs font-semibold tracking-widest">PASSO 1 DE 3</p>
                <p className="font-display text-foreground text-lg font-semibold">O Grande Dia</p>
              </div>
            </div>
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Clock className="size-3.5" />
              ~2 min para completar
            </span>
          </div>

          <div className="border-border/60 mt-5 grid grid-cols-3 border-b text-center text-sm">
            {['O Grande Dia', 'Detalhes', 'Confirmação'].map((tab, i) => (
              <span
                key={tab}
                className={cn(
                  'pb-3',
                  i === 0
                    ? 'border-primary text-primary border-b-2 font-medium'
                    : 'text-muted-foreground',
                )}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {/* Tipo de evento */}
          <div>
            <FieldLabel required>Tipo de Evento</FieldLabel>
            <p className="text-muted-foreground mt-1 text-xs">
              Selecione a categoria que melhor descreve o seu evento.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {EVENT_TYPES.map((type) => {
                const Icon = ICONS[type.icon] ?? Sparkles
                const active = props.eventType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => props.setEventType(type.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                    <span className={cn(active && 'text-foreground')}>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-border/60 h-px" />

          {/* Nome do evento */}
          <div>
            <FieldLabel required>Nome do Evento</FieldLabel>
            <p className="text-muted-foreground mt-1 text-xs">
              Um nome descritivo para identificar o seu evento.
            </p>
            <input
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
              placeholder="Ex: Casamento de Ana & Pedro"
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          {/* Data + convidados */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel required>Data do Evento</FieldLabel>
              <p className="text-muted-foreground mt-1 text-xs">Quando está previsto o evento?</p>
              <input
                type="date"
                value={props.date}
                onChange={(e) => props.setDate(e.target.value)}
                className={cn(inputClass, 'mt-3 [color-scheme:dark]')}
              />
            </div>
            <div>
              <FieldLabel required>Número Estimado de Convidados</FieldLabel>
              <p className="text-muted-foreground mt-1 text-xs">
                Uma estimativa é suficiente por agora.
              </p>
              <div className="relative mt-3">
                <input
                  type="number"
                  min={1}
                  value={props.guests}
                  onChange={(e) => props.setGuests(Number(e.target.value))}
                  className={cn(inputClass, 'pr-12')}
                />
                <div className="absolute top-1/2 right-2 flex -translate-y-1/2 flex-col">
                  <button
                    type="button"
                    aria-label="Aumentar convidados"
                    onClick={() => props.setGuests(props.guests + 10)}
                    className="text-muted-foreground hover:text-foreground grid size-5 place-items-center rounded"
                  >
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Diminuir convidados"
                    onClick={() => props.setGuests(Math.max(1, props.guests - 10))}
                    className="text-muted-foreground hover:text-foreground grid size-5 place-items-center rounded"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <FieldLabel optional>Notas Adicionais</FieldLabel>
            <p className="text-muted-foreground mt-1 text-xs">
              Partilhe detalhes especiais ou requisitos específicos.
            </p>
            <textarea
              value={props.notes}
              onChange={(e) => props.setNotes(e.target.value)}
              rows={4}
              placeholder="Ex: Precisamos de um espaço ao ar livre com capacidade para dança..."
              className="border-input bg-background/40 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/20 mt-3 w-full resize-none rounded-xl border p-4 text-sm transition-colors outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* footer */}
        <div className="border-border/60 flex flex-col items-center justify-between gap-4 border-t p-6 sm:flex-row">
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <Save className="size-3.5" />O rascunho é guardado automaticamente
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={props.onCancel}
              className="border-border h-11 border px-6 text-sm"
            >
              Cancelar
            </Button>
            <Button onClick={props.onNext} className="h-11 gap-2 px-6 text-sm font-semibold">
              Próximo Passo
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
