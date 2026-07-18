/**
 * Modelos de domínio da feature `admin`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type AdminNavItem =
  'Visão Geral' | 'Disputas' | 'Métricas Avançadas' | 'Fornecedores' | 'Configurações'

export type AdminKpi = {
  id: string
  icon: string
  tag: string
  value: string
  label: string
  delta: string
  highlight?: boolean
}

export type DisputeSeverity = 'critico' | 'atencao' | 'pendente'

export type AdminDispute = {
  id: string
  contract: string
  severity: DisputeSeverity
  parties: string
  openedAgo: string
  disputeValue: string
  description: string
  sla: string
  slaUrgent: boolean
  messages: number
}

export type HealthMetric = {
  id: string
  icon: string
  label: string
  value: string
  percent: number
  tone: 'primary' | 'warning'
}

export type TopVendorRank = {
  rank: number
  name: string
  category: string
  icon: string
  amount: string
  rating: string
}
