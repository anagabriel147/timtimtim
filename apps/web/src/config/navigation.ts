/**
 * Navegação e identidade do utilizador da área do cliente.
 * Centralizado aqui para que os shells de layout não dependam de dados de feature.
 */

export type NavLink = {
  label: string
  href: string
}

export const CONTRATANTE_USER = {
  name: 'Ana',
  plan: 'Premium',
  avatar: '/images/home/avatar-client-1.png',
} as const

export const CONTRATANTE_TOPBAR_NAV: readonly NavLink[] = [
  { label: 'Explorar', href: '/contratante/fornecedores' },
  { label: 'Início', href: '/contratante' },
  { label: 'Contratos', href: '/contratante/contratos' },
  { label: 'Disputas', href: '/contratante/disputas/nova' },
  { label: 'Mensagens', href: '/contratante/mensagens' },
] as const

export const CONTRATANTE_DASHBOARD_NAV: readonly NavLink[] = [
  { label: 'Início', href: '/contratante' },
  { label: 'Explorar Fornecedores', href: '/contratante/fornecedores' },
  { label: 'Contratos', href: '/contratante/contratos' },
  { label: 'Mensagens', href: '/contratante/mensagens' },
  { label: 'Favoritos', href: '/contratante' },
] as const
