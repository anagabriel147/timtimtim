'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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

export function ProfileForm({ tipo = 'fornecedor' }: { tipo?: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const met = useMemo(() => REQUIREMENTS.map((r) => r.test(password)), [password])
  const score = met.filter(Boolean).length

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
          CADASTRO
        </span>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="bg-primary/50 h-1.5 w-3 rounded-full" />
          <span className="bg-primary h-1.5 w-6 rounded-full" />
          <span className="bg-muted h-1.5 w-3 rounded-full" />
          <span className="text-muted-foreground ml-1 text-xs font-medium tracking-wide">
            PASSO 2 DE 3
          </span>
        </div>
      </div>
      <div className="bg-border mt-4 h-px w-full" />
      <p className="text-muted-foreground mt-3 text-xs tracking-wide">Dados e Acesso</p>

      <div className="mt-6 flex items-center gap-3">
        <span className="bg-primary/15 text-primary grid size-11 place-items-center rounded-xl">
          <User className="size-5" />
        </span>
        <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
          Crie seu perfil profissional
        </h1>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        Preencha suas informações de identificação e acesso para continuar
      </p>

      {/* fields */}
      <div className="mt-8 space-y-6">
        <Field
          id="nome"
          label="NOME COMPLETO"
          icon={User}
          placeholder="Seu nome completo"
          autoComplete="name"
          required
        />

        <Field
          id="empresa"
          label="NOME DA EMPRESA"
          optional
          icon={Building2}
          placeholder="Razão social ou nome fantasia"
          autoComplete="organization"
        />

        <div className="space-y-2">
          <Field
            id="documento"
            label="CPF / CNPJ"
            optional
            icon={CreditCard}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            inputMode="numeric"
          />
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="text-primary size-3.5" />
            Seus dados são protegidos e criptografados
          </p>
        </div>

        <Field
          id="email"
          label="ENDEREÇO DE E-MAIL"
          icon={Mail}
          type="email"
          placeholder="seuemail@exemplo.com"
          autoComplete="email"
          required
        />

        {/* whatsapp */}
        <div className="space-y-2">
          <label
            htmlFor="whatsapp"
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <MessageCircle className="text-primary size-3.5" />
            WHATSAPP
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
            Notificações via WhatsApp
          </p>
        </div>

        {/* password */}
        <div className="space-y-3">
          <label
            htmlFor="senha"
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <Lock className="text-primary size-3.5" />
            SENHA
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
            className="text-primary hover:text-primary/80 block font-semibold transition-colors"
          >
            Entrar
          </Link>
        </p>

        <Button type="submit" className="h-12 gap-2 px-6 text-xs font-semibold tracking-widest">
          AVANÇAR PARA PLANOS
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
  icon: typeof User
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
