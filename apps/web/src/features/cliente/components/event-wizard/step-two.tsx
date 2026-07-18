'use client'

import { ArrowLeft, ArrowRight, Check, ChevronDown, Map } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { COUNTRIES, DISTRICTS, VENUE_STATUSES } from '../../data/wizard-data'

import { ICONS } from './icons'
import { FieldLabel, inputClass } from './wizard-field'

export function StepTwo(props: {
  eventName: string
  country: string
  setCountry: (v: string) => void
  district: string
  setDistrict: (v: string) => void
  city: string
  setCity: (v: string) => void
  venueName: string
  setVenueName: (v: string) => void
  address: string
  setAddress: (v: string) => void
  venueStatus: string
  setVenueStatus: (v: string) => void
  onBack: () => void
  onCancel: () => void
  onNext: () => void
}) {
  const selectClass = cn(inputClass, 'appearance-none pr-10')
  return (
    <div className="border-border bg-card/40 rounded-3xl border">
      <div className="bg-primary h-1 rounded-t-3xl" />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border-primary/40 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-semibold tracking-wide">
            PASSO 2 DE 3
          </span>
          <span className="text-muted-foreground text-sm">{props.eventName}</span>
        </div>

        <h1 className="font-display text-foreground mt-5 text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Onde será o<br />
          <span className="text-primary">seu evento?</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm">
          Defina a localização para que os fornecedores possam calcular deslocações e
          disponibilidade com precisão.
        </p>

        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel>PAÍS</FieldLabel>
              <div className="relative mt-3">
                <select
                  value={props.country}
                  onChange={(e) => props.setCountry(e.target.value)}
                  className={selectClass}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <FieldLabel>DISTRITO / REGIÃO</FieldLabel>
              <div className="relative mt-3">
                <Map className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                <select
                  value={props.district}
                  onChange={(e) => props.setDistrict(e.target.value)}
                  className={cn(selectClass, 'pl-11')}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>CIDADE / LOCALIDADE</FieldLabel>
            <input
              value={props.city}
              onChange={(e) => props.setCity(e.target.value)}
              placeholder="Ex: Lisboa"
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <FieldLabel>NOME DO LOCAL / ESPAÇO</FieldLabel>
              <span className="text-muted-foreground text-xs">{props.venueName.length} / 80</span>
            </div>
            <input
              value={props.venueName}
              maxLength={80}
              onChange={(e) => props.setVenueName(e.target.value)}
              placeholder="Ex: Quinta da Regaleira, Hotel Bairro Alto..."
              className={cn(inputClass, 'mt-3')}
            />
            <p className="text-muted-foreground mt-2 text-xs">
              Opcional se o espaço ainda não estiver confirmado.
            </p>
          </div>

          <div>
            <FieldLabel>MORADA / ENDEREÇO</FieldLabel>
            <input
              value={props.address}
              onChange={(e) => props.setAddress(e.target.value)}
              placeholder="Rua, número, código postal..."
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          <div className="bg-border/60 h-px" />

          <div>
            <FieldLabel>ESTADO DO LOCAL</FieldLabel>
            <p className="text-muted-foreground mt-1 text-xs">
              Indique se já tem um espaço confirmado ou se ainda está à procura.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {VENUE_STATUSES.map((status) => {
                const Icon = ICONS[status.icon] ?? Check
                const active = props.venueStatus === status.id
                const accentText =
                  status.accent === 'amber'
                    ? 'text-amber-400'
                    : status.accent === 'muted'
                      ? 'text-muted-foreground'
                      : 'text-primary'
                const accentBg =
                  status.accent === 'amber'
                    ? 'bg-amber-500/10'
                    : status.accent === 'muted'
                      ? 'bg-secondary/60'
                      : 'bg-primary/15'
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => props.setVenueStatus(status.id)}
                    className={cn(
                      'relative rounded-2xl border p-4 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background/40 hover:border-primary/40',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-3 right-3 grid size-5 place-items-center rounded-full border',
                        active ? 'border-primary' : 'border-border',
                      )}
                    >
                      {active && <span className="bg-primary size-2.5 rounded-full" />}
                    </span>
                    <span
                      className={cn(
                        'grid size-9 place-items-center rounded-lg',
                        accentBg,
                        accentText,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <p className="text-foreground mt-3 text-sm font-semibold">{status.label}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{status.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t p-6">
        <Button
          variant="ghost"
          onClick={props.onBack}
          className="border-border h-11 gap-2 border px-6 text-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={props.onCancel}
            className="border-border h-11 border px-6 text-sm"
          >
            Cancelar
          </Button>
          <Button onClick={props.onNext} className="h-11 gap-2 px-6 text-sm font-semibold">
            Avançar
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
