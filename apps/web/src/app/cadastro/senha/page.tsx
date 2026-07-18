import { SiteFooter } from '@/components/layout/site-footer'
import { CadastroHeader } from '@/features/cadastro'
import { PasswordForm } from '@/features/cadastro'

export default function SenhaPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <CadastroHeader step={3} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <PasswordForm />
      </main>
      <SiteFooter secure />
    </div>
  )
}
