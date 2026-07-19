// 100% mock — ver docs/FLUXOS.md. /assessor/carteira em particular duplica
// (com dado falso) o painel de saldo que já é real dentro de /assessor —
// inconsistência conhecida, documentada, não uma regressão a "corrigir" aqui.
describe('Assessor — telas mock (smoke)', () => {
  beforeEach(() => {
    cy.loginAs('assessor')
  })

  it('/assessor/carteira carrega sem erro', () => {
    cy.visit('/assessor/carteira')
    cy.get('body').should('be.visible')
  })

  it('/assessor/mensagens carrega sem erro', () => {
    cy.visit('/assessor/mensagens')
    cy.get('body').should('be.visible')
  })
})
