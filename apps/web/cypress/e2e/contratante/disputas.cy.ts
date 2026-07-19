// Abrir disputa não tem restrição de unicidade no backend (um contrato pode
// ter mais de uma disputa) — este teste é seguro de rodar repetidamente.
describe('Contratante — Abrir disputa', () => {
  beforeEach(() => {
    cy.loginAs('contratante')
    cy.visit('/contratante/disputas/nova')
  })

  it('envia uma disputa real pra arbitragem (POST /disputes)', () => {
    // seletor de contrato já vem preenchido com o primeiro contrato do
    // contratante — não precisa interagir com ele.
    cy.get('select').eq(1).select('Qualidade abaixo do contratado')

    cy.contains('button', 'Impacto Médio').click()
    cy.contains('button', 'Reembolso Parcial').click()

    // 2 textareas na página — a primeira é o relato obrigatório (min. 200
    // chars), a segunda é "observações adicionais" (opcional).
    cy.get('textarea').first().type(
      'Relato de teste automatizado via Cypress para validar o fluxo real de abertura de disputa. '.repeat(3),
    )

    cy.contains('button', /Declaro que todas as informações/).click()
    cy.contains('button', /Concordo com os Termos do Protocolo/).click()
    cy.contains('button', /Entendo que após o envio/).click()

    cy.intercept('POST', '**/disputes').as('createDispute')
    cy.contains('button', 'Enviar Disputa para Arbitragem').should('be.enabled').click()

    // A tela de confirmação ("Disputa enviada!") é transitória (redireciona
    // sozinha em ~2.6s) — o que importa de verdade é a API ter aceitado
    // (201) e o redirect final ter acontecido.
    cy.wait('@createDispute').its('response.statusCode').should('eq', 201)
    cy.location('pathname', { timeout: 10000 }).should('eq', '/contratante/contratos')
  })
})
