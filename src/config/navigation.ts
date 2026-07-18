/**
 * Navegação e identidade do utilizador da área do cliente.
 * Centralizado aqui para que os shells de layout não dependam de dados de feature.
 */

export type NavLink = {
  label: string
  href: string
}

export const CLIENT_USER = {
  name: 'Ana',
  plan: 'Premium',
  avatar: '/images/home/avatar-client-1.png',
} as const

export const CLIENT_TOPBAR_NAV: readonly NavLink[] = [
  { label: 'Explorar', href: '/cliente/fornecedores' },
  { label: 'Início', href: '/cliente' },
  { label: 'Contratos', href: '/cliente/contratos' },
  { label: 'Disputas', href: '/cliente/disputas/nova' },
  { label: 'Mensagens', href: '/cliente/mensagens' },
] as const

export const CLIENT_DASHBOARD_NAV: readonly NavLink[] = [
  { label: 'Início', href: '/cliente' },
  { label: 'Explorar Fornecedores', href: '/cliente/fornecedores' },
  { label: 'Contratos', href: '/cliente/contratos' },
  { label: 'Mensagens', href: '/cliente/mensagens' },
  { label: 'Favoritos', href: '/cliente' },
] as const
