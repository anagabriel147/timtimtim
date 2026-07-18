import type { BillingCycle, BillingInfo, PlanData, PlanHero, SummaryLine } from '../types'

// ----- Mock data (frontend-only prototype, no backend) -----

export const PLAN: PlanData = {
  role: 'fornecedor',
  name: 'Plano Fornecedor',
  brand: 'TimTim',
  badgeLabel: 'Premium',
  headerVariant: 'status',
  showStats: true,
  hero: {
    badge: 'PLANO FORNECEDOR',
    badgeAsPill: false,
    titleLead: 'Ative sua conta',
    titleAccent: 'TimTim',
    subtitle: 'Escolha como prefere pagar e comece a receber clientes hoje',
  },
  successTitle: 'Assinatura ativada!',
  successText:
    'Seu Plano Fornecedor está ativo. Já pode montar sua vitrine e receber clientes na TimTim.',
  successItems: [
    'Perfil verificado ativado',
    'Vitrine liberada',
    'Recebimento de leads ativo',
  ],
  features: [
    {
      title: 'Perfil verificado com badge',
      description: 'Destaque nos resultados de busca',
    },
    {
      title: 'Leads ilimitados',
      description: 'Receba solicitações de clientes sem limite',
    },
    {
      title: 'Agenda online integrada',
      description: 'Gestão completa de horários e clientes',
    },
    {
      title: 'Dashboard de performance',
      description: 'Métricas de visualizações, conversão e receita',
    },
    {
      title: 'Suporte prioritário 24/7',
      description: 'Chat dedicado com tempo de resposta < 2h',
    },
    {
      title: 'Destaque premium nas buscas',
      description: 'Posição privilegiada para novos clientes',
      tag: 'GOLD',
      gold: true,
    },
  ],
  stats: [
    { value: '4.9', accent: '★', label: 'Avaliação média' },
    { value: '12k+', label: 'Fornecedores ativos' },
    { value: '98%', label: 'Taxa de renovação' },
  ],
  guarantee: {
    title: 'Garantia de 7 dias',
    text: 'Reembolso integral sem perguntas, se não estiver satisfeito',
  },
  billing: {
    mensal: {
      statusBadge: 'PLANO ATIVO',
      cycleSuffix: '',
      description: 'Acesso completo à plataforma, cancele quando quiser',
      intPart: '79',
      cents: ',90',
      period: '/mês',
      priceNote: 'Cobrado mensalmente · Cancele quando quiser',
      installment: '1x de R$ 79,90 (sem juros)',
      summaryTag: 'Mensal',
      summaryPeriod: '1 mês',
      summary: [
        { label: 'Plano Fornecedor TimTim', value: 'R$ 79,90/mês' },
        { label: 'Taxa de configuração', value: 'Grátis' },
      ],
      total: 'R$ 79,90',
      nextCharge: 'Renova automaticamente todo mês',
      monthlyEquivalent: '≈ R$ 79,90/mês',
    },
    anual: {
      statusBadge: 'PLANO ANUAL ATIVO',
      cycleSuffix: ' · Anual',
      description: 'Acesso completo por 12 meses com 2 meses de bônus incluídos',
      original: 'R$ 958,80/ano',
      discountBadge: '-17% OFF',
      intPart: '798',
      cents: ',90',
      period: '/ano',
      priceNote: 'equivalente a R$ 66,57/mês — você economiza R$ 159,90',
      bonus: {
        title: '2 meses bônus incluídos',
        tag: 'exclusivo anual',
        text: '14 meses de acesso pelo preço de 12 — R$ 159,90 de economia real',
      },
      installment: '1x de R$ 798,90 (sem juros)',
      summaryTag: 'Anual',
      summaryPeriod: '12 meses',
      summary: [
        { label: 'Plano Fornecedor TimTim', value: 'R$ 958,80' },
        { label: 'Taxa de configuração', value: 'Grátis' },
        { label: 'Desconto de 2 meses (17%)', value: '-R$ 159,90', discount: true },
      ],
      total: 'R$ 798,90',
      nextCharge: 'Próxima cobrança em 12 meses',
      monthlyEquivalent: '≈ R$ 66,57/mês',
    },
  },
}

