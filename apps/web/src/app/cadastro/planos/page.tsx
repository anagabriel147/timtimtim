import Link from 'next/link'

import { Lock } from 'lucide-react'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { CheckoutHeader } from '@/features/cadastro'
import { PlanCheckout } from '@/features/cadastro'

export default async function PlanosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams

  return (
    <div className="flex min-h-svh flex-col">
      <CheckoutHeader variant={tipo === 'assessor' ? 'secure' : 'stepper'} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:py-14">
        <PlanCheckout tipo={tipo} />
      </main>
      <CheckoutFooter />
    </div>
  )
}

function CheckoutFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs sm:flex-row">
        <Link href="/" aria-label="TimTim">
          <TimTimLogo className="h-6 w-auto" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/termos" className="hover:text-foreground transition-colors">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-foreground transition-colors">
            Privacidade
          </Link>
          <Link href="/contato" className="hover:text-foreground transition-colors">
            Suporte
          </Link>
        </nav>
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5" />© 2025 TimTim. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
