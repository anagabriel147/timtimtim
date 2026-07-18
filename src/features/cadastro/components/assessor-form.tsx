'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ----- Mock data (frontend-only prototype, no backend) -----
const CONTENT = {
  badge: 'CADASTRO',
  step: 'PASSO 2 DE 3',
  section: 'DADOS E ACESSO (ASSESSOR)',
  title: 'Identidade & Acesso',
  subtitle: 'Perfil profissional de assessor de eventos',
  intro:
    'Preencha seus dados profissionais e crie suas credenciais de acesso à plataforma TimTim.',
  docHint: 'Necessário para emissão de recibos e notas fiscais',
  phoneHint: 'Comunicação direta com clientes e notificações da plataforma',
}

const DOC_TYPES = [
  { id: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
  { id: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00' },
] as const

const REQUIREMENTS = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { id: 'upper', label: 'Letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Número', test: (p: string) => /[0-9]/.test(p) },
  {
    id: 'special',
    label: 'Caractere especial',
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const

const STRENGTH_LABELS = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte']

export function AssessorForm({ tipo = 'assessor' }: { tipo?: string }) {
  const router = useRouter()
  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number]['id']>('cpf')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const met = useMemo(() => REQUIREMENTS.map((r) => r.test(password)), [password])
  const score = met.filter(Boolean).length
  const activeDoc = DOC_TYPES.find((d) => d.id === docType)!

  return (
    <form
      className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card/50 p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/cadastro/planos?tipo=${tipo}`)
      }}
    >
      {/* card header */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          {CONTENT.badge}
        </span>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-3 rounded-full bg-primary/50" />
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <span className="h-1.5 w-3 rounded-full bg-muted" />
          <span className="ml-1 text-xs font-medium tracking-wide text-muted-foreground">
            {CONTENT.step}
          </span>
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-border" />
      <p className="mt-3 text-xs tracking-wide text-muted-foreground">{CONTENT.section}</p>

      <div className="mt-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
          <UsersRound className="size-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {CONTENT.title}
          </h1>
          <p className="text-sm text-muted-foreground">{CONTENT.subtitle}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{CONTENT.intro}</p>

      {/* fields */}
      <div className="mt-8 space-y-6">
        <Field
          id="nome"
          label="NOME DO ASSESSOR OU EMPRESA"
          icon={UserRound}
          placeholder="Ex: Maria Silva Eventos"
          autoComplete="name"
          required
        />

        {/* document with CPF/CNPJ toggle */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="documento"
              className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
            >
              <CreditCard className="size-3.5 text-primary" />
              CPF OU CNPJ
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-normal text-muted-foreground">
                OPCIONAL
              </span>
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-0.5">
              {DOC_TYPES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDocType(d.id)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                    docType === d.id
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <CreditCard className="size-4" />
            </span>
            <Input
              id="documento"
              className="pl-11"
              inputMode="numeric"
              placeholder={activeDoc.placeholder}
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5 text-primary" />
            {CONTENT.docHint}
          </p>
        </div>

        <Field
          id="email"
          label="E-MAIL COMERCIAL"
          icon={Mail}
          type="email"
          placeholder="contato@suaempresa.com.br"
          autoComplete="email"
          required
        />

        {/* whatsapp */}
        <div className="space-y-2">
          <label
            htmlFor="whatsapp"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
          >
            <Phone className="size-3.5 text-primary" />
            WHATSAPP / CELULAR
          </label>
          <div className="flex gap-2">
            <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 text-sm text-foreground">
              <span aria-hidden="true">🇧🇷</span>
              <span>+55</span>
            </div>
            <Input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              className="flex-1"
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="size-3.5 text-primary" />
            {CONTENT.phoneHint}
          </p>
        </div>

        {/* password */}
        <div className="space-y-3">
          <label
            htmlFor="senha"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
          >
            <Lock className="size-3.5 text-primary" />
            CRIE SUA SENHA
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="size-4" />
            </span>
            <Input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="pl-11 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {/* strength bars */}
          <div className="grid grid-cols-4 gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-colors',
                  i < score ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Força da senha
            {password.length > 0 && (
              <span className="text-foreground">— {STRENGTH_LABELS[score]}</span>
            )}
          </p>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1">
            {REQUIREMENTS.map((req, i) => (
              <li
                key={req.id}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  met[i] ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'grid size-3.5 place-items-center rounded-full border transition-colors',
                    met[i] ? 'border-primary bg-primary/20' : 'border-border',
                  )}
                  aria-hidden="true"
                >
                  {met[i] && <span className="size-1.5 rounded-full bg-primary" />}
                </span>
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* actions */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/cadastro')}
          className="h-12 gap-2 px-5 text-xs font-semibold tracking-widest"
        >
          <ArrowLeft className="size-4" />
          VOLTAR
        </Button>

        <p className="text-xs text-muted-foreground">
          Já tem conta?{' '}
          <Link
            href="/"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Entrar
          </Link>
        </p>

        <Button type="submit" className="h-12 gap-2 px-6 text-xs font-semibold tracking-widest">
          AVANÇAR
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  icon: Icon,
  optional,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  icon: typeof UserRound
  optional?: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
      >
        <Icon className="size-3.5 text-primary" />
        {label}
        {optional && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-normal text-muted-foreground">
            OPCIONAL
          </span>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <Input id={id} className={cn('pl-11', className)} {...props} />
      </div>
    </div>
  )
}
