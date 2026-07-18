'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Flower2,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Lightbulb,
  Lock,
  Send,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useChat } from '@/features/mensagens'
import { VENDOR_PROFILE } from '../data/marketplace-data'

// This vendor profile maps to the "guto" conversation in the chat store.
const CONVERSATION_ID = 'guto'

const p = VENDOR_PROFILE
const q = VENDOR_PROFILE.quote

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  table: LayoutGrid,
  flower: Flower2,
  image: ImageIcon,
  star: Star,
}

export function QuoteRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const { sendQuoteRequest, setActiveId } = useChat()
  const [date, setDate] = useState('')
  const [period, setPeriod] = useState('')
  const [guests, setGuests] = useState('')
  const [venue, setVenue] = useState('')
  const [services, setServices] = useState<string[]>(
    q.services.filter((s) => s.selected).map((s) => s.label),
  )
  const [vision, setVision] = useState('')
  const [sent, setSent] = useState(false)

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  if (!open) return null

  const toggleService = (label: string) =>
    setServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Solicitar orçamento"
        className="relative my-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-2xl shadow-primary/10"
      >
        {/* top accent line */}
        <div className="h-1 w-full bg-primary" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-6 z-10 grid size-8 place-items-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="p-6 sm:p-8">
          {sent ? (
            <SuccessView
              onClose={onClose}
              onGoToChat={() => {
                setActiveId(CONVERSATION_ID)
                router.push('/cliente/mensagens')
              }}
            />
          ) : (
            <>
              {/* header */}
              <div className="flex items-start gap-3 pr-10">
                <Image
                  src="/images/home/avatar-owner-1.png"
                  alt={p.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-foreground">{p.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {q.status}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1 text-sm font-semibold text-foreground">
                  <Star className="size-3.5 fill-primary text-primary" />
                  {p.rating.toFixed(1)}
                </span>
              </div>

              <h2 className="mt-5 flex items-center gap-3 font-display text-2xl font-bold text-foreground">
                <span className="h-6 w-1 rounded-full bg-primary" />
                Solicitar Orçamento
              </h2>

              {/* info banner */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="leading-relaxed">
                  {q.infoLead} <span className="font-semibold text-foreground">({q.infoEvent})</span>{' '}
                  {q.infoTail}
                </p>
              </div>

              {/* my event (locked) */}
              <Field icon={<Sparkles className="size-4 text-primary" />} label="Meu Evento">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Lock className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.lockedEvent.title}</p>
                      <p className="text-xs text-muted-foreground">{q.lockedEvent.subtitle}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
                    Bloqueado
                  </span>
                </div>
              </Field>

              {/* date + period */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  icon={<Calendar className="size-4 text-primary" />}
                  label="Data do Evento"
                  hint="(estimada)"
                  tight
                >
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ex: 15/11/2025"
                    className="h-12 w-full rounded-xl border border-border bg-background/40 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                  />
                </Field>
                <Field label="Período do dia" tight srLabel>
                  <SelectBox value={period} placeholder="Período do dia" options={q.periodOptions} onChange={setPeriod} />
                </Field>
              </div>

              {/* guests + venue */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field icon={<Users className="size-4 text-primary" />} label="Nº de Convidados" tight>
                  <input
                    value={guests}
                    onChange={(e) => setGuests(e.target.value.replace(/[^0-9]/g, ''))}
                    inputMode="numeric"
                    placeholder="Ex: 150"
                    className="h-12 w-full rounded-xl border border-border bg-background/40 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                  />
                </Field>
                <Field icon={<LayoutGrid className="size-4 text-primary" />} label="Local do Evento" tight>
                  <SelectBox value={venue} placeholder="Tipo de espaço" options={q.venueOptions} onChange={setVenue} />
                </Field>
              </div>

              {/* services */}
              <Field
                icon={<Sparkles className="size-4 text-primary" />}
                label="Serviços que Preciso"
                hint="(selecione todos)"
              >
                <div className="flex flex-wrap gap-2">
                  {q.services.map((s) => {
                    const Icon = SERVICE_ICONS[s.icon] ?? Sparkles
                    const active = services.includes(s.label)
                    return (
                      <button
                        key={s.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleService(s.label)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                          active
                            ? 'border-primary/60 bg-primary/10 text-primary'
                            : 'border-border bg-background/40 text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <Icon className="size-3.5" />
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* vision */}
              <Field
                icon={<Send className="size-4 text-primary" />}
                label="Descreva sua Visão"
                hint="(quanto mais detalhes, melhor)"
              >
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value.slice(0, q.maxChars))}
                  placeholder={q.visionPlaceholder}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  Caracteres: {vision.length} / {q.maxChars}
                </p>
              </Field>

              {/* submit */}
              <Button
                onClick={() => {
                  sendQuoteRequest(CONVERSATION_ID, { date, period, guests, venue, services, vision })
                  setSent(true)
                }}
                disabled={services.length === 0}
                className="mt-5 h-14 w-full gap-2 text-sm font-semibold"
              >
                <Send className="size-4" />
                Enviar Solicitação para o Chat
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Ao enviar, <span className="text-foreground">{p.name}</span> receberá sua solicitação detalhada
                e retornará em até <span className="text-primary">{q.sla}</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SuccessView({ onClose, onGoToChat }: { onClose: () => void; onGoToChat: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold text-foreground text-balance">
        Solicitação enviada!
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
        A sua solicitação foi enviada para o chat com <span className="text-foreground">{p.name}</span>. Você
        receberá uma proposta detalhada em até <span className="text-primary">{q.sla}</span>.
      </p>
      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onGoToChat} className="h-11 gap-2 px-6 text-sm font-semibold">
          <Send className="size-4" />
          Ir para o Chat
        </Button>
        <Button variant="outline" onClick={onClose} className="h-11 px-6 text-sm">
          Fechar
        </Button>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  hint,
  children,
  tight,
  srLabel,
}: {
  icon?: React.ReactNode
  label: string
  hint?: string
  children: React.ReactNode
  tight?: boolean
  srLabel?: boolean
}) {
  return (
    <div className={cn(tight ? 'mt-0' : 'mt-6')}>
      <p className={cn('mb-2 flex items-center gap-2 text-sm font-medium text-foreground', srLabel && 'sr-only')}>
        {icon}
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </p>
      {children}
    </div>
  )
}

function SelectBox({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string
  placeholder: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-border bg-background/40 px-4 text-sm outline-none transition-colors focus:border-primary/60"
      >
        <span className={cn(value ? 'text-foreground' : 'text-muted-foreground')}>
          {value || placeholder}
        </span>
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(opt)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary/60',
                  value === opt ? 'text-primary' : 'text-foreground',
                )}
              >
                {opt}
                {value === opt && <Check className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
