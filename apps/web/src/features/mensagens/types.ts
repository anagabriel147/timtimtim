/**
 * Modelos de domínio da feature `mensagens`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type ChatMessage = {
  id: string
  from: 'vendor' | 'client' | 'system'
  time: string
  text?: string
  linkCard?: { label: string; href: string }
  imageSrc?: string
  status?: 'Entregue' | 'Enviada' | 'Lida'
}

export type EventBanner = {
  title: string
  subtitle: string
  status: string
  guests: string
  budget: string
}

export type Conversation = {
  id: string
  name: string
  shortName: string
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
  banner?: EventBanner
  dateLabel: string
  messages: ChatMessage[]
}
