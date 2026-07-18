import type { Metadata } from 'next'

import { HomeClient } from '@/features/home'

export const metadata: Metadata = {
  title: 'TimTim — Encontre os melhores fornecedores para o seu grande dia',
  description:
    'Compare orçamentos, leia avaliações reais e contrate fornecedores de eventos com confiança em Portugal. Casamentos, eventos corporativos e muito mais.',
}

export default function HomePage() {
  return <HomeClient />
}
