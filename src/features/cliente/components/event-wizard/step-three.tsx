'use client'

import {
  ArrowRight,
  Check,
  CircleHelp,
  SquarePen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SERVICE_CATEGORIES } from '../../data/wizard-data'
import { ICONS } from './icons'

export function StepThree(props: {
  eventName: string
  location: string
  eventLabel: string
  services: string[]
  toggleService: (id: string) => void
  observations: string
  setObservations: (v: string) => void
  onCancel: () => void
  onPublish: () => void
}) {
  const count = props.services.length
  const total = SERVICE_CATEGORIES.length
  const selectedLabels = SERVICE_CATEGORIES.filter((s) => props.services.includes(s.id)).map(
    (s) => s.label,
  )

  return (
    <div className="rounded-3xl border border-border bg-card/40">
      <div className="h-1 rounded-t-3xl bg-primary" />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            PASSO 3 DE 3 — O QUE PROCURA?
          </span>
          <span className="text-sm text-muted-foreground">
            {props.eventName} · {props.location}
          </span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Selecione os serviços
          <br />
          <span className="text-primary">que deseja contratar</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Escolha todas as categorias relevantes para o seu evento. Os fornecedores
          correspondentes receberão o seu pedido de proposta.
        </p>

        {/* counter */}
        <div className="mt-6 flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            Categorias seleccionadas
            <span
              className={cn(
                'grid size-6 place-items-center rounded-full text-xs font-semibold',
                count > 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
              )}
            >
              {count}
            </span>
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {count} / {total}
          </span>
        </div>

        {/* categories */}
        <p className="mt-8 text-xs font-semibold tracking-widest text-muted-foreground">
          CATEGORIAS DE SERVIÇO
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Sparkles
            const active = props.services.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => props.toggleService(cat.id)}
                className={cn(
                  'relative rounded-2xl border p-5 text-center transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background/40 hover:border-primary/40',
                )}
              >
                <span
                  className={cn(
                    'absolute right-3 top-3 grid size-5 place-items-center rounded-full border transition-colors',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {active && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span
                  className={cn(
                    'mx-auto grid size-12 place-items-center rounded-xl transition-colors',
                    active ? 'bg-primary/15 text-primary' : 'bg-secondary/60 text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{cat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>
              </button>
            )
          })}
        </div>

        {/* observations */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">
            OBSERVAÇÕES & RESTRIÇÕES
          </p>
          <span className="text-xs text-muted-foreground">{props.observations.length} / 500</span>
        </div>
        <div className="relative mt-3">
          <SquarePen className="absolute left-4 top-4 size-4 text-muted-foreground" />
          <textarea
            value={props.observations}
            maxLength={500}
            onChange={(e) => props.setObservations(e.target.value)}
            rows={4}
            placeholder="Ex: Precisamos de espaço para 250 convidados, restrições alimentares (vegetariano, sem glúten), cerimónia ao ar livre com chuva de pétala, acesso para cadeira de rodas..."
            className="w-full resize-none rounded-xl border border-input bg-background/40 py-4 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Quanto mais detalhe fornecer, mais precisas serão as propostas dos fornecedores.
        </p>

        {/* summary */}
        <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CircleHelp className="size-4 text-primary" />
            Resumo do pedido
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                EVENTO
              </p>
              <p className="mt-1 text-sm text-foreground">{props.eventLabel}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                LOCAL
              </p>
              <p className="mt-1 text-sm text-foreground">{props.location}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                CATEGORIAS
              </p>
              <p className="mt-1 text-sm text-foreground">
                {selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Nenhuma ainda'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-6">
        <Button
          variant="ghost"
          onClick={props.onCancel}
          className="h-12 border border-border px-6 text-sm"
        >
          Cancelar
        </Button>
        <div className="flex items-center gap-4">
          {count === 0 && (
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <CircleHelp className="size-3.5" />
              Selecione pelo menos 1 serviço
            </span>
          )}
          <Button
            onClick={props.onPublish}
            disabled={count === 0}
            className="h-12 gap-2 px-8 text-sm font-semibold"
          >
            Publicar Evento
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
