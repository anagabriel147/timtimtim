// /home é a landing pública, 100% mock — ver docs/FLUXOS.md. Note: a raiz
// "/" é a tela de LOGIN, não a landing (nomenclatura invertida do óbvio).
describe('Landing pública (smoke)', () => {
  it('/home carrega sem erro, sem precisar de login', () => {
    cy.visit('/home')
    cy.get('body').should('be.visible')
  })
})
