// Cadastro é 100% mock — não existe endpoint de signup na API (ver
// docs/FLUXOS.md e docs/TECHNICAL.md). Nenhum dado é persistido de
// verdade; isto só confirma que as telas carregam sem crash.
describe('Cadastro (smoke — sem endpoint real de signup)', () => {
  it('/cadastro carrega sem erro', () => {
    cy.visit('/cadastro')
    cy.get('body').should('be.visible')
  })
})
