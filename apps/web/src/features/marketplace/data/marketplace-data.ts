import type { VendorCard } from '../types'

// Mocked data (frontend-only prototype) for the "Explorar Fornecedores" flow.

/* ---------------- Landing (Buscar Fornecedores) ---------------- */

export const LANDING = {
  eyebrow: 'MARKETPLACE DE EVENTOS',
  titleLead: 'Encontre os melhores',
  titleAccent: 'fornecedores',
  titleTail: 'para seu evento',
  subtitle:
    'Conectamos você aos profissionais mais qualificados da sua região, de forma rápida e sem complicação.',
  stats: [
    { value: '4.200+', label: 'Fornecedores ativos' },
    { value: '98%', label: 'Satisfação dos clientes' },
    { value: '120', label: 'Cidades cobertas' },
  ],
  liveLabel: 'Plataforma ao vivo',
  quickCaption: 'Acesso rápido às categorias mais populares',
}

export const CATEGORY_OPTIONS = [
  'Fotografia',
  'Buffet / Gastronomia',
  'Decoração',
  'DJs & Sonorização',
  'Bar & Drinks',
  'Iluminação',
]

export const CITY_OPTIONS = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Lisboa, Portugal',
  'Porto, Portugal',
  'Belo Horizonte, MG',
]

export const QUICK_CATEGORIES = [
  { label: 'Fotografia', icon: 'image' },
  { label: 'Buffet', icon: 'utensils' },
  { label: 'Decoração', icon: 'sparkles' },
  { label: 'DJs', icon: 'music' },
  { label: 'Bar', icon: 'wine' },
]

/* ---------------- Results (filters + cards) ---------------- */

export const RESULT_FILTERS = {
  categories: [
    { label: 'Fotografia', icon: 'camera', count: 142, checked: true },
    { label: 'Buffet', icon: 'utensils', count: 89, checked: false },
    { label: 'Decoração', icon: 'sparkles', count: 67, checked: false },
    { label: 'DJs', icon: 'music', count: 54, checked: false },
    { label: 'Bar & Drinks', icon: 'wine', count: 38, checked: false },
    { label: 'Iluminação', icon: 'lightbulb', count: 29, checked: false },
  ],
  neighborhoods: [
    { label: 'Pinheiros', count: 34, checked: true },
    { label: 'Vila Madalena', count: 28, checked: false },
    { label: 'Moema', count: 19, checked: false },
    { label: 'Jardins', count: 22, checked: false },
    { label: 'Itaim Bibi', count: 17, checked: false },
  ],
  ratings: [
    { label: '5.0', stars: 5, count: 12, checked: true },
    { label: '4.0+', stars: 4, count: 58, checked: false },
    { label: '3.0+', stars: 3, count: 97, checked: false },
    { label: '2.0+', stars: 2, count: 142, checked: false },
  ],
}

export const SORT_OPTIONS = ['Melhor Avaliação', 'Mais Avaliações', 'Mais Recentes', 'Menor Preço']

export const VENDORS: VendorCard[] = [
  {
    slug: 'studio-luz-sombra',
    name: 'Studio Luz & Sombra',
    category: 'Fotografia',
    categoryIcon: 'camera',
    location: 'Pinheiros, São Paulo',
    neighborhood: 'Pinheiros',
    rating: 5.0,
    reviews: 98,
    cover: '/images/fornecedores/photo-stage.png',
    verified: true,
    tags: ['Casamento', 'Corporativo', '15 anos'],
    reviewAvatars: [
      '/images/home/avatar-client-1.png',
      '/images/home/avatar-client-3.png',
      '/images/home/avatar-owner-3.png',
    ],
  },
  {
    slug: 'gourmet-arte-buffet',
    name: 'Gourmet & Arte Buffet',
    category: 'Buffet',
    categoryIcon: 'utensils',
    location: 'Moema, São Paulo',
    neighborhood: 'Moema',
    rating: 4.9,
    reviews: 74,
    cover: '/images/fornecedores/buffet-gourmet.png',
    verified: true,
    tags: ['Gastronomia', 'Premium', 'Eventos'],
    reviewAvatars: [
      '/images/home/avatar-owner-2.png',
      '/images/home/avatar-client-2.png',
      '/images/home/avatar-owner-1.png',
    ],
  },
  {
    slug: 'eclat-decor-eventos',
    name: 'Éclat Décor & Eventos',
    category: 'Decoração',
    categoryIcon: 'sparkles',
    location: 'Jardins, São Paulo',
    neighborhood: 'Jardins',
    rating: 5.0,
    reviews: 61,
    cover: '/images/fornecedores/decor-luxe.png',
    verified: true,
    tags: ['Luxo', 'Floral', 'Temático'],
    reviewAvatars: [
      '/images/home/avatar-client-3.png',
      '/images/home/avatar-owner-3.png',
      '/images/home/avatar-client-1.png',
    ],
  },
  {
    slug: 'dj-nexus-sound-lab',
    name: 'DJ Nexus & Sound Lab',
    category: 'DJs',
    categoryIcon: 'music',
    location: 'Vila Madalena, São Paulo',
    neighborhood: 'Vila Madalena',
    rating: 4.8,
    reviews: 53,
    cover: '/images/fornecedores/dj-booth.png',
    verified: true,
    tags: ['House', 'Techno', 'Pop'],
    reviewAvatars: [
      '/images/home/avatar-owner-1.png',
      '/images/home/avatar-client-2.png',
      '/images/home/avatar-owner-2.png',
    ],
  },
]

