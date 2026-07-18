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
import {
  CATEGORY_OPTIONS,
  CITY_OPTIONS,
  LANDING,
  QUICK_CATEGORIES,
} from '../data/marketplace-data'

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
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center md:py-28">
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground text-balance md:text-6xl">
          {LANDING.titleLead}{' '}
          <span className="text-primary">{LANDING.titleAccent}</span> {LANDING.titleTail}
        </h1>

        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {LANDING.subtitle}
        </p>

        {/* search card */}
        <div className="mt-10 w-full rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <SelectField
              icon={<Layers className="size-4 text-primary" />}
              label="CATEGORIA"
              placeholder="Selecione o serviço"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
            />
            <SelectField
              icon={<MapPin className="size-4 text-primary" />}
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

          <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
              {LANDING.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-primary">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
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
                <span className="grid size-14 place-items-center rounded-full border border-primary/40 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{LANDING.quickCaption}</p>
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
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:border-primary/40"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon}
        <span className="flex-1">
          <span className="block text-[0.6rem] font-semibold tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className={cn('block text-sm', value ? 'text-foreground' : 'text-muted-foreground')}>
            {value || placeholder}
          </span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
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
            className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl"
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
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary',
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
