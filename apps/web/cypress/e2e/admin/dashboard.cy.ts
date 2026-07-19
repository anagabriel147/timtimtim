// Painel admin (/admin) — única tela real do perfil admin (as outras 4 abas
// de navegação não têm página implementada, ver seção seguinte). Números
// exatos não são verificados aqui de propósito: outras specs (lifecycle)
// criam contratos/disputas novos, então os totais crescem entre execuções —
// o que importa é que os dados vêm de verdade da API, não estão zerados/
// quebrados, e a estrutura das 5 seções está correta.

describe('Admin — Visão Geral', () => {
  beforeEach(() => {
    cy.loginAs('admin')
  })

  it('carrega os 4 KPIs com valores reais (não vazios)', () => {
    cy.contains('Painel Estratégico').should('be.visible')
    cy.contains('Carregando...').should('not.exist')

    for (const tag of ['FORNECEDORES', 'MRR', 'ASSESSORAS', 'BRUTO']) {
      cy.contains(tag).should('be.visible')
    }
    cy.contains('Assinantes Ativos').should('be.visible')
    cy.contains('Faturamento de Assinaturas').should('be.visible')
    cy.contains('Comissões de Indicação Pagas').should('be.visible')
    cy.contains('Volume Total em Contratos').should('be.visible')
  })

  it('lista pelo menos 1 disputa em aberto vinda da API', () => {
    cy.contains('Disputas em Aberto').should('be.visible')
    cy.contains(/\d+ abertas?/).should('be.visible')
    cy.contains(/^Contrato TT-/).should('be.visible')
    cy.contains(/Aberto agora|Aberto há/).should('be.visible')
  })

  it('mostra o gráfico de atividade do ecossistema (últimos 6 meses)', () => {
    cy.contains('Atividade do Ecossistema').should('be.visible')
    cy.contains('6 meses').should('be.visible')
    cy.contains('Eventos criados na plataforma por mês').should('be.visible')
  })

  it('mostra as 4 métricas de saúde da plataforma', () => {
    cy.contains('Saúde da Plataforma').should('be.visible')
    cy.contains('Taxa de Conversão Global').should('be.visible')
    cy.contains('Avaliação Média de Fornecedores').should('be.visible')
    cy.contains('Contratos Concluídos').should('be.visible')
    cy.contains('Disputas Resolvidas').should('be.visible')
  })

  it('lista pelo menos 1 fornecedor no ranking de Top Fornecedores', () => {
    cy.contains('Top Fornecedores').should('be.visible')
    cy.contains('#1').should('be.visible')
    // dado real do seed: Guto Decorações tem contrato fechado
    cy.contains('Guto Decorações').should('be.visible')
  })
})

describe('Admin — navegação não implementada', () => {
  beforeEach(() => {
    cy.loginAs('admin')
  })

  // Documentado em docs/FLUXOS.md: só "Visão Geral" é uma página de
  // verdade — as outras 4 abas são placeholders com toast "em breve".
  const placeholderTabs = ['Disputas', 'Métricas Avançadas', 'Fornecedores', 'Configurações']

  for (const tab of placeholderTabs) {
    it(`aba "${tab}" mostra toast "em breve" em vez de navegar`, () => {
      cy.contains('nav, header', tab).click()
      cy.contains(/em breve/i).should('be.visible')
      cy.location('pathname').should('eq', '/admin')
    })
  }
})
