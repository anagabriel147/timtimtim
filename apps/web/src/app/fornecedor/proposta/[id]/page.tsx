import { ProposalForm } from '@/features/fornecedor'

export default async function NovaPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProposalForm opportunityId={id} />
}
