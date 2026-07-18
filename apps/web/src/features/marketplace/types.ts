/**
 * Modelos de domínio da feature `marketplace`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type VendorCard = {
  slug: string
  name: string
  category: string
  categoryIcon: string
  location: string
  neighborhood: string
  rating: number
  reviews: number
  cover: string
  isPlaceholder?: boolean
  verified: boolean
  tags: string[]
  reviewAvatars: string[]
}
