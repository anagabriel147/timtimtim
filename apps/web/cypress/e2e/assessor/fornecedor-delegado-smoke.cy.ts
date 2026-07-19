// /assessor/fornecedor/* reusa os MESMOS componentes de features/fornecedor
// (só troca o chrome/topbar) — já cobertos a fundo em cypress/e2e/fornecedor.
// Aqui só confirmamos que as rotas delegadas carregam sem crash.
describe('Assessor — modo fornecedor delegado (smoke)', () => {
  beforeEach(() => {
    cy.loginAs('assessor')
  })

  const routes = [
    '/assessor/fornecedor',
    '/assessor/fornecedor/propostas',
    '/assessor/fornecedor/contratos',
    '/assessor/fornecedor/carteira',
    '/assessor/fornecedor/relatorios',
    '/assessor/fornecedor/disputas',
  ]

  for (const route of routes) {
    it(`${route} carrega sem erro`, () => {
      cy.visit(route)
      cy.get('body').should('be.visible')
    })
  }
})
