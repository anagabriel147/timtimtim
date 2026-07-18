import type {
  AdvisorNavItem,
  AdvisorWedding,
  Commission,
  Referral,
  ReferralStatus,
  TopVendor,
  WeddingPhase,
} from '../types'

// Mocked data for the advisor (assessor) area — frontend-only prototype.

export const ADVISOR_NAV = [
  'Início',
  'Afiliados',
  'Mensagens',
] as const satisfies readonly AdvisorNavItem[]

export const ADVISOR_USER = {
  name: 'Isabela M.',
  firstName: 'Isabela',
  tier: 'Nível 2 · Certificada TimTim',
  avatar: '/images/home/avatar-advisor-1.png',
}

export const ADVISOR_STATS = [
  {
    id: 'active',
    label: 'Casamentos Ativos',
    value: '6',
    tag: 'ATIVOS',
    delta: '+1 este mês',
    icon: 'help',
  },
  {
    id: 'refs',
    label: 'Indicações Geradas',
    value: '34',
    tag: 'TOTAL',
    delta: '+8 esta semana',
    icon: 'link',
  },
  {
    id: 'comms',
    label: 'Comissões Recebidas',
    value: 'R$8,4k',
    tag: 'MÊS',
    delta: '+R$2,1k vs anterior',
    icon: 'rs',
  },
  {
    id: 'score',
    label: 'Avaliação Média',
    value: '4.9',
    tag: 'SCORE',
    delta: 'Top 3% assessoras',
    icon: 'star',
  },
] as const

export const ADVISOR_WEDDINGS: AdvisorWedding[] = [
  {
    id: 'w-1',
    couple: 'Aline & João Pedro',
    initials: 'AJ',
    date: '19 Jul 2025',
    venue: 'Fazenda Vila Rosa · Campinas',
    phase: 'FINALIZAÇÃO',
    progress: 87,
    tasksDone: 24,
    tasksTotal: 28,
  },
  {
    id: 'w-2',
    couple: 'Beatriz & Lucas',
    initials: 'BL',
    date: '09 Ago 2025',
    venue: 'Espaço Flamboyant · Goiânia',
    phase: 'CONTRATAÇÃO',
    progress: 62,
    tasksDone: 18,
    tasksTotal: 28,
  },
  {
    id: 'w-3',
    couple: 'Camila & Fernando',
    initials: 'CF',
    date: '27 Set 2025',
    venue: 'Quinta das Flores · Curitiba',
    phase: 'PLANEJAMENTO',
    progress: 41,
    tasksDone: 12,
    tasksTotal: 28,
  },
  {
    id: 'w-4',
    couple: 'Marina & Rafael',
    initials: 'MR',
    date: '15 Nov 2025',
    venue: 'Hotel Grand Hyatt · São Paulo',
    phase: 'BRIEFING',
    progress: 22,
    tasksDone: 6,
    tasksTotal: 28,
  },
  {
    id: 'w-5',
    couple: 'Tatiana & Gustavo',
    initials: 'TG',
    date: '07 Fev 2026',
    venue: 'Sítio Boa Vista · Belo Horizonte',
    phase: 'ONBOARDING',
    progress: 9,
    tasksDone: 2,
    tasksTotal: 28,
  },
  {
    id: 'w-6',
    couple: 'Priscila & Samuel',
    initials: 'PS',
    date: '14 Mar 2026',
    venue: 'Chácara Paraíso · Ribeirão Preto',
    phase: 'ONBOARDING',
    progress: 5,
    tasksDone: 1,
    tasksTotal: 28,
  },
]

export const PHASE_STYLES: Record<WeddingPhase, string> = {
  FINALIZAÇÃO: 'border-primary/40 bg-primary/10 text-primary',
  CONTRATAÇÃO: 'border-primary/40 bg-primary/10 text-primary',
  PLANEJAMENTO: 'border-border bg-muted/40 text-muted-foreground',
  BRIEFING: 'border-border bg-muted/40 text-muted-foreground',
  ONBOARDING: 'border-border bg-muted/40 text-muted-foreground',
}

