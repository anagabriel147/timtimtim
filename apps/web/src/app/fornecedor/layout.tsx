import type { ReactNode } from 'react'

import { ContractsProvider } from '@/features/contratos'

export default function FornecedorLayout({ children }: { children: ReactNode }) {
  return <ContractsProvider>{children}</ContractsProvider>
}
