# TimTim

Plataforma que liga contratantes, fornecedores e assessores de eventos.

Monorepo (pnpm workspaces) com o frontend e o futuro backend como pacotes
independentes:

```
apps/
├── web/    Frontend — Next.js 16, React 19, TypeScript, Tailwind CSS 4
└── api/    Backend — ainda não implementado (ver apps/api/README.md)
```

## Começar

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Aplicação em http://localhost:3000

## Scripts

Os scripts na raiz fazem proxy para o pacote `web` via `pnpm --filter`:

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento do frontend |
| `pnpm build` | Build de produção do frontend |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm lint` | ESLint + fronteiras de arquitetura |
| `pnpm format` | Prettier |
| `pnpm check` | typecheck + lint + format |

Para rodar um comando direto num pacote específico: `pnpm --filter web <script>`.

## Pacotes

- [`apps/web`](apps/web/README.md) — frontend (detalhes de arquitetura em
  [`apps/web/docs/ARCHITECTURE.md`](apps/web/docs/ARCHITECTURE.md))
- [`apps/api`](apps/api/README.md) — backend (placeholder)