// Extra cards appended when the user clicks "Carregar mais fornecedores".
export const MORE_VENDORS: VendorCard[] = [
  {
    slug: 'atelie-jardim-arte',
    name: 'Ateliê Jardim & Arte',
    category: 'Decoração',
    categoryIcon: 'sparkles',
    location: 'Moema, São Paulo',
    neighborhood: 'Moema',
    rating: 4.9,
    reviews: 42,
    cover: '/images/fornecedores/portfolio-1.png',
    verified: true,
    tags: ['Floral', 'Clássico', 'Casamento'],
    reviewAvatars: [
      '/images/home/avatar-client-1.png',
      '/images/home/avatar-owner-3.png',
      '/images/home/avatar-client-3.png',
    ],
  },
  {
    slug: 'villa-rosa-decoracoes',
    name: 'Villa Rosa Decorações',
    category: 'Decoração',
    categoryIcon: 'sparkles',
    location: 'Itaim Bibi, São Paulo',
    neighborhood: 'Itaim Bibi',
    rating: 4.8,
    reviews: 37,
    cover: '/images/fornecedores/portfolio-3.png',
    verified: true,
    tags: ['Premium', 'Gala', 'Corporativo'],
    reviewAvatars: [
      '/images/home/avatar-owner-2.png',
      '/images/home/avatar-client-2.png',
      '/images/home/avatar-owner-1.png',
    ],
  },
]

/* ---------------- Vendor profile ---------------- */

