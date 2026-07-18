'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Gem,
  Heart,
  HelpCircle,
  History,
  Info,
  LineChart,
  Lock,
  MapPin,
  MessageSquare,
  Pencil,
  Sparkles,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

import { AppTopbar } from '@/components/layout/app-topbar'
import { Button } from '@/components/ui/button'
import { useContracts } from '@/features/contratos'
import { createReview } from '@/lib/api'
import { cn } from '@/lib/utils'

import {
  ASPECTS,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_VENDOR,
  HIGHLIGHTS,
  IMPACT,
  MAX_CHARS,
  MIN_CHARS,
  RATING_LABELS,
  SHARE_TARGETS,
  WRITING_TIPS,
  type ReviewVendor,
} from '../data/review-data'

const ASPECT_ICONS = {
  atendimento: MessageSquare,
  pontualidade: Clock,
  qualidade: Gem,
}

const HIGHLIGHT_ICONS: Record<string, typeof Heart> = {
  heart: Heart,
  sparkles: Sparkles,
  clock: Clock,
  message: MessageSquare,
  gem: Gem,
  tag: Tag,
  briefcase: Briefcase,
  star: Star,
}

const IMPACT_ICONS: Record<string, typeof Users> = {
  users: Users,
  chart: LineChart,
  history: History,
}

const SHARE_ICONS: Record<string, string> = {
  whatsapp: 'M',
  instagram: 'I',
  facebook: 'F',
}

