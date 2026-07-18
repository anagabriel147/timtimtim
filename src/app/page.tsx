import Link from 'next/link'

import { LoginForm } from '@/features/auth'
import { TimTimLogo } from '@/components/brand/timtim-logo'

export default function LoginPage() {
  return (
    <main className="grid min-h-svh grid-cols-1 md:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden items-center justify-center border-r border-border bg-gradient-to-b from-card/60 to-background md:flex">
        <TimTimLogo className="h-20 w-auto" />
      </section>

      {/* Form panel */}
      <section className="flex flex-col px-6 py-10 md:px-16 lg:px-24">
        <div className="flex flex-1 items-center justify-center md:justify-start">
          <LoginForm />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 md:mx-0">
          <p className="text-center text-sm text-muted-foreground md:text-right">
            Ainda não tem uma conta?{' '}
            <Link
              href="/cadastro"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Inscreva-se aqui
            </Link>
          </p>
          <nav className="flex items-center justify-center gap-4 text-xs text-muted-foreground md:justify-end">
            <Link href="/privacidade" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            <Link href="/termos" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            <Link href="/contato" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </section>
    </main>
  )
}
