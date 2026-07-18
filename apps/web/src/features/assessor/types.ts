/**
 * Modelos de domínio da feature `assessor`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type AdvisorChatMessage = {
  id: string
  from: 'advisor' | 'client' | 'system'
  time: string
  text?: string
  status?: 'Entregue' | 'Enviada' | 'Lida'
}

export type AdvisorEventBanner = {
  title: string
  subtitle: string
  status: string
  guests: string
  budget: string
}

export type AdvisorConversation = {
  id: string
  name: string
  shortName: string
  company: string
  avatar: string
  verified: boolean
  online: boolean
  presence: string
  tag?: string
  timestamp: string
  preview: string
  unread: number
  archived?: boolean
  active?: boolean
  banner?: AdvisorEventBanner
  dateLabel: string
  messages: AdvisorChatMessage[]
}

export type AdvisorNavItem = 'Início' | 'Afiliados' | 'Mensagens'

export type WeddingPhase =
  'FINALIZAÇÃO' | 'CONTRATAÇÃO' | 'PLANEJAMENTO' | 'BRIEFING' | 'ONBOARDING'

export type AdvisorWedding = {
  id: string
  couple: string
  initials: string
  date: string
  venue: string
  phase: WeddingPhase
  progress: number
  tasksDone: number
  tasksTotal: number
}

export type Commission = {
  id: string
  label: string
  vendor: string
  amount: string
  date: string
  icon: string
}

export type ReferralStatus = 'confirmada' | 'pendente' | 'analise'

export type Referral = {
  id: string
  couple: string
  initials: string
  date: string
  vendor: string
  vendorCategory: string
  vendorIcon: string
  status: ReferralStatus
  contractValue: string
  commission: string
}

export type TopVendor = {
  id: string
  name: string
  amount: string
  icon: string
  percent: number
  note?: string
}
