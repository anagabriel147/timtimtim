'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  Layers,
  Lightbulb,
  MapPin,
  Music4,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Utensils,
  Wine,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MORE_VENDORS,
  RESULT_FILTERS,
  SORT_OPTIONS,
  VENDORS,
  type VendorCard,
} from '../data/marketplace-data'

const FILTER_ICONS = {
  camera: Camera,
  utensils: Utensils,
  sparkles: Sparkles,
  music: Music4,
  wine: Wine,
  lightbulb: Lightbulb,
} as const

export function SearchResults({ query }: { query: string }) {
  const router = useRouter()

  const [categories, setCategories] = useState(() =>
    RESULT_FILTERS.categories.map((c) => c.checked),
  )
  const [neighborhoods, setNeighborhoods] = useState(() =>
    RESULT_FILTERS.neighborhoods.map((n) => n.checked),
  )
  const [rating, setRating] = useState(
    RESULT_FILTERS.ratings.findIndex((r) => r.checked),
  )
  const [neighborhoodQuery, setNeighborhoodQuery] = useState('')
  const [sort, setSort] = useState(SORT_OPTIONS[0])
  const [sortOpen, setSortOpen] = useState(false)
  const [loadedMore, setLoadedMore] = useState(false)

  const vendors = useMemo<VendorCard[]>(
    () => (loadedMore ? [...VENDORS, ...MORE_VENDORS] : VENDORS),
    [loadedMore],
  )

  function clearAll() {
    setCategories(RESULT_FILTERS.categories.map(() => false))
    setNeighborhoods(RESULT_FILTERS.neighborhoods.map(() => false))
    setRating(-1)
    setNeighborhoodQuery('')
  }

  const filteredNeighborhoods = RESULT_FILTERS.neighborhoods.filter((n) =>
    n.label.toLowerCase().includes(neighborhoodQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-svh flex-col">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-6">
          <button
            type="button"
            onClick={() => router.push('/cliente/fornecedores')}
            className="flex items-center gap-2"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              TT
            </span>
            <span className="font-display text-lg font-bold text-foreground">TimTim</span>
          </button>

          <div className="relative mx-auto flex w-full max-w-2xl items-center">
            <Search className="absolute left-4 size-4 text-muted-foreground" />
            <input
              defaultValue={query}
              aria-label="Buscar fornecedores"
              className="h-11 w-full rounded-xl border border-border bg-secondary/40 pl-11 pr-24 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
              placeholder="Buscar fornecedores…"
            />
            <Button className="absolute right-1.5 h-8 px-4 text-xs font-semibold">Buscar</Button>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Entrar
            </button>
            <Image
              src="/images/home/avatar-client-2.png"
              alt="Perfil"
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-2 ring-border"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-8">
        {/* filters sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card/40 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Filtros</h2>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-primary transition-opacity hover:opacity-80"
              >
                Limpar tudo
              </button>
            </div>

            <FilterGroup icon={<Layers className="size-4" />} title="Categorias de Eventos">
              {RESULT_FILTERS.categories.map((c, i) => {
                const Icon = FILTER_ICONS[c.icon as keyof typeof FILTER_ICONS]
                return (
                  <CheckRow
                    key={c.label}
                    checked={categories[i]}
                    onToggle={() =>
                      setCategories((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                    count={c.count}
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    {c.label}
                  </CheckRow>
                )
              })}
            </FilterGroup>

            <FilterGroup icon={<MapPin className="size-4" />} title="Localização (Bairro)">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={neighborhoodQuery}
                  onChange={(e) => setNeighborhoodQuery(e.target.value)}
                  placeholder="Buscar bairro…"
                  className="h-9 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
                />
              </div>
              {filteredNeighborhoods.map((n) => {
                const realIndex = RESULT_FILTERS.neighborhoods.indexOf(n)
                return (
                  <CheckRow
                    key={n.label}
                    checked={neighborhoods[realIndex]}
                    onToggle={() =>
                      setNeighborhoods((prev) =>
                        prev.map((v, idx) => (idx === realIndex ? !v : v)),
                      )
                    }
                    count={n.count}
                  >
                    {n.label}
                  </CheckRow>
                )
              })}
            </FilterGroup>

            <FilterGroup icon={<Star className="size-4" />} title="Avaliação Mínima">
              {RESULT_FILTERS.ratings.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRating(i)}
                  className="flex w-full items-center gap-2.5 py-1.5 text-sm"
                >
                  <span
                    className={cn(
                      'grid size-4 shrink-0 place-items-center rounded-full border',
                      rating === i ? 'border-primary bg-primary' : 'border-border',
                    )}
                  >
                    {rating === i && <CheckCircle2 className="size-4 text-primary-foreground" />}
                  </span>
                  <span className="flex items-center">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={cn(
                          'size-3',
                          s < r.stars ? 'fill-primary text-primary' : 'text-muted-foreground/40',
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-foreground">{r.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{r.count}</span>
                </button>
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* results */}
        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-foreground">Resultados</h1>
              <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                {vendors.length === VENDORS.length ? '142' : '142'} fornecedores
              </span>
            </div>

            <div className="relative flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40"
              >
                {sort}
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              {sortOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Fechar"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setSortOpen(false)}
                  />
                  <ul className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          onClick={() => {
                            setSort(opt)
                            setSortOpen(false)
                          }}
                          className={cn(
                            'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary',
                            sort === opt ? 'text-primary' : 'text-foreground',
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
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {vendors.map((v) => (
              <ResultCard
                key={v.slug}
                vendor={v}
                onOpen={() => router.push(`/cliente/fornecedores/${v.slug}`)}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setLoadedMore(true)}
              disabled={loadedMore}
              className="gap-2 text-primary"
            >
              <RefreshCw className="size-4" />
              {loadedMore ? 'Todos os fornecedores carregados' : 'Carregar mais fornecedores'}
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 TIMTIM</span>
          <nav className="flex items-center gap-6">
            <span>Termos</span>
            <span>Privacidade</span>
            <span>Contato</span>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FilterGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mt-6 border-t border-border/50 pt-5 first-of-type:mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-2 text-primary">
          {icon}
          <span className="text-foreground">{title}</span>
        </span>
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !open && '-rotate-90')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function CheckRow({
  checked,
  onToggle,
  count,
  children,
}: {
  checked: boolean
  onToggle: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 py-1.5 text-sm text-foreground"
    >
      <span
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded border transition-colors',
          checked ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {checked && <CheckCircle2 className="size-3.5 text-primary-foreground" />}
      </span>
      <span className="flex flex-1 items-center gap-1.5">{children}</span>
      <span className="text-xs text-muted-foreground">{count}</span>
    </button>
  )
}

function ResultCard({ vendor, onOpen }: { vendor: VendorCard; onOpen: () => void }) {
  const Icon = FILTER_ICONS[vendor.categoryIcon as keyof typeof FILTER_ICONS] ?? Camera

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card/60 transition-colors hover:border-primary/40">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={vendor.cover || '/placeholder.svg'}
          alt={`Trabalho de ${vendor.name}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
          <Icon className="size-3.5 text-primary" />
          {vendor.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/85 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur-sm">
          <Star className="size-3 fill-primary text-primary" />
          {vendor.rating.toFixed(1)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">{vendor.name}</h3>
          {vendor.verified && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-primary">
              <CheckCircle2 className="size-3.5" />
              Verificado
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {vendor.location}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {vendor.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs text-primary"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {vendor.reviewAvatars.map((a, i) => (
                <Image
                  key={i}
                  src={a || '/placeholder-user.jpg'}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover ring-2 ring-card"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">+{vendor.reviews} avaliações</span>
          </div>
          <Button variant="outline" onClick={onOpen} className="h-9 gap-2 px-4 text-xs font-medium text-primary">
            Ver Perfil Completo
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
