// POST /payouts não tem restrição de unicidade no backend, mas este teste
// usa o botão "MÁXIMO" (saca o saldo disponível inteiro) — depois de rodar
// com sucesso uma vez, o saldo disponível vai a zero até novos contratos
// QUITADOS/GARANTIDOS entrarem (ex.: seed fresco, ou o teste de aceitar
// proposta). Como os outros fluxos "de uma via só" deste projeto, roda
// limpo 1x por seed fresco.
describe('Fornecedor — Carteira', () => {
  beforeEach(() => {
    cy.loginAs('fornecedor')
    cy.visit('/fornecedor/carteira')
  })

  it('solicita um saque Pix real (POST /payouts)', () => {
    cy.contains('MÁXIMO').click()
    cy.get('input[placeholder="E-mail, CPF/CNPJ, telefone ou chave aleatória"]').type(
      'guto@timtim.com.br',
    )

    cy.intercept('POST', '**/payouts').as('createPayout')
    cy.contains('button', 'VIA PIX').click()

    cy.wait('@createPayout').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})
