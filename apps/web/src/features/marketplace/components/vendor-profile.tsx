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
import { useChat } from '@/features/mensagens'
import { cn } from '@/lib/utils'

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
    router.push('/contratante/mensagens')
  }
  const [showAllReviews, setShowAllReviews] = useState(false)

  const visibleReviews = showAllReviews ? p.reviews : p.reviews.slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col">
      {/* topbar */}
      <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/contratante/fornecedores')}
              className="flex items-center gap-2"
            >
              <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg text-sm font-bold">
                TT
              </span>
              <span className="font-display text-foreground text-lg font-bold">TimTim</span>
            </button>
            <nav className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
              {p.breadcrumb.map((b, i) => (
                <span key={b} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight className="size-3.5" />}
                  <button
                    type="button"
                    onClick={() => i < 2 && router.push('/contratante/fornecedores/busca')}
                    className={cn(
                      i === p.breadcrumb.length - 1 ? 'text-foreground' : 'hover:text-foreground',
                    )}
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
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Entrar
            </button>
            <Image
              src="/images/home/avatar-client-2.png"
              alt="Perfil"
              width={36}
              height={36}
              className="ring-border size-9 rounded-full object-cover ring-2"
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
          <div className="border-border bg-card/40 rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-foreground text-sm font-semibold">{p.serviceArea.title}</p>
                <p className="text-muted-foreground text-xs">{p.serviceArea.subtitle}</p>
              </div>
            </div>

            <Button
              variant="outline"
              disabled={contactRequested}
              onClick={handleContact}
              className="mt-4 h-12 w-full gap-2 text-sm font-semibold"
            >
              {contactRequested ? (
                <>
                  <Clock className="size-4" />
                  Mensagem Enviada
                </>
              ) : (
                <>
                  <Phone className="size-4" />
                  Falar com o Fornecedor
                </>
              )}
            </Button>

            <Button
              onClick={() => setQuoteOpen(true)}
              className="mt-4 h-12 w-full gap-2 text-sm font-semibold"
            >
              <Send className="size-4" />
              Solicitar Orçamento para o Meu Evento
            </Button>

            <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-center text-xs">
              <Lock className="size-3" />
              Seus dados estão seguros. Sem compromisso.
            </p>
          </div>

          {/* verified */}
          <div className="border-border bg-card/40 rounded-2xl border p-5">
            <h3 className="font-display text-foreground flex items-center gap-2 text-base font-semibold">
              <BadgeCheck className="text-primary size-5" />
              {p.verified.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {p.verified.items.map((item) => (
                <li key={item} className="text-muted-foreground flex items-center gap-2.5 text-sm">
                  <Check className="text-primary size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* others */}
          <div className="border-border bg-card/40 rounded-2xl border p-5">
            <h3 className="font-display text-foreground flex items-center gap-2 text-base font-semibold">
              <Sparkles className="text-primary size-5" />
              Outros Fornecedores
            </h3>
            <ul className="mt-4 space-y-2">
              {p.others.items.map((o) => (
                <li key={o.name}>
                  <button
                    type="button"
                    onClick={() => router.push('/contratante/fornecedores/busca')}
                    className="hover:bg-secondary/60 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors"
                  >
                    <span className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-foreground block truncate text-sm font-medium">
                        {o.name}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Star className="fill-primary text-primary size-3" />
                        {o.rating.toFixed(1)} · {o.location}
                      </span>
                    </span>
                    <ChevronRight className="text-muted-foreground size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              onClick={() => router.push('/contratante/fornecedores/busca')}
              className="text-primary mt-3 w-full text-sm"
            >
              Ver todos os decoradores
            </Button>
          </div>
        </aside>
      </main>

      <footer className="border-border/60 border-t px-6 py-5">
        <div className="text-muted-foreground mx-auto flex max-w-7xl items-center justify-between text-xs">
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
    <div className="border-border bg-card/40 rounded-2xl border p-6">
      <div className="flex flex-wrap gap-2">
        {p.tags.slice(0, 1).map((t) => (
          <span
            key={t.label}
            className="border-primary/30 bg-primary/5 text-primary flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          >
            {t.icon === 'shield' ? (
              <ShieldCheck className="size-3.5" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {t.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-foreground flex items-center gap-2 text-3xl font-bold text-balance">
            {p.name}
            <BadgeCheck className="text-primary size-6" />
          </h1>
          <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
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

        <div className="border-border bg-background/50 rounded-xl border px-5 py-3 text-center">
          <p className="font-display text-foreground text-2xl font-bold">{p.rating.toFixed(1)}</p>
          <div className="my-1 flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-primary text-primary size-3" />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">{p.reviewsCount} Avaliações</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {p.stats.map((s) => (
          <div
            key={s.label}
            className="border-border/70 bg-background/40 rounded-xl border p-4 text-center"
          >
            <p className="font-display text-primary text-xl font-bold">{s.value}</p>
            <p className="text-muted-foreground mt-1 text-xs text-pretty">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioCard() {
  return (
    <div className="border-border bg-card/40 rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-foreground flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="text-primary size-5" />
          Portfólio
        </h2>
        <span className="text-muted-foreground text-xs">{p.portfolio.total}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={p.portfolio.images[0] || '/placeholder.svg'}
            alt="Trabalho em destaque"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="grid gap-3">
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
            <Image
              src={p.portfolio.images[1] || '/placeholder.svg'}
              alt="Trabalho do portfólio"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            className="border-border bg-secondary/40 text-foreground hover:border-primary/40 group relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl border text-sm font-semibold transition-colors"
          >
            <span className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
              <Image
                src={p.portfolio.images[0] || '/placeholder.svg'}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
              />
            </span>
            <span className="relative">{p.portfolio.extraCount}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.portfolio.tags.map((t) => (
          <span
            key={t}
            className="border-primary/30 bg-primary/5 text-primary rounded-full border px-3 py-1 text-xs"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function AboutCard() {
  return (
    <div className="border-border bg-card/40 rounded-2xl border p-6">
      <h2 className="font-display text-foreground flex items-center gap-2 text-lg font-semibold">
        <Quote className="text-primary size-5" />
        Sobre Nós
      </h2>
      <div className="text-muted-foreground mt-4 space-y-3 text-sm leading-relaxed">
        {p.about.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <h3 className="font-display text-foreground mt-6 text-base font-semibold">Nossos Serviços</h3>
      <ul className="mt-3 space-y-3">
        {p.about.services.map((s) => (
          <li key={s.title} className="flex gap-3">
            <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
            <div>
              <p className="text-foreground text-sm font-medium">{s.title}</p>
              <p className="text-muted-foreground text-xs">{s.desc}</p>
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
    <div className="border-border bg-card/40 rounded-2xl border p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-foreground flex items-center gap-2 text-lg font-semibold">
          <Quote className="text-primary size-5" />
          Depoimentos de Clientes
        </h2>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-primary text-primary size-3.5" />
            ))}
          </span>
          {p.reviewsCount} avaliações
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {reviews.map((r) => (
          <div key={r.name} className="border-border/60 bg-background/30 rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={r.avatar || '/placeholder-user.jpg'}
                  alt={r.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-foreground text-sm font-semibold">{r.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="fill-primary text-primary size-3" />
                      ))}
                    </span>
                    <span className="border-primary/30 bg-primary/5 text-primary rounded-full border px-2 py-0.5 text-[0.65rem]">
                      {r.tag}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-muted-foreground shrink-0 text-xs">{r.date}</span>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed italic">{`"${r.text}"`}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <Button variant="outline" onClick={onToggle} className="text-primary gap-2 text-sm">
          {showAll ? 'Ver menos avaliações' : 'Ver mais avaliações'}
        </Button>
      </div>
    </div>
  )
}
