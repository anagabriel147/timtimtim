/**
 * Modelos de domínio da feature `cadastro`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type BillingCycle = 'mensal' | 'anual'

export type SummaryLine = {
  label: string
  value: string
  discount?: boolean
}

export type BillingInfo = {
  statusBadge: string
  cycleSuffix: string
  description: string
  original?: string
  discountBadge?: string
  intPart: string
  cents: string
  period: string
  priceNote: string
  bonus?: { title: string; tag: string; text: string }
  installment: string
  summaryTag: string
  summaryPeriod: string
  summary: SummaryLine[]
  total: string
  nextCharge: string
  monthlyEquivalent: string
}

export type PlanHero = {
  badge: string
  badgeAsPill: boolean
  titleLead: string
  titleAccent: string
  subtitle: string
}

export type PlanData = {
  role: 'fornecedor' | 'assessor'
  name: string
  brand: string
  brandSubtitle?: string
  badgeLabel: string
  headerVariant: 'status' | 'brand'
  showStats: boolean
  hero: PlanHero
  successTitle: string
  successText: string
  successItems: string[]
  features: { title: string; description: string; tag?: string; gold?: boolean }[]
  stats: { value: string; accent?: string; label: string }[]
  guarantee: { title: string; text: string }
  billing: Record<BillingCycle, BillingInfo>
}
