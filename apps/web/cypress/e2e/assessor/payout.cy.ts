// Como o saque do fornecedor: sem restrição de unicidade no backend, mas
// consome o saldo disponível inteiro (comissões CONFIRMADA/PAGA) — roda
// limpo 1x por seed fresco.
describe('Assessor — Solicitar saque', () => {
  beforeEach(() => {
    cy.loginAs('assessor')
  })

  it('solicita um saque Pix real (POST /assessor-payouts)', () => {
    cy.contains('button', 'Sacar').should('be.enabled').click()
    cy.get('input[placeholder*="Chave Pix"]').type('isabela@timtim.com.br')

    cy.intercept('POST', '**/assessor-payouts').as('createPayout')
    cy.contains('button', 'Confirmar').click()

    cy.wait('@createPayout').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})
