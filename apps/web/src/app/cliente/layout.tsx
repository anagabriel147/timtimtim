import type { ReactNode } from 'react'

import { ContractsProvider } from '@/features/contratos'
import { ChatProvider } from '@/features/mensagens'

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ContractsProvider>{children}</ContractsProvider>
    </ChatProvider>
  )
}
