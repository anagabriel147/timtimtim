export type DemoRole = 'contratante' | 'fornecedor' | 'assessor' | 'admin'

export const DEMO_USERS: Record<DemoRole, { email: string; password: string; name: string }> = {
  contratante: { email: 'ana@timtim.com.br', password: '12345', name: 'Ana' },
  fornecedor: { email: 'fornecedor@timtim.com.br', password: '12345', name: 'Guto Decorações' },
  assessor: { email: 'assessor@timtim.com.br', password: '12345', name: 'Isabela Assessora' },
  admin: { email: 'admin@timtim.com.br', password: '12345', name: 'Admin TimTim' },
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Autentica como um dos 4 perfis demo (login real via API) e navega
       * pra rota do dashboard daquele perfil. Sessão cacheada por role
       * dentro da execução da suíte (cy.session).
       */
      loginAs(role: DemoRole): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginAs', (role: DemoRole) => {
  const { email, password } = DEMO_USERS[role]

  cy.session(
    role,
    () => {
      cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password }).then(
        (response) => {
          const token = response.body.access_token as string
          cy.visit('/', {
            onBeforeLoad(win) {
              win.localStorage.setItem('timtim.token', token)
            },
          })
        },
      )
    },
    {
      validate() {
        cy.window().then((win) => {
          expect(win.localStorage.getItem('timtim.token'), 'token presente').to.exist
        })
      },
    },
  )

  cy.visit(`/${role}`)
})

export {}
