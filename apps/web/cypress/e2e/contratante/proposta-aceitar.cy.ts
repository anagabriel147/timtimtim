// Requer seed fresco: o evento "Casamento da Ana & Pedro" tem exatamente 1
// proposta pendente vinda do seed (Guto/decoração, R$16.500, status
// ANALISE). Aceitar essa proposta consome ela — rodar de novo sem
// resemear o banco vai encontrar o evento sem propostas pendentes.
describe('Contratante — Aceitar proposta (cria contrato de verdade)', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
    cy.visit('/contratante')
  })

  it('aceita a proposta pendente do seed e é redirecionado pra Contratos', () => {
    cy.contains('Casamento da Ana & Pedro').click()
    cy.location('pathname').should('match', /\/contratante\/eventos\/\d+/)

    cy.contains('Aceitar').should('be.visible')
    cy.contains('Aceitar').click()

    // "Aceitar" já criou o contrato (POST /proposals/{id}/accept) — o que
    // aparece agora é um checkout Pix decorativo (sem gateway real por
    // trás) que precisa ser "confirmado" pra fechar o fluxo.
    cy.contains('button', 'Já fiz o pagamento').click()

    cy.location('pathname', { timeout: 10000 }).should('eq', '/contratante/contratos')
    // o contrato novo tem o código no formato TT-{ano}-{id}
    cy.contains(/TT-\d{4}-\d{4}/).should('be.visible')
  })
})
