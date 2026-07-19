# TimTim

Plataforma que liga contratantes, fornecedores e assessores de eventos.

Monorepo (pnpm workspaces) com o frontend e o futuro backend como pacotes
independentes:

```
apps/
├── web/    Frontend — Next.js 16, React 19, TypeScript, Tailwind CSS 4
└── api/    Backend — Python, FastAPI, SQLAlchemy (ver apps/api/README.md)
```

## Começar

Frontend:

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Aplicação em http://localhost:3000

Backend (necessário para login e qualquer dado real — ver
[`apps/api/README.md`](apps/api/README.md)):

```bash
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

Login de demo (criado pelo seed): `ana@timtim.com.br` / `12345` (contratante).
Outros papéis e detalhes em [`docs/TECHNICAL.md`](docs/TECHNICAL.md).

## Documentação

- [`docs/TECHNICAL.md`](docs/TECHNICAL.md) — arquitetura, setup completo, autenticação, referência da API, modelo de dados
- [`docs/FLUXOS.md`](docs/FLUXOS.md) — o que cada perfil (contratante/fornecedor/assessor/admin) consegue fazer hoje, tela por tela, e o que ainda é protótipo estático
- [`apps/web/docs/ARCHITECTURE.md`](apps/web/docs/ARCHITECTURE.md) — convenções internas do frontend

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
- [`apps/api`](apps/api/README.md) — backend (Python/FastAPI, ambiente virtual próprio)
