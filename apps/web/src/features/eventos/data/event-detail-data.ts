import type { BudgetRow, BudgetStatus } from '../types'

// Mocked data for the frontend-only client event-detail prototype.

export const STATS = {
  budget: {
    label: 'ORÇAMENTO TOTAL',
    value: 'R$ 48.000',
    caption: 'Limite definido para o evento',
    footLabel: 'Comprometido',
    footValue: 'R$ 30.700',
    footPct: '(64%)',
    progress: 64,
  },
  vendors: {
    label: 'FORNECEDORES',
    value: '8',
    total: '/ 12',
    caption: 'Categorias contratadas',
    confirmed: '8 confirmados',
    pending: '4 pendentes',
  },
  countdown: {
    label: 'CONTAGEM REGRESSIVA',
    value: '180',
    unit: 'dias',
    caption: 'Até 15 de Novembro, 2025',
    footLabel: 'Próxima reunião',
    footValue: 'Segunda, 12/05',
  },
}

export const DISTRIBUTION = {
  title: 'Distribuição do Orçamento',
  items: [
    { label: 'Decoração', value: 'R$ 16.500', pct: 100, tone: 'primary' },
    { label: 'Buffet', value: 'R$ 12.000', pct: 72, tone: 'amber' },
    { label: 'Música & Som', value: 'R$ 7.800', pct: 47, tone: 'blue' },
    { label: 'Iluminação', value: 'R$ 5.200', pct: 31, tone: 'emerald' },
    { label: 'Outros', value: 'R$ 6.500', pct: 39, tone: 'muted' },
  ],
  remainingLabel: 'Restante disponível',
  remainingValue: 'R$ 17.300',
}

export const QUICK_ACTIONS = [
  { label: 'Buscar Fornecedor', icon: 'search', href: '/contratante/fornecedores' },
  { label: 'Todas Mensagens', icon: 'message', href: '/contratante/mensagens' },
]

export type { BudgetRow, BudgetStatus }
