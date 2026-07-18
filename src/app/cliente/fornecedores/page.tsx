import type { Metadata } from 'next'

import { ExploreClient } from '@/features/marketplace'

export const metadata: Metadata = {
  title: 'Explorar Fornecedores · TimTim',
  description:
    'Encontre os melhores fornecedores para o seu evento. Fotografia, buffet, decoração, DJs e muito mais.',
}

export default function ExplorarFornecedoresPage() {
  return <ExploreClient />
}
