/**
 * Modelos de domínio da feature `avaliacoes`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type Aspect = {
  key: string
  label: string
  icon: 'atendimento' | 'pontualidade' | 'qualidade'
  initial: number
}

export type ReviewVendor = {
  name: string
  avatar: string
  slug: string
  category: string
  location: string
  currentAvg: number
  event: string
  contractCode: string
  contractValue: string
  date: string
}
