/**
 * Modelos de domínio da feature `eventos`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type BudgetStatus = 'disponivel' | 'aguardando' | 'negociacao' | 'contratado'

export type BudgetRow = {
  id: string
  status: BudgetStatus
  statusLabel: string
  vendor: string
  avatar: string
  verified?: boolean
  category: string
  rating: string
  meta: string
  metrics: { label: string; value: string; tone?: 'primary' | 'amber' | 'blue' | 'muted' }[]
  primaryAction?: string
  secondaryActions?: string[]
  contractAction?: string
}
