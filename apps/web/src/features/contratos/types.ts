/**
 * Modelos de domínio da feature `contratos`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type ServiceStatus = 'confirmado' | 'andamento' | 'concluido' | 'cancelado'

export type PaymentStatus = 'garantido' | 'quitado' | 'aguardando' | 'cancelado'

export type Contract = {
  id: string
  contractCode: string
  vendor: string
  event: string
  category: string
  avatar: string
  icon: string
  date: string
  location: string
  value: string
  installments: string
  receiptLabel: string
  receiptCaption: string
  serviceStatus: ServiceStatus
  paymentStatus: PaymentStatus
  createdAt: number
}
