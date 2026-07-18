/**
 * Modelos de domínio da feature `fornecedor`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type SupplierChatMessage = {
  id: string
  from: 'supplier' | 'client' | 'system'
  time: string
  text?: string
  status?: 'Entregue' | 'Enviada' | 'Lida'
}

export type SupplierEventBanner = {
  title: string
  subtitle: string
  status: string
  guests: string
  budget: string
}

export type SupplierConversation = {
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
  banner?: SupplierEventBanner
  dateLabel: string
  messages: SupplierChatMessage[]
}

export type SupplierNavItem =
  | 'Início'
  | 'Propostas'
  | 'Contratos'
  | 'Carteira'
  | 'Relatórios'
  | 'Disputas'
  | 'Mensagens'

export type Opportunity = {
  id: string
  title: string
  company: string
  location: string
  tag: 'URGENTE' | 'ALTO VALOR' | 'RECORRENTE'
  budget: string
  description: string
  expires: string
  proposals: number
  icon: string
  // Vínculo com o evento/demanda criado pelo cliente
  eventName: string
  eventCode: string
  clientName: string
  eventDate: string
}

export type ProposalItem = {
  id: string
  description: string
  qty: number
  unit: string
  unitValue: number
}

export type ProposalDefault = {
  title: string
  category: string
  deadline: string
  amount: number
  paymentTerm: string
  validity: string
  validUntil: string
  items: ProposalItem[]
  scope: string
}

export type ProposalStatus = 'aceita' | 'analise' | 'contrato' | 'revisao' | 'finalizada' | 'recusada'

export type SentProposal = {
  id: string
  title: string
  client: string
  location: string
  icon: string
  category: string
  value: string
  sentDate: string
  sentAgo: string
  engagement: number
  views: number
  status: ProposalStatus
}

export type ContractStatus = 'garantido' | 'quitado' | 'aguardando' | 'cancelado'

export type SupplierContract = {
  id: string
  title: string
  client: string
  code: string
  icon: string
  date: string
  location: string
  category: string
  value: string
  installments: string
  receivedLabel: string
  receivedNote: string
  receivedPercent: number
  status: ContractStatus
}

export type SupplierMessage = {
  id: string
  name: string
  company: string
  preview: string
  time: string
  avatar: string
  unread: boolean
}
