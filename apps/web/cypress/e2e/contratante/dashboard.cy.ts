describe('Contratante — Dashboard', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
  })

  it('carrega o evento em destaque e o histórico, com dados reais da API', () => {
    cy.contains('Carregando...').should('not.exist')
    // Seed sempre cria pelo menos 1 evento pra Ana — nunca deve cair no
    // estado vazio "Você ainda não tem nenhum evento" numa base com seed.
    cy.contains('Você ainda não tem nenhum evento').should('not.exist')
    cy.contains('Histórico de Eventos').should('be.visible')
  })

  it('navega para o detalhe do evento em destaque', () => {
    cy.contains('Ver Todas as Propostas').click()
    cy.location('pathname').should('match', /\/contratante\/eventos\/\d+/)
  })
})
