'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Lock,
  MapPin,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useChat } from '@/features/mensagens'
import { VENDOR_PROFILE } from '../data/marketplace-data'
import { QuoteRequestModal } from './quote-request-modal'

const p = VENDOR_PROFILE
const CONVERSATION_ID = 'guto'

export function VendorProfile() {
  const router = useRouter()
  const { sendContactRequest, setActiveId } = useChat()
  const [saved, setSaved] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [contactRequested, setContactRequested] = useState(false)

  const handleContact = () => {
    sendContactRequest(CONVERSATION_ID)
    setContactRequested(true)
    setActiveId(CONVERSATION_ID)
    router.push('/cliente/mensagens')
  }
  const [showAllReviews, setShowAllReviews] = useState(false)

  const visibleReviews = showAllReviews ? p.reviews : p.reviews.slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => router.push('/cliente/fornecedores')} className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                TT
              </span>
              <span className="font-display text-lg font-bold text-foreground">TimTim</span>
            </button>
            <nav className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              {p.breadcrumb.map((b, i) => (
                <span key={b} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight className="size-3.5" />}
                  <button
                    type="button"
                    onClick={() => i < 2 && router.push('/cliente/fornecedores/busca')}
                    className={cn(i === p.breadcrumb.length - 1 ? 'text-foreground' : 'hover:text-foreground')}
                  >
                    {b}
                  </button>
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setSaved((v) => !v)}
              className={cn('h-9 gap-2 px-4 text-sm', saved && 'border-primary/50 text-primary')}
            >
              <Heart className={cn('size-4', saved && 'fill-primary')} />
              {saved ? 'Favorito' : 'Favorito'}
            </Button>
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

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        {/* left column */}
        <div className="space-y-6">
          <HeaderCard />
          <PortfolioCard />
          <AboutCard />
          <ReviewsCard
            reviews={visibleReviews}
            showAll={showAllReviews}
            onToggle={() => setShowAllReviews((v) => !v)}
          />
        </div>

        {/* right column */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.serviceArea.title}</p>
                <p className="text-xs text-muted-foreground">{p.serviceArea.subtitle}</p>
              </div>
            </div>





            <Button
              onClick={() => setQuoteOpen(true)}
              className="mt-4 h-12 w-full gap-2 text-sm font-semibold"
            >
              <Send className="size-4" />
              Solicitar Orçamento para o Meu Evento
            </Button>


            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="size-3" />
              Seus dados estão seguros. Sem compromisso.
            </p>
          </div>

          {/* verified */}
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <BadgeCheck className="size-5 text-primary" />
              {p.verified.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {p.verified.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* others */}
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Sparkles className="size-5 text-primary" />
              Outros Fornecedores
            </h3>
            <ul className="mt-4 space-y-2">
              {p.others.items.map((o) => (
                <li key={o.name}>
                  <button
                    type="button"
                    onClick={() => router.push('/cliente/fornecedores/busca')}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary/60"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{o.name}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-primary text-primary" />
                        {o.rating.toFixed(1)} · {o.location}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              onClick={() => router.push('/cliente/fornecedores/busca')}
              className="mt-3 w-full text-sm text-primary"
            >
              Ver todos os decoradores
            </Button>
          </div>
        </aside>
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

      <QuoteRequestModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  )
}

function HeaderCard() {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="flex flex-wrap gap-2">
        {p.tags.slice(0, 1).map((t) => (
          <span
            key={t.label}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
          >
            {t.icon === 'shield' ? <ShieldCheck className="size-3.5" /> : <Sparkles className="size-3.5" />}
            {t.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-foreground text-balance">
            {p.name}
            <BadgeCheck className="size-6 text-primary" />
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {p.location}
            </span>
            <span>·</span>
            <span>{p.since}</span>
            <span>·</span>
            <span className="text-primary">{p.responseTime}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/50 px-5 py-3 text-center">
          <p className="font-display text-2xl font-bold text-foreground">{p.rating.toFixed(1)}</p>
          <div className="my-1 flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{p.reviewsCount} Avaliações</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {p.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-background/40 p-4 text-center">
            <p className="font-display text-xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioCard() {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Sparkles className="size-5 text-primary" />
          Portfólio
        </h2>
        <span className="text-xs text-muted-foreground">{p.portfolio.total}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image src={p.portfolio.images[0] || '/placeholder.svg'} alt="Trabalho em destaque" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="grid gap-3">
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
            <Image src={p.portfolio.images[1] || '/placeholder.svg'} alt="Trabalho do portfólio" fill sizes="50vw" className="object-cover" />
          </div>
          <button
            type="button"
            className="group relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/40 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            <span className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
              <Image src={p.portfolio.images[0] || '/placeholder.svg'} alt="" fill sizes="50vw" className="object-cover" />
            </span>
            <span className="relative">{p.portfolio.extraCount}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.portfolio.tags.map((t) => (
          <span key={t} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function AboutCard() {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Quote className="size-5 text-primary" />
        Sobre Nós
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {p.about.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <h3 className="mt-6 font-display text-base font-semibold text-foreground">Nossos Serviços</h3>
      <ul className="mt-3 space-y-3">
        {p.about.services.map((s) => (
          <li key={s.title} className="flex gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReviewsCard({
  reviews,
  showAll,
  onToggle,
}: {
  reviews: typeof VENDOR_PROFILE.reviews
  showAll: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Quote className="size-5 text-primary" />
          Depoimentos de Clientes
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-primary text-primary" />
            ))}
          </span>
          {p.reviewsCount} avaliações
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-xl border border-border/60 bg-background/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image src={r.avatar || '/placeholder-user.jpg'} alt={r.name} width={40} height={40} className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3 fill-primary text-primary" />
                      ))}
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[0.65rem] text-primary">
                      {r.tag}
                    </span>
                  </div>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">{`"${r.text}"`}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <Button variant="outline" onClick={onToggle} className="gap-2 text-sm text-primary">
          {showAll ? 'Ver menos avaliações' : 'Ver mais avaliações'}
        </Button>
      </div>
    </div>
  )
}
