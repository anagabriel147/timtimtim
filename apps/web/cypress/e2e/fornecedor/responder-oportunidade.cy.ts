// Requer seed fresco: o seed cria exatamente 1 solicitação em aberto
// (broadcast, sem fornecedor específico) visível como oportunidade pra
// Guto. Depois que ele responde, a API exclui oportunidades já respondidas
// da listagem — rodar de nada sem resemear o banco.
describe('Fornecedor — Responder oportunidade (cria proposta de verdade)', () => {
  beforeEach(() => {
    cy.loginAs('fornecedor')
    cy.visit('/fornecedor')
  })

  it('envia uma proposta real (POST /proposals) a partir de uma oportunidade', () => {
    cy.contains('button', 'Enviar Proposta').first().click()
    cy.location('pathname', { timeout: 10000 }).should('match', /\/fornecedor\/proposta\/\d+/)

    cy.contains('TÍTULO DA PROPOSTA')
      .parent()
      .find('input')
      .type('Decoração completa — proposta de teste Cypress')

    cy.get('input[type="number"]').first().clear().type('9500')

    cy.intercept('POST', '**/proposals').as('createProposal')
    cy.contains('button', 'Enviar Proposta').click()

    cy.wait('@createProposal').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.location('pathname', { timeout: 10000 }).should('eq', '/fornecedor')
  })
})
