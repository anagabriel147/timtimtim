describe('Assessor — Dashboard', () => {
  beforeEach(() => {
    cy.loginAs('assessor')
  })

  it('carrega KPIs, cupom e comissões reais da API', () => {
    cy.contains('Carregando...').should('not.exist')
    // dado real do seed: comissão confirmada de Isabela sobre o Guto
    cy.contains('Guto Decorações').should('be.visible')
    cy.contains(/R\$\s*400,00/).should('be.visible')
  })

  it('marca a seção "Casamentos sob sua Assessoria" como exemplo estático', () => {
    // ver docs/FLUXOS.md — única seção mock desta tela, com selo visível
    cy.contains(/exemplo/i).should('be.visible')
  })
})