export const VENDOR_PROFILE = {
  slug: 'guto-decoracoes-premium',
  breadcrumb: ['Busca', 'Decoração', 'Guto Decorações Premium'],
  tags: [
    { label: 'Decoração de Eventos', icon: 'sparkles' },
    { label: 'Parceiro Premium', icon: 'shield' },
  ],
  name: 'Guto Decorações Premium',
  location: 'Barra da Tijuca, Rio de Janeiro',
  since: 'Desde 2014',
  responseTime: 'Responde em < 2h',
  rating: 5.0,
  reviewsCount: 148,
  stats: [
    { value: '10+', label: 'Anos de mercado' },
    { value: '420+', label: 'Eventos realizados' },
    { value: '98%', label: 'Satisfação dos clientes' },
  ],
  serviceArea: {
    title: 'Atende na Barra da Tijuca e Região',
    subtitle: 'Rio de Janeiro · Toda a baixada fluminense',
  },
  availability: 'Disponível para novos eventos',
  availabilityYear: '2025',
  highlights: [
    { label: 'Resposta', value: '< 2 horas', icon: 'clock' },
    { label: 'Garantia', value: 'Satisfação', icon: 'shield-check' },
  ],
  portfolio: {
    total: '48 trabalhos',
    images: ['/images/fornecedores/portfolio-1.png', '/images/fornecedores/portfolio-2.png'],
    extraCount: '+45 fotos',
    tags: ['Casamento', 'Corporativo', 'Luxo', 'Floral', 'Temático', 'Debutantes'],
  },
  about: {
    paragraphs: [
      'Há mais de 10 anos, a Guto Decorações Premium transforma ambientes em cenários inesquecíveis. Nossa equipe de designers especializados combina arte floral, iluminação cênica e curadoria de detalhes para criar experiências sensoriais únicas — do esboço inicial à execução no dia do evento.',
      'Cada projeto é tratado como uma obra singular. Trabalhamos com fornecedores exclusivos de flores e tecidos importados, garantindo acabamento de alto padrão para casamentos, debutantes, eventos corporativos e celebrações íntimas em toda a região do Rio de Janeiro.',
    ],
    services: [
      {
        title: 'Decoração Completa de Salão',
        desc: 'Mesa de convidados, altar, bar e zonas de fotos',
      },
      {
        title: 'Instalações Florais Suspensas',
        desc: 'Arranjos aéreos, dossel de flores e greenwall',
      },
      {
        title: 'Iluminação Cênica & Ambiental',
        desc: 'LED, velas, spots e luz monocromática personalizada',
      },
      { title: 'Consultoria & Projeto 3D', desc: 'Renderização do ambiente antes do evento' },
      {
        title: 'Locação de Mobiliário Premium',
        desc: 'Cadeiras tiffany, sofás chesterfield e aparadores',
      },
    ],
  },
  verified: {
    title: 'Fornecedor Verificado',
    items: [
      'Identidade verificada pelo TimTim',
      'CNPJ e documentação conferidos',
      'Portfólio real auditado',
      'Avaliações de clientes reais',
    ],
  },
  others: {
    title: 'Outros Decoradores',
    items: [
      { name: 'Éclat Décor & Eventos', rating: 5.0, location: 'Jardins, SP' },
      { name: 'Ateliê Jardim & Arte', rating: 4.9, location: 'Moema, SP' },
      { name: 'Villa Rosa Decorações', rating: 4.8, location: 'Barra, RJ' },
    ],
  },
  quote: {
    status: 'Disponível · Responde em ~2h',
    infoLead: 'Seu evento',
    infoEvent: 'Casamento na Barra da Tijuca',
    infoTail:
      'já foi selecionado automaticamente. Detalhe abaixo o que você precisa para este fornecedor.',
    lockedEvent: {
      title: 'Casamento · Barra da Tijuca',
      subtitle: 'Selecionado automaticamente pelo seu perfil',
    },
    periodOptions: ['Manhã', 'Tarde', 'Noite', 'Dia inteiro'],
    venueOptions: [
      'Salão de festas',
      'Espaço ao ar livre',
      'Quinta / Fazenda',
      'Hotel',
      'Ainda a definir',
    ],
    services: [
      { label: 'Floral Premium', icon: 'sparkles', selected: true },
      { label: 'Iluminação Cênica', icon: 'lightbulb', selected: true },
      { label: 'Mesa Decorada', icon: 'table', selected: false },
      { label: 'Arco Floral', icon: 'flower', selected: false },
      { label: 'Painel / Backdrop', icon: 'image', selected: false },
      { label: 'Decoração Completa', icon: 'star', selected: false },
    ],
    visionPlaceholder:
      'Ex: Sonho com uma decoração em tons de marfim e dourado envelhecido, com rosas inglesas brancas e velas por toda a passarela. O salão tem 400m² e acomodará ~180 convidados. Gostaria de um arco floral na entrada e arranjos altos centrais nas mesas...',
    maxChars: 800,
    sla: '2 horas',
  },
  reviews: [
    {
      name: 'Fernanda & Rafael Mendes',
      avatar: '/images/home/avatar-client-1.png',
      tag: 'Casamento',
      date: 'Mar 2025',
      text: 'A decoração superou todas as nossas expectativas. O Guto tem um olhar sensível e transformou nosso salão em um conto de fadas. Cada detalhe foi pensado com carinho — das flores suspensas ao arranjo de mesa. Recebemos elogios de todos os convidados. Recomendamos sem hesitar!',
    },
    {
      name: 'Camila Teixeira',
      avatar: '/images/home/avatar-client-3.png',
      tag: '15 Anos',
      date: 'Fev 2025',
      text: 'Fiz a festa de 15 anos da minha filha com a Guto Decorações e ficou absolutamente deslumbrante. A equipe foi pontual, organizada e entregou além do projeto 3D que nos apresentaram. O ambiente pareceu saído de uma revista de moda. Perfeito do início ao fim.',
    },
    {
      name: 'Eduardo Costa — Apex Corp',
      avatar: '/images/home/avatar-client-2.png',
      tag: 'Corporativo',
      date: 'Jan 2025',
      text: 'Contratamos para o jantar anual da empresa — 300 convidados — e o resultado foi impecável. Profissionalismo raro no mercado de eventos. A ambientação ficou alinhada com nossa identidade de marca e os feedbacks dos nossos clientes foram unanimemente positivos.',
    },
    {
      name: 'Isabela & Marcos Oliveira',
      avatar: '/images/home/avatar-owner-3.png',
      tag: 'Casamento',
      date: 'Dez 2024',
      text: 'Casamento realizado no Intercontinental e tínhamos muita preocupação com a coerência estética do salão. O Guto entendeu exatamente nossa visão — minimalismo sofisticado com toques florais em tom nude e branco. O resultado foi cinematográfico. Obrigada, equipe!',
    },
  ],
}

export type { VendorCard }
