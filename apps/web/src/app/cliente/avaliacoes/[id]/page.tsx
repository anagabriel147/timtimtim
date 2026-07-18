import { ReviewClient } from '@/features/avaliacoes'

export default async function AvaliarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReviewClient contractId={id} />
}
