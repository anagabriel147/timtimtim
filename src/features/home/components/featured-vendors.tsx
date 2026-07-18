'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FEATURED_VENDORS, type Vendor } from '../data/home-data'

export function FeaturedVendors() {
  return (
    <section id="fornecedores" className="border-t border-border/40 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
              FORNECEDORES EM DESTAQUE
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
              Os mais escolhidos este mês
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecionados pela comunidade com base em avaliações reais.
            </p>
          </div>
          <a
            href="#fornecedores"
            className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
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
    <article className="group overflow-hidden rounded-2xl border border-border bg-card/60 transition-colors hover:border-primary/40">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={vendor.image || '/placeholder.svg'}
          alt={`Trabalho de ${vendor.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-primary-foreground">
          {vendor.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
          <Star className="size-3 fill-primary text-primary" />
          {vendor.rating.toFixed(1)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{vendor.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {vendor.location}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({vendor.reviews} avaliações)</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={vendor.avatar || '/placeholder-user.jpg'}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <p className="text-[0.65rem] text-muted-foreground">{vendor.priceLabel}</p>
              <p className="font-display text-lg font-bold text-foreground">{vendor.price}</p>
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
