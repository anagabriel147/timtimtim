import type { BudgetRow, BudgetStatus } from '../types'

// Mocked data for the frontend-only client event-detail prototype.

export const EVENT = {
  breadcrumb: ['MEUS EVENTOS', 'Casamento'],
  title: 'Meu Casamento',
  daysBadge: '180 dias restantes',
  date: '15 de Novembro, 2025',
  location: 'Salão Jardim das Flores, São Paulo',
  guests: '120 convidados',
  progress: 64,
  progressLegend: [
    { label: '8 fornecedores confirmados', tone: 'primary' },
    { label: '3 propostas em análise', tone: 'amber' },
    { label: '4 categorias pendentes', tone: 'muted' },
  ],
}

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

export const BUDGET_ROWS: BudgetRow[] = [
  {
    id: 'guto',
    status: 'disponivel',
    statusLabel: 'PROPOSTA DISPONÍVEL',
    vendor: 'Guto Decorações Premium',
    avatar: '/images/home/avatar-owner-1.png',
    verified: true,
    category: 'Decoração',
    rating: '4.9 (237 avaliações)',
    meta: 'Respondeu hoje às 10:15',
    metrics: [
      { label: 'Valor proposto', value: 'R$ 16.500', tone: 'primary' },
      { label: 'Orçamento disponível', value: 'R$ 18.000', tone: 'muted' },
      { label: 'Economia', value: 'R$ 1.500 abaixo', tone: 'primary' },
    ],
    primaryAction: 'Ver Proposta no Chat',
    secondaryActions: ['Ver Detalhes', 'Recusar'],
  },
  {
    id: 'flora',
    status: 'aguardando',
    statusLabel: 'AGUARDANDO FORNECEDOR',
    vendor: 'Flora Buffet & Gastronomia',
    avatar: '/images/home/avatar-owner-2.png',
    category: 'Buffet',
    rating: '4.7 (184 avaliações)',
    meta: 'Solicitado há 2 dias',
    metrics: [
      { label: 'Orçamento disponível', value: 'R$ 12.000', tone: 'muted' },
      { label: 'Prazo para resposta', value: 'Hoje, 18:00', tone: 'amber' },
    ],
    primaryAction: 'Enviar Lembrete',
    secondaryActions: ['Abrir Chat'],
  },
  {
    id: 'sompro',
    status: 'negociacao',
    statusLabel: 'EM NEGOCIAÇÃO',
    vendor: 'SomPro Audio & DJ',
    avatar: '/images/home/avatar-owner-3.png',
    category: 'Música & Som',
    rating: '4.8 (95 avaliações)',
    meta: 'Online agora',
    metrics: [
      { label: 'Proposta recebida', value: 'R$ 7.800', tone: 'muted' },
      { label: 'Contraproposta enviada', value: 'R$ 7.000', tone: 'blue' },
      { label: 'Diferença', value: 'R$ 800', tone: 'muted' },
    ],
    primaryAction: 'Ver Proposta no Chat',
    secondaryActions: ['Aceitar'],
  },
  {
    id: 'lux',
    status: 'contratado',
    statusLabel: 'CONTRATADO · CONFIRMADO',
    vendor: 'Lux Iluminação Cênica',
    avatar: '/images/home/avatar-client-2.png',
    verified: true,
    category: 'Iluminação',
    rating: 'Contrato Assinado',
    meta: 'Confirmado para 15/11/2025',
    metrics: [{ label: 'Valor contratado', value: 'R$ 5.200 contratado', tone: 'muted' }],
    contractAction: 'Ver Contrato',
  },
]

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
