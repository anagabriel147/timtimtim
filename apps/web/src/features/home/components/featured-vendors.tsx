'use client'

import { useState } from 'react'

import Image from 'next/image'

import { MapPin, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { FEATURED_VENDORS, type Vendor } from '../data/home-data'

export function FeaturedVendors() {
  return (
    <section id="fornecedores" className="border-border/40 border-t px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
              FORNECEDORES EM DESTAQUE
            </span>
            <h2 className="font-display text-foreground mt-4 text-3xl font-bold tracking-tight">
              Os mais escolhidos este mês
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Selecionados pela comunidade com base em avaliações reais.
            </p>
          </div>
          <a
            href="#fornecedores"
            className="text-primary text-sm font-medium transition-opacity hover:opacity-80"
          >
            Ver todos →
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURED_VENDORS.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  )
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="border-border bg-card/60 hover:border-primary/40 group overflow-hidden rounded-2xl border transition-colors">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={vendor.image || '/placeholder.svg'}
          alt={`Trabalho de ${vendor.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-md px-2.5 py-1 text-[0.65rem] font-bold tracking-wide">
          {vendor.category}
        </span>
        <span className="bg-background/85 text-foreground absolute top-3 right-3 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold backdrop-blur-sm">
          <Star className="fill-primary text-primary size-3" />
          {vendor.rating.toFixed(1)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-foreground text-lg font-semibold">{vendor.name}</h3>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
          <MapPin className="size-3.5" />
          {vendor.location}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-primary text-primary size-3.5" />
            ))}
          </div>
          <span className="text-muted-foreground text-xs">({vendor.reviews} avaliações)</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={vendor.avatar || '/placeholder-user.jpg'}
              alt=""
              width={36}
              height={36}
              className="ring-border size-9 rounded-full object-cover ring-2"
            />
            <div>
              <p className="text-muted-foreground text-[0.65rem]">{vendor.priceLabel}</p>
              <p className="font-display text-foreground text-lg font-bold">{vendor.price}</p>
            </div>
          </div>
          <Button
            variant={saved ? 'default' : 'outline'}
            onClick={() => setSaved((s) => !s)}
            className={cn('h-9 px-4 text-xs font-medium', !saved && 'text-primary')}
          >
            {saved ? 'Salvo ✓' : 'Ver Perfil'}
          </Button>
        </div>
      </div>
    </article>
  )
}