function StarRow({
  value,
  onChange,
  size = 'md',
}: {
  value: number
  onChange?: (n: number) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const [hover, setHover] = useState(0)
  const px = size === 'lg' ? 'size-11' : size === 'sm' ? 'size-3.5' : 'size-4'
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value)
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
            onMouseEnter={() => onChange && setHover(n)}
            onMouseLeave={() => onChange && setHover(0)}
            onClick={() => onChange?.(n)}
            className={cn(onChange && 'cursor-pointer transition-transform hover:scale-110')}
          >
            <Star
              className={cn(
                px,
                active ? 'fill-primary text-primary' : 'text-muted-foreground/40',
                active && size === 'lg' && 'drop-shadow-[0_0_10px_rgba(0,207,200,0.6)]',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewClient({ contractId }: { contractId: string }) {
  const router = useRouter()
  const { contracts, loading: contractsLoading } = useContracts()

  const vendor: ReviewVendor = useMemo(() => {
    const c = contracts.find((x) => x.id === contractId)
    if (!c) return DEFAULT_VENDOR
    return {
      name: c.vendor,
      avatar: c.avatar,
      slug: DEFAULT_VENDOR.slug,
      category: c.category,
      location: c.location,
      currentAvg: DEFAULT_VENDOR.currentAvg,
      event: c.event,
      contractCode: c.contractCode,
      contractValue: c.value,
      date: DEFAULT_VENDOR.date,
    }
  }, [contracts, contractId])

  const [published, setPublished] = useState(false)
  const [rating, setRating] = useState(4)
  const [aspects, setAspects] = useState<Record<string, number>>(
    Object.fromEntries(ASPECTS.map((a) => [a.key, a.initial])),
  )
  const [highlights, setHighlights] = useState<string[]>(DEFAULT_HIGHLIGHTS)
  const [text, setText] = useState('')
  const [recommend, setRecommend] = useState<'yes' | 'no'>('yes')
  const [showName, setShowName] = useState(true)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const chars = text.length
  const charPct = Math.min(100, Math.round((chars / MAX_CHARS) * 100))

  const toggleHighlight = (label: string) =>
    setHighlights((prev) =>
      prev.includes(label) ? prev.filter((h) => h !== label) : [...prev, label],
    )

  async function handlePublish() {
    setSubmitError(null)
    setSubmitting(true)
    try {
      await createReview({
        contract_id: Number(contractId),
        rating_overall: rating,
        rating_atendimento: aspects.atendimento,
        rating_pontualidade: aspects.pontualidade,
        rating_qualidade: aspects.qualidade,
        highlights,
        text,
        recommend: recommend === 'yes',
        show_name: showName,
      })
      setPublished(true)
    } catch {
      setSubmitError('Não foi possível publicar a avaliação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (contractsLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <AppTopbar activeLabel="Avaliações" />
        <main className="text-muted-foreground mx-auto max-w-3xl px-4 py-16 text-center text-sm">
          Carregando...
        </main>
      </div>
    )
  }

  if (published) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <AppTopbar activeLabel="Avaliações" />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <Breadcrumb steps={['Meus Eventos', vendor.event, 'Avaliar Fornecedor', 'Confirmação']} />

          <div className="border-border bg-card mt-6 overflow-hidden rounded-3xl border">
            {/* success header */}
            <div className="relative flex flex-col items-center px-6 pt-8 text-center">
              <div className="flex w-full items-center justify-between">
                <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
                  <CheckCircle2 className="size-3.5" />
                  AVALIAÇÃO PUBLICADA
                </span>
                <span className="border-border bg-secondary text-muted-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs">
                  <Calendar className="size-3.5" />
                  {vendor.date} · 22:41
                </span>
              </div>

              <div className="relative mt-8 grid size-28 place-items-center">
                <span className="border-primary/30 absolute inset-0 rounded-full border" />
                <span className="border-primary/50 absolute inset-3 rounded-full border" />
                <span className="bg-primary/10 absolute inset-0 rounded-full blur-xl" />
                <span className="bg-primary/15 grid size-16 place-items-center rounded-full">
                  <CheckCircle2 className="text-primary size-8" />
                </span>
              </div>

              <h1 className="font-display mt-6 text-4xl font-semibold text-balance">
                Avaliação Publicada
                <br />
                <span className="text-primary">com Sucesso!</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md leading-relaxed text-pretty">
                Sua avaliação para <span className="text-foreground">{vendor.name}</span> foi
                publicada no perfil público do fornecedor. Obrigada por ajudar outros casais a tomar
                a melhor decisão!
              </p>

              <div className="mt-5 flex items-center gap-2">
                <StarRow value={rating} size="sm" />
                <span className="text-primary text-sm font-medium">{RATING_LABELS[rating]}</span>
                <span className="text-muted-foreground text-sm">· {rating} de 5 estrelas</span>
              </div>
            </div>

            <div className="mt-8 space-y-8 px-6 pb-8">
              {/* vendor evaluated */}
              <section>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
                  FORNECEDOR AVALIADO
                </p>
                <div className="border-border bg-secondary/40 flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={vendor.avatar || '/placeholder.svg'}
                        alt={vendor.name}
                        width={48}
                        height={48}
                        className="size-12 rounded-lg object-cover"
                      />
                      <span className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full">
                        <Star className="size-3 fill-current" />
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                          {vendor.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {vendor.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                      NOVA MÉDIA
                    </p>
                    <p className="flex items-center justify-end gap-1 text-xl font-semibold">
                      <Star className="fill-primary text-primary size-4" />
                      {vendor.currentAvg}
                    </p>
                    <p className="text-primary flex items-center justify-end gap-1 text-xs">
                      <TrendingUp className="size-3" />
                      0.1 vs anterior
                    </p>
                  </div>
                </div>
                <div className="border-border bg-secondary/40 mt-2 flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="size-4" />
                    {vendor.event} · {vendor.contractCode}
                  </span>
                  <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                    <BadgeCheck className="size-3" />
                    Verificado
                  </span>
                </div>
              </section>

              {/* impact */}
              <section>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
                  IMPACTO DA SUA AVALIAÇÃO
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {IMPACT.map((m) => {
                    const Icon = IMPACT_ICONS[m.icon]
                    return (
                      <div
                        key={m.label}
                        className="border-border bg-secondary/40 flex flex-col items-center rounded-xl border p-5 text-center"
                      >
                        <span className="bg-primary/15 text-primary grid size-10 place-items-center rounded-lg">
                          <Icon className="size-5" />
                        </span>
                        <p className="mt-3 text-2xl font-semibold">{m.value}</p>
                        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                          {m.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* share */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-muted-foreground text-xs font-semibold tracking-widest">
                    COMPARTILHAR AVALIAÇÃO
                  </p>
                  <p className="text-muted-foreground text-xs">Ajude mais casais</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SHARE_TARGETS.map((s) => (
                    <Button
                      key={s.label}
                      variant="outline"
                      className="h-10 gap-2 px-4 text-xs"
                      onClick={() => {}}
                    >
                      <span className="bg-primary/15 text-primary grid size-5 place-items-center rounded-full text-[0.6rem] font-bold">
                        {SHARE_ICONS[s.icon]}
                      </span>
                      {s.label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="ml-auto h-10 gap-2 px-4 text-xs"
                    onClick={() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1500)
                    }}
                  >
                    <Copy className="size-3.5" />
                    {copied ? 'Link copiado!' : 'Copiar Link'}
                  </Button>
                </div>
              </section>

              {/* notified */}
              <div className="border-border bg-secondary/30 flex items-start gap-3 rounded-xl border p-4">
                <Info className="text-primary mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">O fornecedor foi notificado</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {vendor.name} recebeu uma notificação sobre sua avaliação e poderá responder
                    publicamente. Você será notificada se houver uma resposta.
                  </p>
                </div>
              </div>

              {/* actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/contratante/fornecedores/${vendor.slug}`)}
                  className="h-13 w-full gap-2 py-4 text-sm font-semibold"
                >
                  <Users className="size-4" />
                  Ver Perfil do Fornecedor
                  <ArrowRight className="size-4" />
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/contratante')}
                    className="h-11 gap-2 text-sm"
                  >
                    <Calendar className="size-4" />
                    Meus Eventos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPublished(false)}
                    className="h-11 gap-2 text-sm"
                  >
                    <Pencil className="size-4" />
                    Editar Avaliação
                  </Button>
                </div>
              </div>

              <ReviewFooter />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AppTopbar activeLabel="Avaliações" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb steps={['Meus Eventos', vendor.event, 'Avaliar Fornecedor']} />

        {/* header card */}
        <div className="border-border from-primary/10 to-card mt-6 overflow-hidden rounded-3xl border bg-gradient-to-b">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
                <span className="bg-primary size-1.5 rounded-full" />
                AVALIAÇÃO PÓS-EVENTO
              </span>
              <span className="border-border bg-secondary text-muted-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs">
                <Calendar className="size-3.5" />
                {vendor.date}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="relative">
                <Image
                  src={vendor.avatar || '/placeholder.svg'}
                  alt={vendor.name}
                  width={72}
                  height={72}
                  className="size-18 rounded-xl object-cover"
                  style={{ width: 72, height: 72 }}
                />
                <span className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full">
                  <Star className="size-3.5 fill-current" />
                </span>
              </div>
              <div>
                <h1 className="font-display text-2xl leading-tight font-semibold">
                  Como foi sua experiência com <span className="text-primary">{vendor.name}</span>?
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                    {vendor.category}
                  </span>
                  <span className="border-border bg-secondary text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                    <MapPin className="size-3" />
                    {vendor.location}
                  </span>
                  <span className="border-border bg-secondary text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                    <Star className="fill-primary text-primary size-3" />
                    {vendor.currentAvg} média atual
                  </span>
                </div>
              </div>
            </div>

            <div className="border-border bg-background/40 mt-5 flex items-center justify-between rounded-xl border px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-secondary text-muted-foreground grid size-8 place-items-center rounded-lg">
                  <HelpCircle className="size-4" />
                </span>
                <div>
                  <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                    EVENTO CONTRATADO
                  </p>
                  <p className="text-sm">
                    {vendor.event} · {vendor.contractCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                  VALOR DO CONTRATO
                </p>
                <p className="text-primary text-sm font-semibold">{vendor.contractValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* overall rating */}
        <section className="mt-8 flex flex-col items-center">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest">
            SUA NOTA GERAL
          </p>
          <div className="mt-4">
            <StarRow value={rating} onChange={setRating} size="lg" />
          </div>
          <p className="mt-3 text-sm">
            <span className="text-primary font-semibold">{RATING_LABELS[rating]}</span>
            <span className="text-muted-foreground">
              {' '}
              · Toque para avaliar ({rating} de 5 estrelas)
            </span>
          </p>
        </section>

        {/* aspects */}
        <section className="mt-8">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
            AVALIE OS ASPECTOS ESPECÍFICOS
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ASPECTS.map((a) => {
              const Icon = ASPECT_ICONS[a.icon]
              return (
                <div
                  key={a.key}
                  className="border-border bg-card flex flex-col items-center rounded-xl border p-5"
                >
                  <span className="bg-primary/15 text-primary grid size-10 place-items-center rounded-lg">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium">{a.label}</p>
                  <div className="mt-2">
                    <StarRow
                      value={aspects[a.key]}
                      onChange={(n) => setAspects((s) => ({ ...s, [a.key]: n }))}
                      size="sm"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* highlights */}
        <section className="mt-8">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
            PONTOS DE DESTAQUE{' '}
            <span className="text-muted-foreground/70 normal-case">
              (selecione todos que se aplicam)
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {HIGHLIGHTS.map((h) => {
              const Icon = HIGHLIGHT_ICONS[h.icon] ?? Star
              const active = highlights.includes(h.label)
              return (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => toggleHighlight(h.label)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                    active
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-3.5" />
                  {h.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* written review */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-widest">
              SUA AVALIAÇÃO ESCRITA
            </p>
            <p className="text-muted-foreground text-xs">
              {chars} / {MAX_CHARS}
            </p>
          </div>
          <div className="border-border bg-secondary/40 rounded-xl border p-4">
            <div className="border-border/60 bg-background/40 mb-3 space-y-1.5 rounded-lg border p-3">
              {WRITING_TIPS.map((tip) => (
                <p key={tip} className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="text-primary">|</span>
                  {tip}
                </p>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Conte para outros casais os pontos fortes do fornecedor, o atendimento e a entrega no dia do evento…"
              rows={6}
              className="border-border bg-background/40 placeholder:text-muted-foreground/60 focus:border-primary/50 w-full resize-none rounded-lg border p-3 text-sm leading-relaxed focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span
                className={cn(
                  'flex items-center gap-1.5 text-xs',
                  chars >= MIN_CHARS ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    chars >= MIN_CHARS ? 'bg-primary' : 'bg-muted-foreground/40',
                  )}
                />
                Mínimo de {MIN_CHARS} caracteres recomendado
              </span>
              <span className="text-muted-foreground text-xs">{charPct}%</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="h-10 gap-2 px-4 text-xs">
              <Camera className="size-4" />
              Adicionar Fotos
            </Button>
            <Button variant="outline" className="h-10 gap-2 px-4 text-xs">
              <Video className="size-4" />
              Adicionar Vídeo
            </Button>
            <span className="text-muted-foreground ml-auto text-xs">Máx. 5 mídias · 20MB cada</span>
          </div>
        </section>

        {/* recommend + privacy */}
        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
              RECOMENDARIA ESTE FORNECEDOR?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecommend('yes')}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors',
                  recommend === 'yes'
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                <ThumbsUp className="size-4" />
                Sim, com certeza!
              </button>
              <button
                type="button"
                onClick={() => setRecommend('no')}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors',
                  recommend === 'no'
                    ? 'border-destructive/50 bg-destructive/10 text-destructive'
                    : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                <ThumbsDown className="size-4" />
                Não
              </button>
            </div>
          </div>
          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest">
              PRIVACIDADE DA AVALIAÇÃO
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Exibir meu nome</p>
                <p className="text-muted-foreground text-xs">Mariana F. · cliente verificada</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showName}
                onClick={() => setShowName((v) => !v)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  showName ? 'bg-primary' : 'bg-secondary',
                )}
              >
                <span
                  className={cn(
                    'bg-background absolute top-0.5 size-5 rounded-full transition-transform',
                    showName ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* publish notice */}
        <div className="border-border bg-secondary/30 mt-6 flex items-start gap-3 rounded-xl border p-4">
          <Info className="text-primary mt-0.5 size-4 shrink-0" />
          <div>
            <p className="text-sm">
              Sua avaliação será publicada no perfil público de{' '}
              <span className="font-medium">{vendor.name}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Após a publicação, você poderá editar sua avaliação em até 48 horas. O fornecedor
              receberá uma notificação e poderá responder publicamente.
            </p>
          </div>
        </div>

        {/* submit */}
        {submitError && <p className="text-destructive mt-4 text-sm">{submitError}</p>}
        <Button
          onClick={handlePublish}
          disabled={rating === 0 || submitting}
          className="mt-2 h-14 w-full gap-2 text-sm font-semibold"
        >
          <Star className="size-4 fill-current" />
          {submitting ? 'Publicando...' : 'Publicar Avaliação no Perfil'}
          <ArrowRight className="size-4" />
        </Button>

        <div className="mt-6">
          <ReviewFooter />
        </div>
      </main>
    </div>
  )
}

function Breadcrumb({ steps }: { steps: string[] }) {
  return (
    <nav className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3.5" />}
          <span className={i === steps.length - 1 ? 'text-foreground' : ''}>{s}</span>
        </span>
      ))}
    </nav>
  )
}

function ReviewFooter() {
  return (
    <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs">
      <span className="flex items-center gap-1.5">
        <HelpCircle className="size-3.5" />
        Avaliação verificada
      </span>
      <span className="flex items-center gap-1.5">
        <Lock className="size-3.5" />
        Dados protegidos
      </span>
      <span>· TimTim · v2</span>
    </div>
  )
}
