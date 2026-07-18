// Mocked JSON data for the "Criar Evento" wizard (frontend-only prototype)

export const WIZARD_STEPS = [
  { id: 1, key: 'detalhes', label: 'Detalhes' },
  { id: 2, key: 'localizacao', label: 'Localização' },
  { id: 3, key: 'servicos', label: 'Serviços' },
] as const

export const EVENT_TYPES = [
  { id: 'casamento', label: 'Casamento', icon: 'gem' },
  { id: 'noivado', label: 'Noivado', icon: 'heart' },
  { id: 'aniversario', label: 'Aniversário', icon: 'cake' },
  { id: 'batizado', label: 'Batizado', icon: 'baby' },
  { id: 'corporativo', label: 'Corporativo', icon: 'briefcase' },
  { id: 'tematica', label: 'Festa Temática', icon: 'party-popper' },
  { id: 'formatura', label: 'Formatura', icon: 'graduation-cap' },
  { id: 'conferencia', label: 'Conferência', icon: 'presentation' },
  { id: 'gala', label: 'Gala / Jantar', icon: 'wine' },
  { id: 'outro', label: 'Outro', icon: 'sparkles' },
] as const

export const COUNTRIES = ['Portugal', 'Brasil', 'Espanha', 'França'] as const

export const DISTRICTS = ['Lisboa', 'Porto', 'Braga', 'Faro', 'Coimbra', 'Aveiro'] as const

export const VENUE_STATUSES = [
  {
    id: 'confirmado',
    label: 'Confirmado',
    description: 'O espaço já está reservado e confirmado.',
    icon: 'check',
    accent: 'primary',
  },
  {
    id: 'negociacao',
    label: 'Em Negociação',
    description: 'Estou a avaliar opções de espaço.',
    icon: 'handshake',
    accent: 'amber',
  },
  {
    id: 'procurar',
    label: 'Ainda a procurar',
    description: 'Ainda não tenho espaço definido.',
    icon: 'search',
    accent: 'muted',
  },
] as const

export const SERVICE_CATEGORIES = [
  {
    id: 'bar',
    label: 'Bar de Coquetéis',
    description: 'Open bar & mixologia',
    icon: 'martini',
  },
  {
    id: 'buffet',
    label: 'Buffet / Gastronomia',
    description: 'Catering & menu completo',
    icon: 'utensils',
  },
  {
    id: 'dj',
    label: 'DJs & Sonorização',
    description: 'Som profissional & DJ',
    icon: 'disc',
  },
  {
    id: 'decoracao',
    label: 'Decoração & Cenografia',
    description: 'Flores, styling & ambiance',
    icon: 'flower',
  },
  {
    id: 'fotografia',
    label: 'Fotografia & Filme',
    description: 'Fotos, vídeo & drone',
    icon: 'camera',
  },
  {
    id: 'banda',
    label: 'Banda / Música ao Vivo',
    description: 'Banda & artistas ao vivo',
    icon: 'music',
  },
] as const
