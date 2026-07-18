import type { ChatMessage, Conversation, EventBanner } from '../types'

// Mocked data for the frontend-only client <-> vendor chat prototype.

export const CURRENT_USER = {
  name: 'Mariana Costa',
  plan: 'Premium',
  avatar: '/images/home/avatar-client-1.png',
}

export const NAV = [
  { label: 'Explorar', href: '/contratante/fornecedores' },
  { label: 'Eventos', href: '/contratante' },
  { label: 'Fornecedores', href: '/contratante/fornecedores' },
  { label: 'Mensagens', href: '/contratante/mensagens' },
] as const

export const FILTERS = ['Todos', 'Ativos', 'Propostas'] as const

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'guto',
    name: 'Guto Decorações Premium',
    shortName: 'Guto Decorações',
    avatar: '/images/home/avatar-owner-1.png',
    verified: true,
    online: true,
    presence: 'Online agora · Responde em ~5 min',
    tag: 'Casamento',
    timestamp: '14:32',
    preview: 'Posso adequar o pacote ao...',
    unread: 2,
    active: true,
    banner: {
      title: 'Orçamento Solicitado',
      subtitle: 'Casamento · 15/05/2024 · Salão Jardim das Flores',
      status: 'Aguardando Proposta',
      guests: '120 convidados',
      budget: 'R$ 18.000',
    },
    dateLabel: 'Hoje, 08 de Maio',
    messages: [
      {
        id: 'g1',
        from: 'vendor',
        time: '09:14',
        text: 'Olá, Mariana! Vi a solicitação do orçamento pelo TimTim para o seu casamento em maio. Que data especial!',
      },
      {
        id: 'g2',
        from: 'vendor',
        time: '09:15',
        text: 'Para 120 convidados, posso oferecer pacotes de decoração floral completa, mesa de doces premium e iluminação cênica. Meu portfólio está no link abaixo:',
        linkCard: { label: 'guto-decoracoes.timtim.com.br', href: '#' },
        status: 'Entregue',
      },
      {
        id: 'g3',
        from: 'client',
        time: '09:47',
        text: 'Olá, Guto! Adorei o portfólio, o trabalho do casamento da página 4 ficou incrível. Temos um orçamento de aproximadamente R$ 18.000 para decoração. É possível trabalhar dentro desse valor?',
        status: 'Lida',
      },
      {
        id: 'g4',
        from: 'vendor',
        time: '10:02',
        text: 'Sim, posso adequar o pacote ao orçamento! Preparei uma prévia visual para vocês:',
        imageSrc: '/images/fornecedores/portfolio-1.png',
      },
    ],
  },
  {
    id: 'flora',
    name: 'Flora Buffet',
    shortName: 'Flora Buffet',
    avatar: '/images/home/avatar-owner-2.png',
    verified: true,
    online: false,
    presence: 'Visto por último há 2h',
    tag: 'Casamento',
    timestamp: '11:08',
    preview: 'Proposta enviada! Aguardo...',
    unread: 0,
    dateLabel: 'Hoje, 08 de Maio',
    messages: [
      {
        id: 'f1',
        from: 'vendor',
        time: '11:08',
        text: 'Proposta enviada! Aguardo o seu retorno para fecharmos o menu de degustação.',
        status: 'Entregue',
      },
    ],
  },
  {
    id: 'sompro',
    name: 'SomPro Audio',
    shortName: 'SomPro Audio',
    avatar: '/images/home/avatar-owner-3.png',
    verified: false,
    online: true,
    presence: 'Online agora',
    tag: 'Formatura',
    timestamp: 'Seg',
    preview: 'Claro, temos disponibilidade.',
    unread: 0,
    dateLabel: 'Segunda-feira',
    messages: [
      {
        id: 's1',
        from: 'vendor',
        time: '16:20',
        text: 'Claro, temos disponibilidade para a sua data de formatura. Quer que eu envie o pacote completo?',
        status: 'Entregue',
      },
    ],
  },
  {
    id: 'lux',
    name: 'Lux Iluminação',
    shortName: 'Lux Iluminação',
    avatar: '/images/home/avatar-client-2.png',
    verified: false,
    online: false,
    presence: 'Visto por último ontem',
    timestamp: 'Dom',
    preview: 'Olá! Vi seu evento no TimTim...',
    unread: 0,
    dateLabel: 'Domingo',
    messages: [
      {
        id: 'l1',
        from: 'vendor',
        time: '10:00',
        text: 'Olá! Vi seu evento no TimTim e adoraríamos participar com a iluminação.',
        status: 'Entregue',
      },
    ],
  },
  {
    id: 'fotovideo',
    name: 'Foto & Vídeo Arte',
    shortName: 'Foto & Vídeo Arte',
    avatar: '/images/home/avatar-client-3.png',
    verified: true,
    online: false,
    presence: 'Visto por último sábado',
    timestamp: 'Sáb',
    preview: 'Portfólio enviado. Qualquer...',
    unread: 0,
    dateLabel: 'Sábado',
    messages: [
      {
        id: 'fv1',
        from: 'vendor',
        time: '18:45',
        text: 'Portfólio enviado. Qualquer dúvida estou à disposição!',
        status: 'Entregue',
      },
    ],
  },
  {
    id: 'buffet-gourmet',
    name: 'Buffet Gourmet',
    shortName: 'Buffet Gourmet',
    avatar: '',
    verified: false,
    online: false,
    presence: 'Conversa arquivada',
    timestamp: 'Mai 2',
    preview: 'Proposta cancelada.',
    unread: 0,
    archived: true,
    dateLabel: 'Maio',
    messages: [
      {
        id: 'bg1',
        from: 'system',
        time: '12:00',
        text: 'Proposta cancelada.',
      },
    ],
  },
]

export const COMPOSER = {
  placeholderPrefix: 'Digite sua mensagem para',
  secureNote: 'Conversa segura pelo TimTim',
  hint: 'Enter para enviar · Shift+Enter para nova linha',
}

export type { ChatMessage, Conversation, EventBanner }
