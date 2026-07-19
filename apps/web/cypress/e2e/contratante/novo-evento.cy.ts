describe('Contratante — Criar novo evento', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
    cy.visit('/contratante/novo-evento')
  })

  it('publica um evento novo de ponta a ponta (POST /events real)', () => {
    const eventName = `Evento Cypress ${Date.now()}`

    // Passo 1 — os defaults (casamento/Portugal/Lisboa/100 convidados) já
    // são válidos; só precisamos preencher o nome, que não tem default.
    cy.get('input').first().type(eventName)
    cy.contains('button', 'Próximo Passo').click()

    // Passo 2 — defaults já válidos, avança direto.
    cy.contains('button', 'Avançar').click()

    // Passo 3 — precisa de pelo menos 1 categoria de serviço marcada pra
    // habilitar "Publicar Evento".
    cy.contains('button', 'Publicar Evento').should('be.disabled')
    cy.contains('Decoração & Cenografia').click()
    cy.contains('button', 'Publicar Evento').should('be.enabled').click()

    cy.contains(`${eventName} está no ar!`, { timeout: 10000 }).should('be.visible')
    cy.contains('EVENTO PUBLICADO').should('be.visible')

    cy.contains('button', 'Ir para o painel').click()
    cy.location('pathname').should('eq', '/contratante')
    cy.contains(eventName).should('be.visible')
  })
})
