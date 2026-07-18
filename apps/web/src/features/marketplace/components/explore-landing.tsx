'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  ChevronDown,
  Image as ImageIcon,
  Layers,
  MapPin,
  Music4,
  Search,
  Sparkles,
  Utensils,
  Wine,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { CATEGORY_OPTIONS, CITY_OPTIONS, LANDING, QUICK_CATEGORIES } from '../data/marketplace-data'

const QUICK_ICONS = {
  image: ImageIcon,
  utensils: Utensils,
  sparkles: Sparkles,
  music: Music4,
  wine: Wine,
} as const

export function ExploreLanding() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  function goToResults(preset?: string) {
    const params = new URLSearchParams()
    if (preset ?? category) params.set('categoria', preset ?? category)
    if (city) params.set('cidade', city)
    router.push(`/cliente/fornecedores/busca?${params.toString()}`)
  }

  return (
    <main className="relative flex-1 overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center md:py-28">
        <h1 className="font-display text-foreground mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
          {LANDING.titleLead} <span className="text-primary">{LANDING.titleAccent}</span>{' '}
          {LANDING.titleTail}
        </h1>

        <p className="text-muted-foreground mt-5 max-w-xl leading-relaxed text-pretty">
          {LANDING.subtitle}
        </p>

        {/* search card */}
        <div className="border-border bg-card/60 mt-10 w-full rounded-3xl border p-4 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <SelectField
              icon={<Layers className="text-primary size-4" />}
              label="CATEGORIA"
              placeholder="Selecione o serviço"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
            />
            <SelectField
              icon={<MapPin className="text-primary size-4" />}
              label="LOCALIZAÇÃO"
              placeholder="Selecione a cidade"
              value={city}
              options={CITY_OPTIONS}
              onChange={setCity}
            />
            <Button
              onClick={() => goToResults()}
              className="h-auto gap-2 px-6 py-4 text-sm font-semibold md:py-0"
            >
              <Search className="size-4" />
              Buscar Fornecedores
            </Button>
          </div>

          <div className="border-border/60 mt-5 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
              {LANDING.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="font-display text-primary text-lg font-bold">{s.value}</span>
                  <span className="text-muted-foreground text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* quick categories */}
        <div className="mt-12 flex flex-wrap items-start justify-center gap-6 md:gap-10">
          {QUICK_CATEGORIES.map((c) => {
            const Icon = QUICK_ICONS[c.icon as keyof typeof QUICK_ICONS]
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => goToResults(c.label)}
                className="group flex flex-col items-center gap-2"
              >
                <span className="border-primary/40 text-primary group-hover:bg-primary group-hover:text-primary-foreground grid size-14 place-items-center rounded-full border transition-all">
                  <Icon className="size-5" />
                </span>
                <span className="text-muted-foreground group-hover:text-foreground text-xs transition-colors">
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-muted-foreground mt-6 text-xs">{LANDING.quickCaption}</p>
      </div>
    </main>
  )
}

function SelectField({
  icon,
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  placeholder: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-border bg-background/60 hover:border-primary/40 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon}
        <span className="flex-1">
          <span className="text-muted-foreground block text-[0.6rem] font-semibold tracking-widest">
            {label}
          </span>
          <span
            className={cn('block text-sm', value ? 'text-foreground' : 'text-muted-foreground')}
          >
            {value || placeholder}
          </span>
        </span>
        <ChevronDown className="text-muted-foreground size-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="border-border bg-popover absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border p-1.5 shadow-xl"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === opt}
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={cn(
                    'hover:bg-secondary w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    value === opt ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
