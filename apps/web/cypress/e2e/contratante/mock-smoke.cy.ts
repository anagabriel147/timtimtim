// Estas telas são 100% mock (dado estático, sem chamada de API) — ver
// docs/FLUXOS.md. Não faz sentido testar "funcionalidade" que não existe;
// isto é só um smoke test pra pegar regressão de renderização/crash.
describe('Contratante — telas mock (smoke)', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
  })

  it('/contratante/mensagens carrega sem erro', () => {
    cy.visit('/contratante/mensagens')
    cy.get('body').should('be.visible')
  })

  it('/contratante/fornecedores (marketplace) carrega sem erro', () => {
    cy.visit('/contratante/fornecedores')
    cy.get('body').should('be.visible')
  })
})
