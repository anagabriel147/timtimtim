import { DEMO_USERS } from '../../support/commands'

// Avaliação é 1-por-contrato no backend (constraint de unicidade). O
// contrato "Festa de Noivado" do seed já vem com avaliação; o contrato
// "Aniversário de 30 Anos" não tem nenhuma — é nele que este teste mira,
// descoberto via API (evita depender da ordem/markup exato da lista na UI).
// Só funciona 1x por seed fresco.
describe('Contratante — Avaliar contrato', () => {
  it('publica uma avaliação real (POST /reviews) num contrato ainda sem review', () => {
    const { email, password } = DEMO_USERS.contratante

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password }).then(
      (loginResponse) => {
        const token = loginResponse.body.access_token as string

        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/contracts`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((contractsResponse) => {
          const target = (contractsResponse.body as Array<{ id: number; event_name: string }>).find(
            (c) => c.event_name === 'Aniversário de 30 Anos',
          )
          expect(target, 'contrato "Aniversário de 30 Anos" existe no seed').to.exist

          cy.visit('/', {
            onBeforeLoad(win) {
              win.localStorage.setItem('timtim.token', token)
            },
          })
          cy.visit(`/contratante/avaliacoes/${target!.id}`)

          // ratings/highlights/recommend já vêm com defaults válidos —
          // só precisamos submeter.
          cy.contains('button', 'Publicar Avaliação no Perfil').should('be.enabled').click()
          cy.contains('AVALIAÇÃO PUBLICADA', { timeout: 10000 }).should('be.visible')
        })
      },
    )
  })
})
