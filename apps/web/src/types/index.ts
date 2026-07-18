/** Tipos transversais partilhados por várias features. */

/** Utilizador autenticado (mock — substituir pelo modelo real da API). */
export type SessionUser = {
  name: string
  avatar: string
  plan?: string
}

/** Perfis de acesso suportados pela plataforma. */
export type UserRole = 'contratante' | 'fornecedor' | 'assessor' | 'admin'
