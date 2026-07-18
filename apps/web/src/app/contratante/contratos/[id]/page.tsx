import { ContractDetailClient } from '@/features/contratos'

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ContractDetailClient id={id} />
}
