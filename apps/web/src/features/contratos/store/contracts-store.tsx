'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { type Contract as ApiContract, listContracts } from '@/lib/api'

import type { Contract } from '../types'

type ContractsContextValue = {
  contracts: Contract[]
  loading: boolean
  refresh: () => void
  hasContract: (id: string) => boolean
}

const ContractsContext = createContext<ContractsContextValue | null>(null)

const RECEIPT_META: Record<Contract['paymentStatus'], { label: string; caption: string }> = {
  garantido: { label: 'Pagamento em custódia', caption: 'Garantido' },
  quitado: { label: 'Pagamento liberado', caption: 'Quitado' },
  aguardando: { label: 'Aguardando pagamento', caption: 'Pendente' },
  cancelado: { label: 'Reembolso processado', caption: 'Contrato encerrado' },
}

function formatCurrency(value: string): string {
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function adapt(c: ApiContract): Contract {
  const receipt = RECEIPT_META[c.payment_status as Contract['paymentStatus']]
  return {
    id: String(c.id),
    contractCode: c.contract_code,
    vendor: c.provider_name,
    event: c.event_name,
    category: '',
    avatar: c.provider_avatar ?? '',
    icon: 'file',
    date: new Date(c.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    location: c.event_city ?? '',
    value: formatCurrency(c.value),
    installments: `${c.installments_count}x`,
    receiptLabel: receipt?.label ?? '',
    receiptCaption: receipt?.caption ?? '',
    serviceStatus: c.service_status as Contract['serviceStatus'],
    paymentStatus: c.payment_status as Contract['paymentStatus'],
    createdAt: new Date(c.created_at).getTime(),
  }
}

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    listContracts()
      .then((fetched) => setContracts(fetched.map(adapt)))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const hasContract = useCallback((id: string) => contracts.some((c) => c.id === id), [contracts])

  const value = useMemo(
    () => ({ contracts, loading, refresh, hasContract }),
    [contracts, loading, refresh, hasContract],
  )

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>
}

export function useContracts() {
  const ctx = useContext(ContractsContext)
  if (!ctx) throw new Error('useContracts must be used within a ContractsProvider')
  return ctx
}
