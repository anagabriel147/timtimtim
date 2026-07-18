import type { Metadata } from 'next'

import { SearchResults } from '@/features/marketplace'

export const metadata: Metadata = {
  title: 'Resultados · Explorar Fornecedores · TimTim',
  description: 'Encontre e filtre os melhores fornecedores para o seu evento na TimTim.',
}

export default async function BuscaFornecedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <SearchResults query={q ?? 'Fotografia · São Paulo, SP'} />
}
