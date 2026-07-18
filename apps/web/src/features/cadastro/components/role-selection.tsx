'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowRight, Check, HelpCircle, Store, ClipboardList } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Role = 'contratante' | 'fornecedor' | 'assessor'

const ROLES: {
  id: Role
  eyebrow: string
  title: string
  icon: typeof Store
  features: string[]
}[] = [
  {
    id: 'contratante',
    eyebrow: 'CONTRATANTE',
    title: 'Quero organizar meu evento',
    icon: HelpCircle,
    features: [
      'Encontre os melhores fornecedores',
      'Controle seu orçamento',
      'Eventos Sociais ou Corporativos',
    ],
  },
  {
    id: 'fornecedor',
    eyebrow: 'FORNECEDOR',
    title: 'Sou um Fornecedor',
    icon: Store,
    features: [
      'Crie sua vitrine digital',
      'Receba pedidos de orçamento',
      'Gerencie seus contratos',
    ],
  },
  {
    id: 'assessor',
    eyebrow: 'ASSESSOR',
    title: 'Sou Assessor / Cerimonialista',
    icon: ClipboardList,
    features: ['Painel de gestão de clientes', 'Cronogramas integrados', 'Ferramentas de RSVP'],
  },
]

export function RoleSelection() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role | null>(null)

  function handleContinue() {
    if (!selected) return
    router.push(`/cadastro/perfil?tipo=${selected}`)
  }

  return (
    <div className="flex flex-col items-center">
      <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest">
        <span className="bg-primary size-1.5 rounded-full" aria-hidden="true" />
        CADASTRO
      </span>

      <h1 className="font-display text-foreground mt-6 text-center text-4xl font-semibold tracking-tight text-balance md:text-5xl">
        Como você quer usar o <span className="text-primary">TimTim</span>?
      </h1>
      <p className="text-muted-foreground mt-3 text-center text-sm">
        Selecione a opção que melhor define você
      </p>

      <fieldset className="mt-12 grid w-full gap-5 md:grid-cols-3">
        <legend className="sr-only">Escolha seu tipo de conta</legend>
        {ROLES.map((role) => {
          const isActive = selected === role.id
          const Icon = role.icon
          return (
            <label
              key={role.id}
              className={cn(
                'bg-card/60 group relative flex cursor-pointer flex-col rounded-2xl border p-6 transition-all',
                isActive
                  ? 'border-primary ring-primary/30 ring-2'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <input
                type="radio"
                name="role"
                value={role.id}
                checked={isActive}
                onChange={() => setSelected(role.id)}
                className="sr-only"
              />

              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-6 right-6 grid size-5 place-items-center rounded-full border transition-colors',
                  isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                )}
              >
                {isActive && <Check className="size-3" strokeWidth={3} />}
              </span>

              <span className="bg-primary/15 text-primary grid size-11 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>

              <span className="text-primary mt-6 text-xs font-semibold tracking-widest">
                {role.eyebrow}
              </span>
              <span className="font-display text-foreground mt-1 text-xl font-semibold text-balance">
                {role.title}
              </span>

              <ul className="mt-5 space-y-3">
                {role.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-muted-foreground flex items-start gap-2.5 text-sm"
                  >
                    <span
                      className="bg-primary/20 text-primary mt-0.5 grid size-4 shrink-0 place-items-center rounded-full"
                      aria-hidden="true"
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <span
                className={cn(
                  'mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border text-xs font-semibold tracking-widest transition-colors',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground group-hover:text-foreground',
                )}
              >
                {isActive ? 'SELECIONADO' : 'SELECIONAR'}
              </span>
            </label>
          )
        })}
      </fieldset>

      <Button
        onClick={handleContinue}
        disabled={!selected}
        className="mt-10 h-14 w-full max-w-xs text-sm font-semibold tracking-widest"
      >
        CONTINUAR
        <ArrowRight className="size-4" />
      </Button>

      <p className="text-muted-foreground mt-10 text-sm">
        Já tem uma conta?{' '}
        <Link
          href="/"
          className="text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
