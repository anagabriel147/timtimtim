// 100% mock (dado estático, sem API) — ver docs/FLUXOS.md. O fornecedor
// não consegue ver disputas reais hoje (sem endpoint de listagem pro papel
// dele); esta tela existe mas é decorativa. Smoke test só pra pegar
// crash/regressão de renderização.
describe('Fornecedor — telas mock (smoke)', () => {
  beforeEach(() => {
    cy.loginAs('fornecedor')
  })

  it('/fornecedor/relatorios carrega sem erro', () => {
    cy.visit('/fornecedor/relatorios')
    cy.get('body').should('be.visible')
  })

  it('/fornecedor/disputas carrega sem erro', () => {
    cy.visit('/fornecedor/disputas')
    cy.get('body').should('be.visible')
  })

  it('/fornecedor/mensagens carrega sem erro', () => {
    cy.visit('/fornecedor/mensagens')
    cy.get('body').should('be.visible')
  })
})
