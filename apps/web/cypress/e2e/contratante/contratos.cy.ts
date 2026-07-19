describe('Contratante — Contratos', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
    cy.visit('/contratante/contratos')
  })

  it('lista os contratos reais (seed sempre tem pelo menos 2)', () => {
    cy.contains(/TT-\d{4}-\d{4}/).should('be.visible')
    cy.contains('button', 'Ver Contrato').should('be.visible')
  })

  it('abre o detalhe de um contrato', () => {
    cy.contains('button', 'Ver Contrato').first().click()
    cy.location('pathname').should('match', /\/contratante\/contratos\/\d+/)
    cy.contains(/TT-\d{4}-\d{4}/).should('be.visible')
  })
})
