import Link from 'next/link'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <main className="grid min-h-svh grid-cols-1 md:grid-cols-2">
      {/* Brand panel */}
      <section className="border-border from-card/60 to-background relative hidden items-center justify-center border-r bg-gradient-to-b md:flex">
        <TimTimLogo className="h-20 w-auto" />
      </section>

      {/* Form panel */}
      <section className="flex flex-col px-6 py-10 md:px-16 lg:px-24">
        <div className="flex flex-1 items-center justify-center md:justify-start">
          <LoginForm />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 md:mx-0">
          <p className="text-muted-foreground text-center text-sm md:text-right">
            Ainda não tem uma conta?{' '}
            <Link
              href="/cadastro"
              className="text-foreground hover:text-primary font-semibold transition-colors"
            >
              Inscreva-se aqui
            </Link>
          </p>
          <nav className="text-muted-foreground flex items-center justify-center gap-4 text-xs md:justify-end">
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            <Link href="/contato" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </section>
    </main>
  )
}
