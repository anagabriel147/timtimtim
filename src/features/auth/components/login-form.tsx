'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mocked credentials for the frontend-only prototype
const MOCK_CLIENT = {
  email: 'ana@timtim.com.br',
  password: '12345',
  redirect: '/cliente',
}

const MOCK_SUPPLIER = {
  email: 'fornecedor@timtim.com.br',
  password: '12345',
  redirect: '/fornecedor',
}

const MOCK_ADVISOR = {
  email: 'assessor@timtim.com.br',
  password: '12345',
  redirect: '/assessor',
}

const MOCK_ADMIN = {
  email: 'admin@timtim.com.br',
  password: '12345',
  redirect: '/admin',
}

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const login = email.trim().toLowerCase()

    if (login === MOCK_CLIENT.email && password === MOCK_CLIENT.password) {
      setLoading(true)
      router.push(MOCK_CLIENT.redirect)
      return
    }

    if (login === MOCK_SUPPLIER.email && password === MOCK_SUPPLIER.password) {
      setLoading(true)
      router.push(MOCK_SUPPLIER.redirect)
      return
    }

    if (login === MOCK_ADVISOR.email && password === MOCK_ADVISOR.password) {
      setLoading(true)
      router.push(MOCK_ADVISOR.redirect)
      return
    }

    if (login === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      setLoading(true)
      router.push(MOCK_ADMIN.redirect)
      return
    }

    setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.')
  }

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground text-balance">
        Entre em sua conta
      </h1>

      <div className="mt-10 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-xs font-medium tracking-wider text-muted-foreground"
          >
            E-MAIL
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="seu e-mail"
            className="h-14"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-xs font-medium tracking-wider text-muted-foreground"
            >
              PASSWORD
            </label>
            <Link
              href="/recuperar-senha"
              className="text-xs text-primary transition-colors hover:text-primary/80"
            >
              Esqueci a senha
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="h-14 pr-12"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
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
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <TriangleAlert className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full text-sm font-semibold tracking-wider"
        >
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </Button>
      </div>
    </form>
  )
}
