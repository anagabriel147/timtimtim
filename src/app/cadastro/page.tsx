import { CadastroHeader } from '@/features/cadastro'
import { RoleSelection } from '@/features/cadastro'
import { SiteFooter } from '@/components/layout/site-footer'

export default function CadastroPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <CadastroHeader step={1} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:py-16">
        <RoleSelection />
      </main>
      <SiteFooter />
    </div>
  )
}
