import type { Testimonial, Vendor } from '../types'

// ---------------------------------------------------------------------------
// Mocked data (frontend-only prototype — no database required)
// ---------------------------------------------------------------------------

export const NAV_LINKS = [
  { label: 'Explorar Fornecedores', href: '#fornecedores' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Categorias', href: '#categorias' },
  { label: 'Inspiração', href: '#inspiracao' },
] as const

export const HERO = {
  badge: '+1.200 fornecedores verificados em Portugal',
  titleLead: 'Encontre os melhores fornecedores para o seu',
  titleAccent: 'grande dia',
  subtitle:
    'Compare orçamentos, leia avaliações reais e contrate com confiança. De casamentos a eventos corporativos — tudo num só lugar.',
  vendorTypes: [
    'Tipo de fornecedor',
    'Fotografia',
    'Catering',
    'Decoração',
    'Música e DJ',
    'Espaços',
  ],
  stats: [
    { value: '1.2K+', label: 'Fornecedores' },
    { value: '8.400+', label: 'Eventos Realizados' },
    { value: '4.9', label: 'Avaliação Média', accent: true },
    { value: '100%', label: 'Verificados' },
  ],
} as const

export const FEATURED_VENDORS: Vendor[] = [
  {
    id: 'luis-monteiro',
    name: 'Luís Monteiro Studio',
    category: 'FOTOGRAFIA',
    location: 'Lisboa, Portugal',
    rating: 5.0,
    reviews: 128,
    priceLabel: 'A partir de',
    price: '€850',
    image: '/images/home/vendor-photography.png',
    avatar: '/images/home/avatar-owner-1.png',
  },
  {
    id: 'saveur-catering',
    name: 'Saveur Catering',
    category: 'CATERING',
    location: 'Porto, Portugal',
    rating: 4.8,
    reviews: 94,
    priceLabel: 'A partir de',
    price: '€35',
    image: '/images/home/vendor-catering.png',
    avatar: '/images/home/avatar-owner-2.png',
  },
  {
    id: 'bloom-co',
    name: 'Bloom & Co Atelier',
    category: 'DECORAÇÃO',
    location: 'Cascais, Portugal',
    rating: 5.0,
    reviews: 207,
    priceLabel: 'A partir de',
    price: '€1.200',
    image: '/images/home/vendor-decoration.png',
    avatar: '/images/home/avatar-owner-3.png',
  },
]

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Descreva o Evento',
    text: 'Indique o tipo de evento, data, localização e número de convidados. Leva menos de 2 minutos.',
  },
  {
    step: 2,
    title: 'Receba Propostas',
    text: 'Os melhores fornecedores da sua região enviam orçamentos personalizados diretamente para si.',
  },
  {
    step: 3,
    title: 'Contrate com Confiança',
    text: 'Compare, converse e feche o acordo com o fornecedor ideal. Tudo protegido pela plataforma.',
  },
] as const

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'mariana',
    rating: 5,
    quote:
      'Encontrámos o nosso fotógrafo perfeito em menos de 48h. A plataforma é intuitiva e as propostas foram todas muito detalhadas. Superou todas as expectativas!',
    name: 'Mariana Costa',
    meta: 'Casamento · Lisboa',
    avatar: '/images/home/avatar-client-1.png',
  },
  {
    id: 'ricardo',
    rating: 5,
    quote:
      'Organizei o evento anual da empresa através da TimTim. Recebi 12 propostas de catering e decoração em menos de 24h. Equipa fantástica e resultado impecável.',
    name: 'Ricardo Alves',
    meta: 'Evento Corporativo · Porto',
    avatar: '/images/home/avatar-client-2.png',
  },
  {
    id: 'sofia',
    rating: 4.5,
    quote:
      'A transparência nas avaliações faz toda a diferença. Sabia exatamente o que estava a contratar. O DJ do aniversário da minha filha foi absolutamente incrível!',
    name: 'Sofia Rodrigues',
    meta: 'Aniversário · Braga',
    avatar: '/images/home/avatar-client-3.png',
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Plataforma',
    links: ['Explorar Fornecedores', 'Criar Evento', 'Como Funciona', 'Preços'],
  },
  {
    title: 'Fornecedores',
    links: ['Registar como Fornecedor', 'Área do Fornecedor', 'Boas práticas', 'Suporte'],
  },
  {
    title: 'Legal',
    links: ['Privacidade', 'Termos de Uso', 'Cookies', 'RGPD'],
  },
] as const

export const EVENT_TYPES = ['Casamento', 'Corporativo', 'Aniversário', 'Outro evento'] as const

export const MODAL_TRUST = ['100% gratuito', 'Dados protegidos', 'Respostas em 24h'] as const

export type { Testimonial, Vendor }
