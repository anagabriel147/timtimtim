describe('Assessor — Indicações', () => {
  beforeEach(() => {
    cy.loginAs('assessor')
    cy.visit('/assessor/indicacoes')
  })

  it('lista indicações e top fornecedores reais (Guto/Isabela do seed)', () => {
    cy.contains('Carregando...').should('not.exist')
    cy.contains('Guto Decorações').should('be.visible')
  })
})
