import { DEMO_USERS } from '../../support/commands'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('mostra erro com credenciais inválidas', () => {
    cy.get('#login-email').type('ana@timtim.com.br')
    cy.get('#login-password').type('senha-errada')
    cy.contains('button', 'ENTRAR').click()
    cy.contains(/incorretos/i).should('be.visible')
    cy.location('pathname').should('eq', '/')
  })

  const cases: Array<[keyof typeof DEMO_USERS, string]> = [
    ['contratante', '/contratante'],
    ['fornecedor', '/fornecedor'],
    ['assessor', '/assessor'],
    ['admin', '/admin'],
  ]

  for (const [role, expectedPath] of cases) {
    it(`autentica como ${role} e redireciona para ${expectedPath}`, () => {
      const { email, password } = DEMO_USERS[role]
      cy.get('#login-email').type(email)
      cy.get('#login-password').type(password)
      cy.contains('button', 'ENTRAR').click()
      cy.location('pathname', { timeout: 10000 }).should('eq', expectedPath)
    })
  }
})