export const COUPON = {
  code: 'ISABELA-TT25',
  uses: 34,
  converted: 19,
  conversion: '56%',
}

export const RECENT_COMMISSIONS: Commission[] = [
  {
    id: 'c-1',
    label: 'Fotografia — Aline & JP',
    vendor: 'Fornecedor: LuzArte Studio',
    amount: '+R$480',
    date: 'Jun 10',
    icon: 'camera',
  },
  {
    id: 'c-2',
    label: 'Banda — Beatriz & Lucas',
    vendor: 'Fornecedor: Orquestra Éclat',
    amount: '+R$1.200',
    date: 'Jun 08',
    icon: 'music',
  },
  {
    id: 'c-3',
    label: 'Floricultura — Camila & F',
    vendor: 'Fornecedor: Botânica Viva',
    amount: '+R$640',
    date: 'Jun 05',
    icon: 'flower',
  },
  {
    id: 'c-4',
    label: 'Buffet — Marina & Rafael',
    vendor: 'Fornecedor: Bella Tavola',
    amount: '+R$2.100',
    date: 'Jun 02',
    icon: 'utensils',
  },
  {
    id: 'c-5',
    label: 'Videografia — Aline & JP',
    vendor: 'Fornecedor: CineFrame Pro',
    amount: '+R$760',
    date: 'Mai 28',
    icon: 'video',
  },
]

export const BALANCE = {
  toReceive: 'R$ 5.180',
  goal: 'R$ 10k',
  goalPercent: 52,
}

export const COMMISSION_EVOLUTION = [
  { month: 'Jan', value: 2400 },
  { month: 'Fev', value: 3100 },
  { month: 'Mar', value: 2800 },
  { month: 'Abr', value: 4600 },
  { month: 'Mai', value: 6400 },
  { month: 'Jun', value: 8400 },
]

// ---- Referrals & earnings (affiliate program) ----
export const REFERRAL_SUMMARY = {
  period: 'Janeiro — Junho 2025',
  updatedAt: 'hoje às 09:42',
  couponsApplied: 24,
  couponsGoal: 32,
  couponsPercent: 75,
  confirmed: 18,
  conversionRate: 75,
  contractsVolume: 'R$248k',
  contractsDelta: '+R$42k vs. mesmo período',
  totalCommissions: 'R$12,4k',
  averagePerReferral: 'R$689/indicação',
}

export const REFERRAL_COUPON = {
  code: 'ISABELA-TT25',
  uses: 24,
  converted: 18,
  conversion: '75%',
}

export const REFERRAL_STATUS_META: Record<ReferralStatus, { label: string; className: string }> = {
  confirmada: { label: 'CONFIRMADA', className: 'border-primary/40 bg-primary/10 text-primary' },
  pendente: {
    label: 'PENDENTE',
    className: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
  },
  analise: {
    label: 'EM ANÁLISE',
    className: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
  },
}

export const REFERRAL_FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'pendente', label: 'Pendentes' },
] as const

