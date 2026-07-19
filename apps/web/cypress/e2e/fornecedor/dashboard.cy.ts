describe('Fornecedor — Dashboard', () => {
  beforeEach(() => {
    cy.loginAs('fornecedor')
  })

  it('carrega oportunidades/propostas/contratos reais da API', () => {
    cy.contains('Carregando...').should('not.exist')
    cy.contains('Novas Oportunidades').should('be.visible')
    cy.contains(/\d+ novos?/).should('be.visible')
  })
})
