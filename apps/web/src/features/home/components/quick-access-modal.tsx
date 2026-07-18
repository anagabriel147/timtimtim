'use client'

import { useEffect, useState } from 'react'

import {
  ArrowRight,
  Check,
  CircleHelp,
  HelpCircle,
  LogIn,
  Mail,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { EVENT_TYPES, MODAL_TRUST } from '../data/home-data'

type Step = 'auth' | 'create' | 'success'

const USER_NAME = 'Ana'

export function QuickAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>('auth')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState<string | null>(null)

  // reset to the first step whenever the modal is re-opened
  useEffect(() => {
    if (open) {
      setStep('auth')
      setEventType(null)
    }
  }, [open])

  // close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Acesso rápido TimTim"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
      />

      {/* card */}
      <div className="border-primary/40 bg-card/95 shadow-primary/10 ring-primary/20 relative w-full max-w-md rounded-3xl border p-7 shadow-2xl ring-1">
        {step === 'auth' && (
          <AuthStep
            email={email}
            phone={phone}
            onEmail={setEmail}
            onPhone={setPhone}
            onContinue={() => setStep('create')}
            onClose={onClose}
          />
        )}

        {step === 'create' && (
          <CreateStep
            eventType={eventType}
            onSelect={setEventType}
            onCreate={() => setStep('success')}
            onExplore={onClose}
          />
        )}

        {step === 'success' && <SuccessStep eventType={eventType} onClose={onClose} />}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fechar modal"
      className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-full border transition-colors"
    >
      <X className="size-4" />
    </button>
  )
}

// ---------------------------------------------------------------------------

function AuthStep({
  email,
  phone,
  onEmail,
  onPhone,
  onContinue,
  onClose,
}: {
  email: string
  phone: string
  onEmail: (v: string) => void
  onPhone: (v: string) => void
  onContinue: () => void
  onClose: () => void
}) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <BrandMark size="md" />
        <button
          type="button"
          aria-label="Ajuda"
          className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-full border transition-colors"
        >
          <HelpCircle className="size-4" />
        </button>
      </div>

      <span className="border-primary/40 bg-primary/10 text-primary mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
        ACESSO RÁPIDO
      </span>

      <h2 className="font-display text-foreground mt-3 text-2xl leading-tight font-bold tracking-tight text-balance">
        Falta pouco para o seu grande dia!
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Entre ou crie sua conta em segundos para interagir com fornecedores e gerenciar seu evento.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          onContinue()
        }}
      >
        <div>
          <label htmlFor="qa-email" className="text-foreground mb-1.5 block text-sm font-medium">
            E-mail
          </label>
          <div className="relative">
            <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              id="qa-email"
              type="email"
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              placeholder="seu@email.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="qa-phone" className="text-foreground mb-1.5 block text-sm font-medium">
            WhatsApp / Celular
          </label>
          <div className="relative">
            <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              id="qa-phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
              placeholder="+351 912 345 678"
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="h-12 w-full gap-2 text-sm font-semibold">
          <LogIn className="size-4" />
          Entrar ou Cadastrar
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">ou continue com</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-11 gap-2 text-sm" onClick={onClose}>
          <GoogleIcon className="size-4" />
          Google
        </Button>
        <Button variant="outline" className="h-11 gap-2 text-sm" onClick={onClose}>
          <FacebookIcon className="size-4" />
          Facebook
        </Button>
      </div>

      <p className="text-muted-foreground mt-5 flex items-start gap-1.5 text-xs leading-relaxed">
        <CircleHelp className="mt-0.5 size-3.5 shrink-0" />
        <span>
          Ao continuar, aceita os nossos{' '}
          <span className="text-foreground font-medium">Termos de Uso</span> e{' '}
          <span className="text-foreground font-medium">Política de Privacidade</span>. Sem spam,
          prometemos.
        </span>
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------

function CreateStep({
  eventType,
  onSelect,
  onCreate,
  onExplore,
}: {
  eventType: string | null
  onSelect: (v: string) => void
  onCreate: () => void
  onExplore: () => void
}) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
          <Check className="size-3.5" strokeWidth={3} />
          Bem-vinda à TimTim, {USER_NAME}!
        </span>
        <button
          type="button"
          aria-label="Ajuda"
          className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-full border transition-colors"
        >
          <HelpCircle className="size-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <span className="border-primary/40 bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl border">
          <Sparkles className="size-7" />
        </span>
        <h2 className="font-display text-foreground mt-4 text-2xl font-bold tracking-tight">
          Crie o seu primeiro evento
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Descreva o que sonha e receba propostas personalizadas dos melhores fornecedores de
          Portugal em menos de 24h.
        </p>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">começa aqui</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            aria-pressed={eventType === type}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
              eventType === type
                ? 'border-primary/60 bg-primary/10 text-primary'
                : 'border-border bg-secondary/40 text-foreground hover:border-primary/40',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full',
                eventType === type ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
              aria-hidden="true"
            />
            {type}
          </button>
        ))}
      </div>

      <Button onClick={onCreate} className="mt-5 h-12 w-full gap-2 text-sm font-semibold">
        <PartyPopper className="size-4" />
        Criar Meu Primeiro Evento
      </Button>
      <Button variant="outline" onClick={onExplore} className="mt-3 h-12 w-full gap-2 text-sm">
        Explorar Fornecedores Primeiro
      </Button>

      <div className="border-border/60 mt-6 flex items-center justify-between border-t pt-5">
        {MODAL_TRUST.map((item) => (
          <span key={item} className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="text-primary size-3.5" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function SuccessStep({ eventType, onClose }: { eventType: string | null; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex w-full items-center justify-end">
        <CloseButton onClose={onClose} />
      </div>
      <span className="bg-primary/15 text-primary mt-2 grid size-16 place-items-center rounded-full">
        <Check className="size-8" strokeWidth={2.5} />
      </span>
      <h2 className="font-display text-foreground mt-5 text-2xl font-bold tracking-tight text-balance">
        Evento criado com sucesso!
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {eventType
          ? `Seu evento de ${eventType.toLowerCase()} foi registado. Os fornecedores já podem enviar propostas — receberá as primeiras em menos de 24h.`
          : 'Seu evento foi registado. Os fornecedores já podem enviar propostas — receberá as primeiras em menos de 24h.'}
      </p>

      <div className="border-border bg-secondary/30 mt-6 w-full space-y-2.5 rounded-2xl border p-4 text-left">
        {['Evento publicado', 'Fornecedores notificados', 'Propostas a caminho'].map((item) => (
          <p key={item} className="text-foreground flex items-center gap-2 text-sm">
            <Check className="text-primary size-4" strokeWidth={3} />
            {item}
          </p>
        ))}
      </div>

      <Button onClick={onClose} className="mt-6 h-12 w-full gap-2 text-sm font-semibold">
        Ver meu painel
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Brand icons (Google / Facebook)

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C17.1 3 14.8 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.8H12z"
      />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"
      />
    </svg>
  )
}
