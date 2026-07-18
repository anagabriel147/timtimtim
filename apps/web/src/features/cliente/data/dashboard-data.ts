// Mocked data for the frontend-only client dashboard prototype

export const PAGE = {
  badge: 'MEUS EVENTOS',
  activity: '3 novas actividades',
  title: 'Painel de Controle',
  subtitle: 'Gerencie os seus fornecedores, propostas e datas num só lugar.',
}

export const EVENT = {
  type: 'Casamento',
  date: '14 de Junho, 2025',
  location: 'Lisboa, Portugal',
  label: 'Meu Evento',
  name: 'Casamento da Ana & Pedro',
  daysLeft: 180,
  daysCaption: 'DIAS PARA O GRANDE DIA',
  progress: 42,
  progressLabel: '42% do planeamento concluído',
  contactedAvatars: [
    '/images/home/avatar-owner-1.png',
    '/images/home/avatar-owner-2.png',
    '/images/home/avatar-owner-3.png',
  ],
  metaStats: [
    { icon: 'users', label: '8 fornecedores contactados' },
    { icon: 'star', label: '4 favoritos guardados' },
    { icon: 'check', label: '2 contratos assinados' },
  ],
}

export const PROPOSALS = {
  title: 'Propostas Recebidas',
  live: 'Ao vivo',
  count: 14,
  unit: 'propostas',
  detail: 'de 8 categorias',
  progress: 68,
  progressLabel: '68% das categorias com proposta',
}

export const QUICK_STATS = [
  { icon: 'mail', value: '3', label: 'Msgs não lidas' },
  { icon: 'calendar-check', value: '2', label: 'Visitas agendadas' },
]

export const BUDGET = {
  label: 'Orçamento Total Estimado',
  trend: '+12%',
  value: '€ 18.400',
  progress: 74,
}

export const HISTORY = [
  {
    id: 'noivado',
    icon: 'party',
    title: 'Festa de Noivado',
    status: 'CONCLUÍDO',
    location: 'Zona Sul, RJ',
    date: 'Concluído em Maio 2024',
    vendors: '8 fornecedores',
  },
  {
    id: 'aniversario',
    icon: 'cake',
    title: 'Aniversário de 30 Anos',
    status: 'CONCLUÍDO',
    location: 'Ipanema, RJ',
    date: 'Concluído em Jan 2024',
    vendors: '5 fornecedores',
  },
]

export const EVENT_TYPES = ['Casamento', 'Corporativo', 'Aniversário', 'Outro evento']
