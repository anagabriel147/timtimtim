import type { AdminDispute, AdminKpi, AdminNavItem, DisputeSeverity, HealthMetric, TopVendorRank } from '../types'

export const ADMIN_USER = {
  name: 'Ana Luiza',
  role: 'Master Admin',
  avatar: '/images/admin/avatar-admin.png',
}

export const ADMIN_NAV = ['Visão Geral', 'Disputas', 'Métricas Avançadas', 'Fornecedores', 'Configurações'] as const satisfies readonly AdminNavItem[]

export const ADMIN_HEADER = {
  accessLevel: 'Irrestrito',
  period: 'Jun 2025',
  subtitle: 'Supervisão em tempo real do ecossistema TimTim',
}

export const ADMIN_KPIS: AdminKpi[] = [
  {
    id: 'kpi-1',
    icon: 'users',
    tag: 'FORNECEDORES',
    value: '412',
    label: 'Assinantes Ativos',
    delta: '+23 este mês',
  },
  {
    id: 'kpi-2',
    icon: 'chart',
    tag: 'MRR',
    value: 'R$ 38.200',
    label: 'Faturamento de Assinaturas',
    delta: '+R$ 4.100 vs anterior',
  },
  {
    id: 'kpi-3',
    icon: 'cash',
    tag: 'PLATAFORMA',
    value: 'R$ 12.450',
    label: 'Minhas Comissões · Taxas de Transação',
    delta: '+R$ 1.830 vs anterior',
    highlight: true,
  },
  {
    id: 'kpi-4',
    icon: 'database',
    tag: 'BRUTO',
    value: 'R$ 50.650',
    label: 'Faturamento Total Bruto',
    delta: 'Mês atual acumulado',
  },
]

export const DISPUTE_SEVERITY_META: Record<
  DisputeSeverity,
  { label: string; className: string; icon: string; dotClass: string }
> = {
  critico: {
    label: 'CRÍTICO',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
    icon: 'triangle-alert',
    dotClass: 'text-destructive',
  },
  atencao: {
    label: 'ATENÇÃO',
    className: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
    icon: 'circle-alert',
    dotClass: 'text-yellow-500',
  },
  pendente: {
    label: 'PENDENTE',
    className: 'border-primary/40 bg-primary/10 text-primary',
    icon: 'hourglass',
    dotClass: 'text-primary',
  },
}

export const ADMIN_DISPUTES: AdminDispute[] = [
  {
    id: 'd-1042',
    contract: 'Contrato #1042',
    severity: 'critico',
    parties: 'Cliente vs Guto Decorações',
    openedAgo: 'Aberto há 3 dias',
    disputeValue: 'R$ 8.500',
    description:
      'Cliente alega não entrega de serviço conforme contrato. Fornecedor contesta via e-mail. Sem resolução após 72h.',
    sla: 'SLA vencendo em 24h',
    slaUrgent: true,
    messages: 7,
  },
  {
    id: 'd-1037',
    contract: 'Contrato #1037',
    severity: 'atencao',
    parties: 'Casal Beatriz & Lucas vs Orquestra Éclat',
    openedAgo: 'Aberto há 1 dia',
    disputeValue: 'R$ 4.200',
    description:
      'Divergência sobre cláusula de cancelamento. Fornecedor exige multa de 50%. Cliente questiona validade da cláusula.',
    sla: 'SLA em 48h',
    slaUrgent: false,
    messages: 4,
  },
  {
    id: 'd-1031',
    contract: 'Contrato #1031',
    severity: 'pendente',
    parties: 'Assessora Camila vs Buffet Bella Tavola',
    openedAgo: 'Aberto há 5 horas',
    disputeValue: 'R$ 1.800',
    description:
      'Assessora questiona qualidade dos itens entregues na degustação. Aguardando parecer do fornecedor.',
    sla: 'SLA em 67h',
    slaUrgent: false,
    messages: 2,
  },
  {
    id: 'd-1028',
    contract: 'Contrato #1028',
    severity: 'atencao',
    parties: 'Casal Marina & Rafael vs LuzArte Studio',
    openedAgo: 'Aberto há 2 dias',
    disputeValue: 'R$ 3.600',
    description:
      'Entrega de fotos fora do prazo contratado. Casal solicita desconto proporcional sobre o valor total.',
    sla: 'SLA em 36h',
    slaUrgent: false,
    messages: 5,
  },
  {
    id: 'd-1019',
    contract: 'Contrato #1019',
    severity: 'pendente',
    parties: 'Fornecedor CineFrame Pro vs Casal Aline & JP',
    openedAgo: 'Aberto há 8 horas',
    disputeValue: 'R$ 950',
    description:
      'Fornecedor solicita pagamento de sinal não recebido. Casal alega ter enviado comprovante. Verificação em andamento.',
    sla: 'SLA em 64h',
    slaUrgent: false,
    messages: 3,
  },
]

export const ECOSYSTEM_ACTIVITY = [
  { month: 'Jan', value: 38 },
  { month: 'Fev', value: 52 },
  { month: 'Mar', value: 61 },
  { month: 'Abr', value: 74 },
  { month: 'Mai', value: 88 },
  { month: 'Jun', value: 100 },
]

export const PLATFORM_HEALTH: HealthMetric[] = [
  { id: 'h-1', icon: 'activity', label: 'Uptime do Sistema', value: '99.97%', percent: 99.97, tone: 'primary' },
  { id: 'h-2', icon: 'gauge', label: 'Taxa de Conversão Global', value: '68%', percent: 68, tone: 'primary' },
  { id: 'h-3', icon: 'star', label: 'NPS Médio de Fornecedores', value: '4.7 / 5', percent: 94, tone: 'primary' },
  { id: 'h-4', icon: 'zap', label: 'Disputas Resolvidas no Mês', value: '82%', percent: 82, tone: 'warning' },
]

export const ADMIN_TOP_VENDORS: TopVendorRank[] = [
  { rank: 1, name: 'LuzArte Studio', category: 'Fotografia', icon: 'camera', amount: 'R$ 18.400', rating: '4.9' },
  { rank: 2, name: 'Bella Tavola', category: 'Buffet & Gastronomia', icon: 'utensils', amount: 'R$ 14.200', rating: '4.8' },
  { rank: 3, name: 'Orquestra Éclat', category: 'Música & Entretenimento', icon: 'music', amount: 'R$ 9.800', rating: '4.7' },
  { rank: 4, name: 'Botânica Viva', category: 'Floricultura & Decor', icon: 'flower', amount: 'R$ 7.650', rating: '4.6' },
]

export type { AdminDispute, AdminKpi, AdminNavItem, DisputeSeverity, HealthMetric, TopVendorRank }
