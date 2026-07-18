import type { Aspect, ReviewVendor } from '../types'

// Fallback vendor when a contract id isn't found in the store.
export const DEFAULT_VENDOR: ReviewVendor = {
  name: 'Guto Decorações Premium',
  avatar: '/images/fornecedores/decor-luxe.png',
  slug: 'guto-decoracoes-premium',
  category: 'Decoração & Flores',
  location: 'Rio de Janeiro, RJ',
  currentAvg: 4.7,
  event: 'Casamento Barra da Tijuca',
  contractCode: '#CT-2025-089',
  contractValue: 'R$ 8.500',
  date: '14 Jun 2025',
}

export const RATING_LABELS: Record<number, string> = {
  1: 'Muito Ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Muito Bom',
  5: 'Excelente',
}

export const ASPECTS: Aspect[] = [
  { key: 'atendimento', label: 'Atendimento', icon: 'atendimento', initial: 4 },
  { key: 'pontualidade', label: 'Pontualidade', icon: 'pontualidade', initial: 5 },
  { key: 'qualidade', label: 'Qualidade', icon: 'qualidade', initial: 3 },
]

export const HIGHLIGHTS: { label: string; icon: string }[] = [
  { label: 'Atencioso', icon: 'heart' },
  { label: 'Criativo', icon: 'sparkles' },
  { label: 'Pontual', icon: 'clock' },
  { label: 'Boa comunicação', icon: 'message' },
  { label: 'Qualidade superior', icon: 'gem' },
  { label: 'Ótimo custo-benefício', icon: 'tag' },
  { label: 'Profissional', icon: 'briefcase' },
  { label: 'Superou expectativas', icon: 'star' },
]

export const DEFAULT_HIGHLIGHTS = ['Criativo', 'Pontual', 'Qualidade superior']

export const WRITING_TIPS = [
  'Descreva o que mais te surpreendeu positivamente',
  'Mencione a experiência no dia do evento',
  'Ajude outros casais a tomarem a melhor decisão',
]

export const MAX_CHARS = 1000
export const MIN_CHARS = 50

// Confirmation impact metrics (mocked)
export const IMPACT = [
  { icon: 'users', value: '+127', label: 'Casais que verão sua avaliação' },
  { icon: 'chart', value: '38ª', label: 'Avaliação publicada na plataforma' },
  { icon: 'history', value: '48h', label: 'Para editar sua avaliação' },
]

export const SHARE_TARGETS = [
  { label: 'WhatsApp', icon: 'whatsapp' },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'Facebook', icon: 'facebook' },
]

export type { Aspect, ReviewVendor }
