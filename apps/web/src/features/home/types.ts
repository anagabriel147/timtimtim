/**
 * Modelos de domínio da feature `home`.
 * Fonte única de verdade dos tipos — a camada `data/` e os componentes consomem daqui.
 */

export type Vendor = {
  id: string
  name: string
  category: string
  location: string
  rating: number
  reviews: number
  priceLabel: string
  price: string
  image: string
  avatar: string
}

export type Testimonial = {
  id: string
  rating: number
  quote: string
  name: string
  meta: string
  avatar: string
}
