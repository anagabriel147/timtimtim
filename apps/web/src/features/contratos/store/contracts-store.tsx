'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { INITIAL_CONTRACTS, type Contract } from '../data/contracts-data'

type NewContractInput = {
  id: string
  vendor: string
  event: string
  category: string
  avatar: string
  value: string
  location?: string
  date?: string
}

type ContractsContextValue = {
  contracts: Contract[]
  addContract: (input: NewContractInput) => boolean
  hasContract: (id: string) => boolean
}

const ContractsContext = createContext<ContractsContextValue | null>(null)

const CATEGORY_ICONS: Record<string, string> = {
  Decoração: 'flower',
  Buffet: 'cake',
  'Música & Som': 'music',
  Iluminação: 'lightbulb',
  Fotografia: 'camera',
}

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>(() =>
    INITIAL_CONTRACTS.map((c) => ({ ...c })),
  )

  const hasContract = useCallback((id: string) => contracts.some((c) => c.id === id), [contracts])

  const addContract = useCallback((input: NewContractInput) => {
    let added = false
    setContracts((prev) => {
      if (prev.some((c) => c.id === input.id)) return prev
      added = true
      const seq = String(prev.length + 42).padStart(4, '0')
      const contract: Contract = {
        id: input.id,
        contractCode: `#TT-2025-${seq}`,
        vendor: input.vendor,
        event: input.event,
        category: input.category,
        avatar: input.avatar,
        icon: CATEGORY_ICONS[input.category] ?? 'file',
        date: input.date ?? '15 Nov 2025',
        location: input.location ?? 'São Paulo, SP',
        value: input.value,
        installments: '3 parcelas',
        receiptLabel: 'Aguardando 1º pagamento',
        receiptCaption: '0% garantido',
        // A freshly accepted proposal: service confirmed, payment being secured.
        serviceStatus: 'confirmado',
        paymentStatus: 'aguardando',
        createdAt: Date.now(),
      }
      return [contract, ...prev]
    })
    return added
  }, [])

  const value = useMemo(
    () => ({ contracts, addContract, hasContract }),
    [contracts, addContract, hasContract],
  )

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>
}

export function useContracts() {
  const ctx = useContext(ContractsContext)
  if (!ctx) throw new Error('useContracts must be used within a ContractsProvider')
  return ctx
}