export const REFERRALS: Referral[] = [
  {
    id: 'r-1',
    couple: 'Ana Luiza & Rodrigo',
    initials: 'AR',
    date: '12 Jul 2025',
    vendor: 'Guto Decorações',
    vendorCategory: 'Decoração',
    vendorIcon: 'bed',
    status: 'confirmada',
    contractValue: 'R$ 15.000',
    commission: 'R$ 750,00',
  },
  {
    id: 'r-2',
    couple: 'Beatriz & Lucas',
    initials: 'BL',
    date: '09 Ago 2025',
    vendor: 'Orquestra Éclat',
    vendorCategory: 'Música ao Vivo',
    vendorIcon: 'music',
    status: 'confirmada',
    contractValue: 'R$ 24.000',
    commission: 'R$ 1.200,00',
  },
  {
    id: 'r-3',
    couple: 'Camila & Fernando',
    initials: 'CF',
    date: '27 Set 2025',
    vendor: 'Botânica Viva',
    vendorCategory: 'Floricultura',
    vendorIcon: 'flower',
    status: 'confirmada',
    contractValue: 'R$ 12.800',
    commission: 'R$ 640,00',
  },
  {
    id: 'r-4',
    couple: 'Marina & Rafael',
    initials: 'MR',
    date: '15 Nov 2025',
    vendor: 'Bella Tavola',
    vendorCategory: 'Buffet & Gastronomia',
    vendorIcon: 'utensils',
    status: 'confirmada',
    contractValue: 'R$ 42.000',
    commission: 'R$ 2.100,00',
  },
  {
    id: 'r-5',
    couple: 'Aline & João Pedro',
    initials: 'AJ',
    date: '19 Jul 2025',
    vendor: 'LuzArte Studio',
    vendorCategory: 'Fotografia',
    vendorIcon: 'camera',
    status: 'confirmada',
    contractValue: 'R$ 9.600',
    commission: 'R$ 480,00',
  },
  {
    id: 'r-6',
    couple: 'Tatiana & Gustavo',
    initials: 'TG',
    date: '07 Fev 2026',
    vendor: 'CineFrame Pro',
    vendorCategory: 'Videografia',
    vendorIcon: 'video',
    status: 'pendente',
    contractValue: 'R$ 15.200',
    commission: 'R$ 760,00',
  },
  {
    id: 'r-7',
    couple: 'Priscila & Samuel',
    initials: 'PS',
    date: '14 Mar 2026',
    vendor: 'Elite Beauty Studio',
    vendorCategory: 'Cabelo & Maquiagem',
    vendorIcon: 'scissors',
    status: 'analise',
    contractValue: 'R$ 8.400',
    commission: 'R$ 420,00',
  },
  {
    id: 'r-8',
    couple: 'Marina & Rafael',
    initials: 'MR',
    date: '15 Nov 2025',
    vendor: 'ClassicRide Transfers',
    vendorCategory: 'Transporte VIP',
    vendorIcon: 'car',
    status: 'confirmada',
    contractValue: 'R$ 6.800',
    commission: 'R$ 340,00',
  },
  {
    id: 'r-9',
    couple: 'Aline & João Pedro',
    initials: 'AJ',
    date: '19 Jul 2025',
    vendor: 'Doces da Vovó Iara',
    vendorCategory: 'Confeitaria & Bolo',
    vendorIcon: 'cake',
    status: 'confirmada',
    contractValue: 'R$ 5.200',
    commission: 'R$ 260,00',
  },
]

export const TOP_VENDORS: TopVendor[] = [
  { id: 'tv-1', name: 'Bella Tavola', amount: 'R$2.100', icon: 'utensils', percent: 100 },
  { id: 'tv-2', name: 'Orquestra Éclat', amount: 'R$1.200', icon: 'music', percent: 57 },
  { id: 'tv-3', name: 'Guto Decorações', amount: 'R$750', icon: 'bed', percent: 36 },
  {
    id: 'tv-4',
    name: 'CineFrame Pro',
    amount: 'R$760*',
    icon: 'video',
    percent: 36,
    note: 'pendente',
  },
  { id: 'tv-5', name: 'Botânica Viva', amount: 'R$640', icon: 'flower', percent: 30 },
]

export const CONVERSION_TREND = [
  { month: 'Jan', cupons: 3, convertidos: 2 },
  { month: 'Fev', cupons: 4, convertidos: 3 },
  { month: 'Mar', cupons: 4, convertidos: 3 },
  { month: 'Abr', cupons: 5, convertidos: 4 },
  { month: 'Mai', cupons: 4, convertidos: 3 },
  { month: 'Jun', cupons: 4, convertidos: 3 },
]

export const REFERRAL_BALANCE = {
  toReceive: 'R$ 5.180',
}

export type {
  AdvisorNavItem,
  AdvisorWedding,
  Commission,
  Referral,
  ReferralStatus,
  TopVendor,
  WeddingPhase,
}
