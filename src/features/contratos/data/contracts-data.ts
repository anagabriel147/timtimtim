import type { Contract, PaymentStatus, ServiceStatus } from '../types'

// Mocked data for the frontend-only client "Contratos" prototype.

export const SERVICE_STATUS_META: Record<
  ServiceStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  confirmado: {
    label: 'Confirmado',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  andamento: {
    label: 'Em andamento',
    text: 'text-sky-400',
    bg: 'bg-sky-400/10 border-sky-400/30',
    dot: 'bg-sky-400',
  },
  concluido: {
    label: 'Concluído',
    text: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    dot: 'bg-primary',
  },
  cancelado: {
    label: 'Cancelado',
    text: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/30',
    dot: 'bg-destructive',
  },
}

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; text: string; bg: string; icon: string }
> = {
  garantido: {
    label: 'Pag. Garantido',
    text: 'text-primary',
    bg: 'bg-primary/10 border-primary/40',
    icon: 'lock',
  },
  quitado: {
    label: 'Quitado',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/40',
    icon: 'check',
  },
  aguardando: {
    label: 'Aguardando',
    text: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/40',
    icon: 'hourglass',
  },
  cancelado: {
    label: 'Cancelado',
    text: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/40',
    icon: 'x',
  },
}

export const PAGE = {
  eyebrow: 'CONTRATOS FECHADOS',
  period: 'Novembro 2025',
  title: 'Seus Contratos',
  subtitle: 'Acompanhe seus serviços contratados e os pagamentos protegidos em escrow.',
}

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'lux',
    contractCode: '#TT-2025-0041',
    vendor: 'Lux Iluminação Cênica',
    event: 'Meu Casamento',
    category: 'Iluminação',
    avatar: '/images/home/avatar-client-2.png',
    icon: 'lightbulb',
    date: '15 Nov 2025',
    location: 'São Paulo, SP',
    value: 'R$ 5.200',
    installments: '2 parcelas',
    receiptLabel: 'R$ 3.120 em custódia',
    receiptCaption: '60% garantido',
    serviceStatus: 'confirmado',
    paymentStatus: 'garantido',
    createdAt: 1,
  },
  {
    id: 'floral-jardim',
    contractCode: '#TT-2025-0033',
    vendor: 'Floral Jardim Secreto',
    event: 'Meu Casamento',
    category: 'Decoração',
    avatar: '/images/home/avatar-owner-1.png',
    icon: 'flower',
    date: '15 Nov 2025',
    location: 'São Paulo, SP',
    value: 'R$ 8.400',
    installments: '3 parcelas',
    receiptLabel: 'R$ 8.400 pago',
    receiptCaption: '100% quitado',
    serviceStatus: 'concluido',
    paymentStatus: 'quitado',
    createdAt: 2,
  },
  {
    id: 'foto-luminar',
    contractCode: '#TT-2025-0029',
    vendor: 'Studio Luminar Fotografia',
    event: 'Ensaio Pré-Wedding',
    category: 'Fotografia',
    avatar: '/images/home/avatar-owner-3.png',
    icon: 'camera',
    date: '02 Out 2025',
    location: 'Campos do Jordão, SP',
    value: 'R$ 4.800',
    installments: '2 parcelas',
    receiptLabel: 'R$ 2.400 em custódia',
    receiptCaption: '50% garantido',
    serviceStatus: 'andamento',
    paymentStatus: 'garantido',
    createdAt: 3,
  },
  {
    id: 'doces-sonho',
    contractCode: '#TT-2025-0018',
    vendor: 'Doce Sonho Confeitaria',
    event: 'Chá de Panela',
    category: 'Doces & Bolo',
    avatar: '/images/home/avatar-owner-2.png',
    icon: 'cake',
    date: '22 Set 2025',
    location: 'São Paulo, SP',
    value: 'R$ 3.800',
    installments: '4 parcelas',
    receiptLabel: 'R$ 950 pendente',
    receiptCaption: '25% pago',
    serviceStatus: 'confirmado',
    paymentStatus: 'aguardando',
    createdAt: 4,
  },
  {
    id: 'brinde-cancelado',
    contractCode: '#TT-2025-0009',
    vendor: 'Brinde Fácil Lembranças',
    event: 'Meu Casamento',
    category: 'Lembranças',
    avatar: '/images/home/avatar-owner-1.png',
    icon: 'gift',
    date: 'Ago 2025',
    location: 'Guarulhos, SP',
    value: 'R$ 1.900',
    installments: '—',
    receiptLabel: 'Reembolso processado',
    receiptCaption: 'Contrato encerrado',
    serviceStatus: 'cancelado',
    paymentStatus: 'cancelado',
    createdAt: 5,
  },
]

export const ESCROW_NOTE = {
  title: 'Pagamento Garantido pelo TimTim',
  body: 'Os valores ficam protegidos em escrow até a confirmação do serviço. Você paga com segurança, sempre.',
  cta: 'Saiba mais sobre Escrow',
}

export const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'garantido', label: 'Pag. Garantido' },
  { key: 'quitado', label: 'Quitados' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'cancelado', label: 'Cancelados' },
] as const

export type { Contract, PaymentStatus, ServiceStatus }
