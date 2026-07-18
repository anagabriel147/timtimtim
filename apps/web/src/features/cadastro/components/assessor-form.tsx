'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  intro: 'Preencha seus dados profissionais e crie suas credenciais de acesso à plataforma TimTim.',
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
      className="border-border bg-card/50 mx-auto w-full max-w-2xl rounded-3xl border p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/cadastro/planos?tipo=${tipo}`)
      }}
    >
      {/* card header */}
      <div className="flex items-center justify-between">
        <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
          <span className="bg-primary size-1.5 rounded-full" aria-hidden="true" />
          {CONTENT.badge}
        </span>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="bg-primary/50 h-1.5 w-3 rounded-full" />
          <span className="bg-primary h-1.5 w-6 rounded-full" />
          <span className="bg-muted h-1.5 w-3 rounded-full" />
          <span className="text-muted-foreground ml-1 text-xs font-medium tracking-wide">
            {CONTENT.step}
          </span>
        </div>
      </div>
      <div className="bg-border mt-4 h-px w-full" />
      <p className="text-muted-foreground mt-3 text-xs tracking-wide">{CONTENT.section}</p>

      <div className="mt-6 flex items-center gap-3">
        <span className="bg-primary/15 text-primary grid size-11 place-items-center rounded-xl">
          <UsersRound className="size-5" />
        </span>
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            {CONTENT.title}
          </h1>
          <p className="text-muted-foreground text-sm">{CONTENT.subtitle}</p>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">{CONTENT.intro}</p>

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
              className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
            >
              <CreditCard className="text-primary size-3.5" />
              CPF OU CNPJ
              <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-normal">
                OPCIONAL
              </span>
            </label>
            <div className="border-border bg-secondary/40 flex items-center gap-1 rounded-lg border p-0.5">
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
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              <CreditCard className="size-4" />
            </span>
            <Input
              id="documento"
              className="pl-11"
              inputMode="numeric"
              placeholder={activeDoc.placeholder}
            />
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Info className="text-primary size-3.5" />
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
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <Phone className="text-primary size-3.5" />
            WHATSAPP / CELULAR
          </label>
          <div className="flex gap-2">
            <div className="border-border bg-secondary/40 text-foreground flex h-12 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm">
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
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <MessageCircle className="text-primary size-3.5" />
            {CONTENT.phoneHint}
          </p>
        </div>

        {/* password */}
        <div className="space-y-3">
          <label
            htmlFor="senha"
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <Lock className="text-primary size-3.5" />
            CRIE SUA SENHA
          </label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              <Lock className="size-4" />
            </span>
            <Input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="pr-12 pl-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
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
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="text-primary size-3.5" />
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
                  {met[i] && <span className="bg-primary size-1.5 rounded-full" />}
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

        <p className="text-muted-foreground text-xs">
          Já tem conta?{' '}
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
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
        className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
      >
        <Icon className="text-primary size-3.5" />
        {label}
        {optional && (
          <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-normal">
            OPCIONAL
          </span>
        )}
      </label>
      <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <Icon className="size-4" />
        </span>
        <Input id={id} className={cn('pl-11', className)} {...props} />
      </div>
    </div>
  )
}
