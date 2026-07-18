import type { Metadata } from 'next'

import { DashboardClient } from '@/features/contratante'

export const metadata: Metadata = {
  title: 'Painel de Controle · TimTim',
  description: 'Gerencie os seus fornecedores, propostas e datas num só lugar.',
}

export default function ContratantePage() {
  return <DashboardClient />
}
