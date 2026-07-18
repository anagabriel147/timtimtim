import type { ReactNode } from 'react'

import { ChatProvider } from '@/features/mensagens'
import { ContractsProvider } from '@/features/contratos'

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ContractsProvider>{children}</ContractsProvider>
    </ChatProvider>
  )
}
