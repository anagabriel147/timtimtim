'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowLeft, ArrowRight, KeyRound, Mail, MessageCircle } from 'lucide-react'

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
      className="border-border bg-card/50 mx-auto w-full max-w-2xl rounded-3xl border p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/cadastro/senha?tipo=${tipo}`)
      }}
    >
      <CardTabHeader />

      <div className="mt-8 flex items-center gap-3">
        <span className="bg-primary/15 text-primary grid size-11 place-items-center rounded-xl">
          <KeyRound className="size-5" />
        </span>
        <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
          {MOCK.title}
        </h1>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{MOCK.subtitle}</p>

      <div className="mt-8 space-y-6">
        {/* Nome */}
        <div className="space-y-2">
          <label
            htmlFor="nome"
            className="text-muted-foreground text-xs font-medium tracking-wider"
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
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <Mail className="text-primary size-3.5" />
            {MOCK.fields.email.label}
          </label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
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
            className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider"
          >
            <MessageCircle className="text-primary size-3.5" />
            {MOCK.fields.telefone.label}
          </label>
          <div className="flex gap-2">
            <div className="border-border bg-secondary/40 text-foreground flex h-12 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm">
              <span>{MOCK.dialCode}</span>
              <ArrowRight className="text-muted-foreground size-3 rotate-90" aria-hidden="true" />
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
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <MessageCircle className="text-primary size-3.5" />
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

        <p className="text-muted-foreground text-xs">
          {MOCK.actions.hasAccount}{' '}
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
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
      <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
        <span className="bg-primary size-1.5 rounded-full" aria-hidden="true" />
        {MOCK.badge}
      </span>
      <div className="mt-4 flex" aria-hidden="true">
        <div className={cn('bg-primary h-0.5 flex-1')} />
        <div className="bg-border h-0.5 flex-1" />
      </div>
    </div>
  )
}
