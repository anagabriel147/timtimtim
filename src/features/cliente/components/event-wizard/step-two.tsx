'use client'

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Map,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { COUNTRIES, DISTRICTS, VENUE_STATUSES } from '../../data/wizard-data'
import { FieldLabel, inputClass } from './wizard-field'
import { ICONS } from './icons'

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
    <div className="rounded-3xl border border-border bg-card/40">
      <div className="h-1 rounded-t-3xl bg-primary" />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            PASSO 2 DE 3
          </span>
          <span className="text-sm text-muted-foreground">{props.eventName}</span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Onde será o<br />
          <span className="text-primary">seu evento?</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <FieldLabel>DISTRITO / REGIÃO</FieldLabel>
              <div className="relative mt-3">
                <Map className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
              <span className="text-xs text-muted-foreground">{props.venueName.length} / 80</span>
            </div>
            <input
              value={props.venueName}
              maxLength={80}
              onChange={(e) => props.setVenueName(e.target.value)}
              placeholder="Ex: Quinta da Regaleira, Hotel Bairro Alto..."
              className={cn(inputClass, 'mt-3')}
            />
            <p className="mt-2 text-xs text-muted-foreground">
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

          <div className="h-px bg-border/60" />

          <div>
            <FieldLabel>ESTADO DO LOCAL</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
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
                        'absolute right-3 top-3 grid size-5 place-items-center rounded-full border',
                        active ? 'border-primary' : 'border-border',
                      )}
                    >
                      {active && <span className="size-2.5 rounded-full bg-primary" />}
                    </span>
                    <span className={cn('grid size-9 place-items-center rounded-lg', accentBg, accentText)}>
                      <Icon className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-foreground">{status.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{status.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-6">
        <Button
          variant="ghost"
          onClick={props.onBack}
          className="h-11 gap-2 border border-border px-6 text-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={props.onCancel}
            className="h-11 border border-border px-6 text-sm"
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