export const ASSESSOR_PLAN: PlanData = {
  role: 'assessor',
  name: 'Plano Assessor',
  brand: 'TimTim',
  brandSubtitle: 'Acesso profissional completo',
  badgeLabel: 'PRO',
  headerVariant: 'brand',
  showStats: false,
  hero: {
    badge: 'ASSESSOR DE EVENTOS',
    badgeAsPill: true,
    titleLead: 'Ative sua assinatura de Assessor',
    titleAccent: 'e gerencie seus eventos',
    subtitle:
      'Acesso completo às ferramentas profissionais da plataforma TimTim. Cancele quando quiser, sem compromisso.',
  },
  successTitle: 'Assinatura de Assessor ativada!',
  successText:
    'Seu Plano Assessor está ativo. Já pode gerenciar clientes, cronogramas e RSVPs na TimTim.',
  successItems: [
    'Painel de gestão de clientes liberado',
    'Ferramentas de RSVP ativas',
    'Cronogramas integrados disponíveis',
  ],
  features: [
    {
      title: 'Gestão Completa de Clientes',
      description: 'CRM dedicado para assessores de eventos',
    },
    {
      title: 'Ferramentas de RSVP Digital',
      description: 'Confirmações online personalizadas',
    },
    {
      title: 'Cronogramas Dinâmicos Integrados',
      description: 'Timelines automáticas por evento',
    },
    {
      title: 'Checklist de Fornecedores Ilimitado',
      description: 'Controle total sem limites de cadastros',
    },
    {
      title: 'Painel de Orçamentos e Contratos',
      description: 'Propostas, assinaturas e histórico',
    },
  ],
  stats: [
    { value: '4.9', accent: '★', label: 'Avaliação média' },
    { value: '8k+', label: 'Assessores ativos' },
    { value: '97%', label: 'Taxa de renovação' },
  ],
  guarantee: {
    title: 'Garantia de 14 dias · Sem risco',
    text: 'Reembolso integral se não ficar satisfeito',
  },
  billing: {
    mensal: {
      statusBadge: 'PLANO ATIVO',
      cycleSuffix: '',
      description: 'Acesso profissional completo',
      intPart: '149',
      cents: ',90',
      period: '/mês',
      priceNote: 'Cobrado mensalmente · Cancele a qualquer momento',
      installment: '1x de R$ 149,90 (sem juros)',
      summaryTag: 'Mensal',
      summaryPeriod: 'Mensal',
      summary: [
        { label: 'Plano Assessor TimTim', value: 'R$ 149,90/mês' },
        { label: 'Período', value: 'Mensal' },
      ],
      total: 'R$ 149,90',
      nextCharge: 'Renova automaticamente todo mês',
      monthlyEquivalent: '≈ R$ 149,90/mês',
    },
    anual: {
      statusBadge: 'PLANO ANUAL ATIVO',
      cycleSuffix: ' · Anual',
      description: 'Acesso profissional completo por 12 meses com 2 meses grátis',
      original: 'R$ 1.798,80/ano',
      discountBadge: '2 MESES GRÁTIS',
      intPart: '1.499',
      cents: ',00',
      period: '/ano',
      priceNote: 'equivalente a R$ 124,92/mês — você economiza R$ 299,80',
      bonus: {
        title: '2 meses grátis incluídos',
        tag: 'exclusivo anual',
        text: '14 meses de acesso pelo preço de 12 — R$ 299,80 de economia real',
      },
      installment: '1x de R$ 1.499,00 (sem juros)',
      summaryTag: 'Anual',
      summaryPeriod: '12 meses',
      summary: [
        { label: 'Plano Assessor TimTim', value: 'R$ 1.798,80' },
        { label: 'Período', value: '12 meses' },
        { label: 'Desconto de 2 meses', value: '-R$ 299,80', discount: true },
      ],
      total: 'R$ 1.499,00',
      nextCharge: 'Próxima cobrança em 12 meses',
      monthlyEquivalent: '≈ R$ 124,92/mês',
    },
  },
}

export function getPlan(tipo?: string): PlanData {
  return tipo === 'assessor' ? ASSESSOR_PLAN : PLAN
}

export const PIX_CODE =
  '00020126580014br.gov.bcb.pix0136a24e3b59-f2c1-4d78-9e03-8b72a5c6d1f252040000530398654047989.905802BR5913TimTim Ltda6009Sao Paulo62070503***6304A1B2'

export type { BillingCycle, BillingInfo, PlanData, PlanHero, SummaryLine }
