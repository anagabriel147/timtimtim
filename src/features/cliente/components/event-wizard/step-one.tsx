'use client'

import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Save,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EVENT_TYPES } from '../../data/wizard-data'
import { FieldLabel, inputClass } from './wizard-field'
import { ICONS } from './icons'

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
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary">
          <Sparkles className="size-3.5" />
          NOVO EVENTO
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground text-balance">
          Criar o seu <span className="text-primary">Grande Dia</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha os detalhes abaixo para começar a receber propostas dos melhores fornecedores.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/40">
        {/* card step header */}
        <div className="border-b border-border/60 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="text-xs font-semibold tracking-widest text-primary">PASSO 1 DE 3</p>
                <p className="font-display text-lg font-semibold text-foreground">O Grande Dia</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              ~2 min para completar
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 border-b border-border/60 text-center text-sm">
            {['O Grande Dia', 'Detalhes', 'Confirmação'].map((tab, i) => (
              <span
                key={tab}
                className={cn(
                  'pb-3',
                  i === 0
                    ? 'border-b-2 border-primary font-medium text-primary'
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
            <p className="mt-1 text-xs text-muted-foreground">
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

          <div className="h-px bg-border/60" />

          {/* Nome do evento */}
          <div>
            <FieldLabel required>Nome do Evento</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
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
              <p className="mt-1 text-xs text-muted-foreground">Quando está previsto o evento?</p>
              <input
                type="date"
                value={props.date}
                onChange={(e) => props.setDate(e.target.value)}
                className={cn(inputClass, 'mt-3 [color-scheme:dark]')}
              />
            </div>
            <div>
              <FieldLabel required>Número Estimado de Convidados</FieldLabel>
              <p className="mt-1 text-xs text-muted-foreground">
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
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col">
                  <button
                    type="button"
                    aria-label="Aumentar convidados"
                    onClick={() => props.setGuests(props.guests + 10)}
                    className="grid size-5 place-items-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Diminuir convidados"
                    onClick={() => props.setGuests(Math.max(1, props.guests - 10))}
                    className="grid size-5 place-items-center rounded text-muted-foreground hover:text-foreground"
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
            <p className="mt-1 text-xs text-muted-foreground">
              Partilhe detalhes especiais ou requisitos específicos.
            </p>
            <textarea
              value={props.notes}
              onChange={(e) => props.setNotes(e.target.value)}
              rows={4}
              placeholder="Ex: Precisamos de um espaço ao ar livre com capacidade para dança..."
              className="mt-3 w-full resize-none rounded-xl border border-input bg-background/40 p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 p-6 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="size-3.5" />
            O rascunho é guardado automaticamente
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={props.onCancel}
              className="h-11 border border-border px-6 text-sm"
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
