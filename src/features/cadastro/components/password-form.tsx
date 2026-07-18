'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ----- Mock (frontend-only prototype data) -----
const MOCK = {
  badge: 'CADASTRO',
  eyebrow: 'FINALIZAÇÃO',
  title: 'Defina sua senha de acesso',
  subtitle:
    'Crie uma senha forte para proteger sua conta. Ela será usada em todos os seus acessos ao TimTim.',
  security: {
    prefix: 'Sua senha é criptografada com ',
    highlight: 'AES-256',
    suffix: ' e nunca é armazenada em texto simples.',
  },
  createLabel: 'CRIE UMA SENHA',
  createPlaceholder: 'Mínimo 8 caracteres',
  confirmLabel: 'CONFIRME SUA SENHA',
  confirmPlaceholder: 'Repita a senha criada acima',
  strengthLabel: 'Força da senha',
  requirements: [
    { id: 'length', label: 'Mínimo 8 caracteres' },
    { id: 'upper', label: 'Letra maiúscula' },
    { id: 'number', label: 'Número' },
    { id: 'special', label: 'Caractere especial' },
  ],
  consents: [
    {
      id: 'terms',
      required: true,
      parts: [
        { text: 'Li e aceito os ' },
        { text: 'Termos de Uso', link: true },
        { text: ' e a ' },
        { text: 'Política de Privacidade', link: true },
        { text: ' da plataforma TimTim.' },
      ],
    },
    {
      id: 'marketing',
      required: false,
      parts: [
        {
          text: 'Quero receber novidades, promoções e ofertas de eventos por e-mail e WhatsApp.',
        },
      ],
      hint: 'Opcional — você pode alterar isso nas configurações.',
    },
  ],
  steps: ['Perfil', 'Acesso', 'Finalização'],
  actions: { back: 'VOLTAR', secure: 'Conexão segura', conclude: 'CONCLUIR CADASTRO' },
  success: {
    title: 'Cadastro concluído!',
    message: 'Sua conta TimTim foi criada com sucesso. Bem-vindo à plataforma.',
    cta: 'Ir para o login',
  },
} as const

const TESTS: ((p: string) => boolean)[] = [
  (p) => p.length >= 8,
  (p) => /[A-Z]/.test(p),
  (p) => /[0-9]/.test(p),
  (p) => /[^A-Za-z0-9]/.test(p),
]

export function PasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [done, setDone] = useState(false)

  const met = useMemo(() => TESTS.map((t) => t(password)), [password])
  const score = met.filter(Boolean).length
  const passwordsMatch = confirm.length > 0 && confirm === password
  const canSubmit = score === TESTS.length && passwordsMatch && acceptTerms

  if (done) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-primary/40 bg-card/50 p-8 text-center md:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-foreground md:text-3xl">
          {MOCK.success.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          {MOCK.success.message}
        </p>
        <Button
          onClick={() => router.push('/')}
          className="mt-8 h-12 px-8 text-xs font-semibold tracking-widest"
        >
          {MOCK.success.cta}
        </Button>
        <FinalizeSteps />
      </div>
    )
  }

  return (
    <form
      className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card/50 p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        setDone(true)
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          {MOCK.badge}
        </span>
        <span className="text-xs font-semibold tracking-widest text-primary">
          {MOCK.eyebrow}
        </span>
      </div>
      <div className="mt-4 h-0.5 w-full bg-primary" />

      <div className="mt-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {MOCK.title}
        </h1>
      </div>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">{MOCK.subtitle}</p>

      {/* security banner */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          {MOCK.security.prefix}
          <span className="text-primary">{MOCK.security.highlight}</span>
          {MOCK.security.suffix}
        </p>
      </div>

      {/* create password */}
      <div className="mt-8 space-y-3">
        <label
          htmlFor="senha"
          className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
        >
          <Lock className="size-3.5 text-primary" />
          {MOCK.createLabel}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <Input
            id="senha"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={MOCK.createPlaceholder}
            autoComplete="new-password"
            className="pl-11 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

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
          {MOCK.strengthLabel}
        </p>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1">
          {MOCK.requirements.map((req, i) => (
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

      {/* confirm password */}
      <div className="mt-8 space-y-2">
        <label
          htmlFor="confirmar"
          className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
        >
          <LockKeyhole className="size-3.5 text-primary" />
          {MOCK.confirmLabel}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <LockKeyhole className="size-4" />
          </span>
          <Input
            id="confirmar"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={MOCK.confirmPlaceholder}
            autoComplete="new-password"
            className={cn(
              'pl-11 pr-12',
              confirm.length > 0 && !passwordsMatch && 'border-destructive/60',
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {confirm.length > 0 && !passwordsMatch && (
          <p className="text-xs text-destructive">As senhas não coincidem.</p>
        )}
      </div>

      {/* consents */}
      <div className="mt-8 space-y-4">
        <ConsentCheckbox
          checked={acceptTerms}
          onChange={() => setAcceptTerms((v) => !v)}
          parts={MOCK.consents[0].parts}
        />
        <ConsentCheckbox
          checked={marketing}
          onChange={() => setMarketing((v) => !v)}
          parts={MOCK.consents[1].parts}
          hint={MOCK.consents[1].hint}
        />
      </div>

      {/* actions */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-12 gap-2 px-5 text-xs font-semibold tracking-widest"
        >
          <ArrowLeft className="size-4" />
          {MOCK.actions.back}
        </Button>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          {MOCK.actions.secure}
        </p>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-12 gap-2 px-6 text-xs font-semibold tracking-widest"
        >
          <Check className="size-4" />
          {MOCK.actions.conclude}
        </Button>
      </div>

      <FinalizeSteps />
    </form>
  )
}

function ConsentCheckbox({
  checked,
  onChange,
  parts,
  hint,
}: {
  checked: boolean
  onChange: () => void
  parts: readonly { text: string; link?: boolean }[]
  hint?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={cn(
          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors',
          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="text-sm text-muted-foreground">
        {parts.map((part, i) =>
          part.link ? (
            <span key={i} className="text-primary">
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
        {hint && <span className="mt-1 block text-xs text-muted-foreground/70">{hint}</span>}
      </span>
    </label>
  )
}

function FinalizeSteps() {
  return (
    <div className="mt-8 flex items-center justify-center gap-6">
      {MOCK.steps.map((label, i) => {
        const isLast = i === MOCK.steps.length - 1
        return (
          <span
            key={label}
            className={cn(
              'flex items-center gap-1.5 text-xs',
              isLast ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'grid size-4 place-items-center rounded-full border',
                isLast ? 'border-primary bg-primary/20' : 'border-primary/40 bg-primary/10',
              )}
              aria-hidden="true"
            >
              <Check className="size-2.5 text-primary" strokeWidth={3} />
            </span>
            {label}
          </span>
        )
      })}
    </div>
  )
}
