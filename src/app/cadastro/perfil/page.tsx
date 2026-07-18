import { AccessForm } from '@/features/cadastro'
import { AssessorForm } from '@/features/cadastro'
import { CadastroHeader } from '@/features/cadastro'
import { ProfileForm } from '@/features/cadastro'
import { SiteFooter } from '@/components/layout/site-footer'

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams

  return (
    <div className="flex min-h-svh flex-col">
      <CadastroHeader step={2} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        {tipo === 'contratante' ? (
          <AccessForm tipo={tipo} />
        ) : tipo === 'assessor' ? (
          <AssessorForm tipo={tipo} />
        ) : (
          <ProfileForm tipo={tipo} />
        )}
      </main>
      <SiteFooter secure />
    </div>
  )
}
