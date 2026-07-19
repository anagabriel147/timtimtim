describe('Fornecedor — Propostas e Contratos (listas reais)', () => {
  beforeEach(() => {
    cy.loginAs('fornecedor')
  })

  it('/fornecedor/propostas lista as propostas enviadas pelo fornecedor', () => {
    cy.visit('/fornecedor/propostas')
    cy.contains('Carregando...').should('not.exist')
    // seed sempre cria 1 proposta pendente do Guto pro Casamento da Ana & Pedro
    cy.contains(/R\$\s*16\.500/).should('be.visible')
  })

  it('/fornecedor/contratos lista os contratos reais do fornecedor', () => {
    cy.visit('/fornecedor/contratos')
    cy.contains('Carregando...').should('not.exist')
    cy.contains(/TT-\d{4}-\d{4}/).should('be.visible')
  })
})
