# TimTim — UI

Plataforma que liga contratantes, fornecedores e assessores de eventos.
Frontend em Next.js 16 (App Router), React 19, TypeScript e Tailwind CSS 4.

> Protótipo de interface: todos os dados são mocks locais, sem backend.

## Começar

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Aplicação em http://localhost:3000

## Estrutura

Organização por feature (fatias verticais de domínio), com API pública por barrel
e fronteiras de importação aplicadas pelo ESLint.

```
src/
├── app/          rotas (App Router)
├── features/     domínios: cliente, fornecedor, assessor, contratos, mensagens…
├── components/   ui (design system) · layout (shells) · brand
├── config/       navegação e constantes de app
├── hooks/  lib/  types/
```

Detalhes e regras de dependência: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm lint` | ESLint + fronteiras de arquitetura |
| `pnpm format` | Prettier |
| `pnpm check` | typecheck + lint + format |

## Perfis e rotas

| Perfil | Rota |
|---|---|
| Público | `/`, `/home` |
| Registo | `/cadastro` |
| Contratante | `/cliente` |
| Fornecedor | `/fornecedor` |
| Assessor | `/assessor` |
| Admin | `/admin` |
