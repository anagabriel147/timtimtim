'use client'

import { useState } from 'react'
import { ChevronDown, MapPin, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HERO } from '../data/home-data'

export function HeroSection({ onSearch }: { onSearch: () => void }) {
  const [type, setType] = useState(HERO.vendorTypes[0])
  const [location, setLocation] = useState('')

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
          {HERO.badge}
        </span>

        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground text-balance md:text-6xl">
          {HERO.titleLead} <span className="text-primary">{HERO.titleAccent}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          {HERO.subtitle}
        </p>
      </div>

      {/* search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
        className="mx-auto mt-9 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card/60 p-3 md:flex-row md:items-center md:rounded-full"
      >
        <div className="relative flex-1">
          <label htmlFor="hero-type" className="sr-only">
            O que procura?
          </label>
          <select
            id="hero-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-transparent bg-secondary/40 px-4 pr-10 text-sm text-foreground outline-none focus-visible:border-primary/50 md:rounded-full"
          >
            {HERO.vendorTypes.map((option) => (
              <option key={option} value={option} className="bg-card text-foreground">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <span className="hidden h-8 w-px bg-border md:block" aria-hidden="true" />

        <div className="relative flex-1">
          <label htmlFor="hero-location" className="sr-only">
            Onde?
          </label>
          <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lisboa, Porto, Braga..."
            className="border-transparent bg-secondary/40 pl-10 md:rounded-full"
          />
        </div>

        <Button type="submit" size="icon-lg" className="size-12 shrink-0 rounded-xl md:rounded-full">
          <Search className="size-5" />
          <span className="sr-only">Pesquisar</span>
        </Button>
      </form>

      {/* stats */}
      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
        {HERO.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className={`font-display text-3xl font-bold ${
                'accent' in stat && stat.accent ? 'text-primary' : 'text-foreground'
              }`}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
