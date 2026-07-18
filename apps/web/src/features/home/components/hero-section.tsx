'use client'

import { useState } from 'react'

import { ChevronDown, MapPin, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { HERO } from '../data/home-data'

export function HeroSection({ onSearch }: { onSearch: () => void }) {
  const [type, setType] = useState<string>(HERO.vendorTypes[0])
  const [location, setLocation] = useState('')

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide">
          {HERO.badge}
        </span>

        <h1 className="font-display text-foreground mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-balance md:text-6xl">
          {HERO.titleLead} <span className="text-primary">{HERO.titleAccent}</span>
        </h1>

        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty">
          {HERO.subtitle}
        </p>
      </div>

      {/* search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
        className="border-border bg-card/60 mx-auto mt-9 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border p-3 md:flex-row md:items-center md:rounded-full"
      >
        <div className="relative flex-1">
          <label htmlFor="hero-type" className="sr-only">
            O que procura?
          </label>
          <select
            id="hero-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-secondary/40 text-foreground focus-visible:border-primary/50 h-12 w-full cursor-pointer appearance-none rounded-xl border border-transparent px-4 pr-10 text-sm outline-none md:rounded-full"
          >
            {HERO.vendorTypes.map((option) => (
              <option key={option} value={option} className="bg-card text-foreground">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
        </div>

        <span className="bg-border hidden h-8 w-px md:block" aria-hidden="true" />

        <div className="relative flex-1">
          <label htmlFor="hero-location" className="sr-only">
            Onde?
          </label>
          <MapPin className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lisboa, Porto, Braga..."
            className="bg-secondary/40 border-transparent pl-10 md:rounded-full"
          />
        </div>

        <Button
          type="submit"
          size="icon-lg"
          className="size-12 shrink-0 rounded-xl md:rounded-full"
        >
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
            <p className="text-muted-foreground mt-1 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
