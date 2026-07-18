'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, KeyRound, Mail, MessageCircle, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ----- Mock (frontend-only prototype data) -----
const MOCK = {
  badge: 'CADASTRO',
  title: 'Crie seu acesso',
  subtitle: 'Informe seu e-mail, WhatsApp e uma senha segura para entrar na plataforma',
  fields: {
    nome: { label: 'NOME', placeholder: 'Jose' },
    email: { label: 'ENDEREÇO DE E-MAIL', placeholder: 'seuemail@exemplo.com' },
    telefone: {
      label: 'TELEFONE',
      placeholder: '(11) 99999-9999',
      hint: 'Usado para notificações e confirmações via WhatsApp',
    },
  },
  dialCode: '+55',
  actions: { back: 'VOLTAR', next: 'AVANÇAR', hasAccount: 'Já tem conta?', login: 'Entrar' },
} as const

export function AccessForm({ tipo = 'contratante' }: { tipo?: string }) {
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' })

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  return (
    <form
      className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card/50 p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/cadastro/senha?tipo=${tipo}`)
      }}
    >
      <CardTabHeader />

      <div className="mt-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
          <KeyRound className="size-5" />
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {MOCK.title}
        </h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{MOCK.subtitle}</p>

      <div className="mt-8 space-y-6">
        {/* Nome */}
        <div className="space-y-2">
          <label
            htmlFor="nome"
            className="text-xs font-medium tracking-wider text-muted-foreground"
          >
            {MOCK.fields.nome.label}
          </label>
          <Input
            id="nome"
            value={form.nome}
            onChange={update('nome')}
            placeholder={MOCK.fields.nome.placeholder}
            autoComplete="name"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
          >
            <Mail className="size-3.5 text-primary" />
            {MOCK.fields.email.label}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="size-4" />
            </span>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder={MOCK.fields.email.placeholder}
              autoComplete="email"
              className="pl-11"
              required
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label
            htmlFor="telefone"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground"
          >
            <MessageCircle className="size-3.5 text-primary" />
            {MOCK.fields.telefone.label}
          </label>
          <div className="flex gap-2">
            <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 text-sm text-foreground">
              <span>{MOCK.dialCode}</span>
              <ArrowRight className="size-3 rotate-90 text-muted-foreground" aria-hidden="true" />
            </div>
            <Input
              id="telefone"
              type="tel"
              inputMode="tel"
              value={form.telefone}
              onChange={update('telefone')}
              placeholder={MOCK.fields.telefone.placeholder}
              autoComplete="tel"
              className="flex-1"
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="size-3.5 text-primary" />
            {MOCK.fields.telefone.hint}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/cadastro')}
          className="h-12 gap-2 px-5 text-xs font-semibold tracking-widest"
        >
          <ArrowLeft className="size-4" />
          {MOCK.actions.back}
        </Button>

        <p className="text-xs text-muted-foreground">
          {MOCK.actions.hasAccount}{' '}
          <Link
            href="/"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {MOCK.actions.login}
          </Link>
        </p>

        <Button type="submit" className="h-12 gap-2 px-6 text-xs font-semibold tracking-widest">
          {MOCK.actions.next}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  )
}

function CardTabHeader() {
  return (
    <div>
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
        {MOCK.badge}
      </span>
      <div className="mt-4 flex" aria-hidden="true">
        <div className={cn('h-0.5 flex-1 bg-primary')} />
        <div className="h-0.5 flex-1 bg-border" />
      </div>
    </div>
  )
}
