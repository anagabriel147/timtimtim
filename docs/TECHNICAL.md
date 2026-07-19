# TimTim — Documentação Técnica (v1)

Este documento descreve o estado real do sistema na v1: arquitetura, como rodar
tudo localmente, autenticação, referência da API e modelo de dados. Para o que
cada perfil consegue fazer na prática (e o que ainda é protótipo estático),
ver [`FLUXOS.md`](./FLUXOS.md).

## 1. Stack e estrutura

Monorepo pnpm com dois pacotes independentes:

```
apps/
├── web/    Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
└── api/    FastAPI · SQLAlchemy 2.0 (estilo Mapped/mapped_column) · Pydantic v2
```

O `apps/api` **não** é um pacote Node — não tem `package.json`, tem ambiente
virtual Python próprio, e o `pnpm-workspace.yaml` da raiz simplesmente o ignora.

Frontend organizado por feature (domínio), não por tipo de arquivo — ver
[`apps/web/docs/ARCHITECTURE.md`](../apps/web/docs/ARCHITECTURE.md) para as
convenções de pastas, barrels e regras de import aplicadas via ESLint.

> Nota: esse arquivo de arquitetura ainda diz que "todos os dados são mocks
> estáticos" — isso já não é verdade para várias telas (ver `FLUXOS.md`), mas o
> resto do documento (organização por feature, regras de dependência,
> convenções) continua válido.

## 2. Rodando localmente

### Backend

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed          # popula o SQLite com categorias, usuários demo e dados de exemplo
uvicorn app.main:app --reload --port 8000
```

API em `http://localhost:8000` (CORS liberado só para `http://localhost:3000`).
Banco: SQLite em `apps/api/timtim.db` (arquivo gitignored — pode apagar e
rodar o seed de novo a qualquer momento, o script é idempotente).

Não há sistema de migração (Alembic ou similar) — o schema é criado via
`Base.metadata.create_all(engine)` no startup da aplicação. Para mudar o
schema em desenvolvimento, apague `timtim.db` e rode o seed de novo.

**Variáveis de ambiente** (`apps/api/.env`, ver `.env.example`):

| Variável | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./timtim.db` | String de conexão SQLAlchemy |
| `SECRET_KEY` | `dev-only-insecure-secret-change-me` | Chave de assinatura JWT — **trocar em produção** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Validade do token de acesso |

### Frontend

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Aplicação em `http://localhost:3000`.

| Variável | Padrão | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL da API consumida por `src/lib/api.ts` |

### Credenciais de demo (criadas pelo `app.seed`)

| Nome | E-mail | Senha | Papel |
|---|---|---|---|
| Ana | `ana@timtim.com.br` | `12345` | contratante |
| Guto Decorações | `fornecedor@timtim.com.br` | `12345` | fornecedor |
| Isabela Assessora | `assessor@timtim.com.br` | `12345` | assessor |
| Admin TimTim | `admin@timtim.com.br` | `12345` | admin |

O seed cria um cenário coerente entre os 4 logins: um evento com uma proposta
pendente de avaliação, um evento já concluído com contrato + avaliação +
comissão de indicação paga (ligando Guto e Isabela), e um segundo contrato em
andamento com uma disputa aberta — o suficiente para todo dashboard (inclusive
o do admin) mostrar dado real e não telas vazias.

### Comandos úteis (raiz, via `pnpm --filter web`)

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento do frontend |
| `pnpm build` | Build de produção do frontend |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint + fronteiras de arquitetura |
| `pnpm format` | Prettier |
| `pnpm check` | typecheck + lint + format:check |

## 3. Autenticação

- Esquema stateless: **JWT bearer** (`PyJWT`, `HS256`), sem refresh token, sem
  blacklist/revogação.
- Senhas com `bcrypt` diretamente (não usa passlib).
- `POST /auth/login` — recebe `{ email, password }`, retorna
  `{ access_token, token_type: "bearer", user }`. Erros de credencial sempre
  voltam como 401 genérico ("E-mail ou senha incorretos"), sem indicar se o
  e-mail existe ou não.
- `GET /auth/me` — retorna o usuário autenticado a partir do token.
- **Não existe endpoint de cadastro/signup na API.** Usuários só são criados
  via `app.seed` (ou manipulação direta do banco). A tela de `/cadastro` no
  frontend é inteiramente estática (ver `FLUXOS.md`).
- Autorização por papel é feita por pequenos helpers locais em cada router
  (`_require_admin`, `_require_provider`, `_require_assessor`, ...) que
  retornam **403** quando o papel não bate.
- Checks de posse de recurso (o contrato/evento/proposta é seu?) retornam
  **404, não 403** — padrão deliberado em todo o backend para não confirmar a
  existência de um recurso para quem não tem acesso a ele. Aplicado em
  `events`, `contracts`, `disputes`, `reviews`, `proposals` (aceitar/recusar) e
  `opportunities` (elegibilidade de categoria).
- Alguns endpoints não têm nenhum gate de papel e dependem só do escopo da
  query por `current_user.id` (`GET /events`, `GET /contracts`,
  `GET /categories`) — qualquer papel autenticado pode chamar, mas só vê o que
  é seu.

## 4. Referência da API

Todas as rotas exigem `Authorization: Bearer <token>`, exceto `POST /auth/login`.

### `auth` — `/auth`
| Rota | Papel | Descrição |
|---|---|---|
| `POST /auth/login` | público | Login, retorna token + perfil |
| `GET /auth/me` | qualquer autenticado | Perfil do usuário logado |

### `catalog` — `/categories`
| Rota | Papel | Descrição |
|---|---|---|
| `GET /categories` | qualquer autenticado | Lista categorias de serviço |

### `events` — `/events`
| Rota | Papel | Descrição |
|---|---|---|
| `POST /events` | contratante (por convenção) | Cria evento do usuário atual |
| `GET /events` | qualquer autenticado | Lista eventos do usuário atual |
| `GET /events/{id}` | dono do evento | 404 se não existir ou não for seu |

### `opportunities` — `/opportunities` (leads de orçamento, visão do fornecedor)
| Rota | Papel | Descrição |
|---|---|---|
| `GET /opportunities` | fornecedor | Pedidos de orçamento abertos (diretos ou da categoria do fornecedor) que ele ainda não respondeu |
| `GET /opportunities/{id}` | fornecedor elegível | 404 se não existir ou o fornecedor não for elegível |

### `proposals` — `/proposals`
| Rota | Papel | Descrição |
|---|---|---|
| `GET /proposals?event_id=` | contratante (via escopo) | Propostas de um evento |
| `GET /proposals/mine` | fornecedor | Propostas enviadas pelo fornecedor atual |
| `POST /proposals` | fornecedor | Cria proposta; fecha o pedido (`RESPONDIDO`) só se for direcionado, não se for broadcast |
| `POST /proposals/{id}/accept` | contratante dono | Cria o `Contract`, fecha proposta e pedido |
| `POST /proposals/{id}/reject` | contratante dono | Marca proposta como recusada |

### `contracts` — `/contracts`
| Rota | Papel | Descrição |
|---|---|---|
| `GET /contracts` | contratante ou fornecedor | Lista contratos do usuário (coluna de posse escolhida pelo papel) |
| `GET /contracts/{id}` | dono (contratante ou fornecedor) | 404 se não existir ou não for seu |

### `disputes` — `/disputes`
| Rota | Papel | Descrição |
|---|---|---|
| `POST /disputes` | contratante dono do contrato | Abre disputa contra o fornecedor do contrato |

Não há endpoint de listagem de disputas fora do painel admin — o fornecedor
ainda não tem como ver/responder disputas reais pela API (a tela dele é mock).

### `reviews` — `/reviews`
| Rota | Papel | Descrição |
|---|---|---|
| `POST /reviews` | contratante dono do contrato | Cria avaliação (1 por contrato) |

### `payouts` / `assessor_payouts` — carteiras
| Rota | Papel | Descrição |
|---|---|---|
| `GET /payouts` | fornecedor | Saques do fornecedor |
| `POST /payouts` | fornecedor | Solicita saque Pix (status inicial `ANALISE`) |
| `GET /assessor-payouts` | assessor | Saques do assessor |
| `POST /assessor-payouts` | assessor | Solicita saque Pix do assessor |

### `referrals` — `/referrals` (painel de comissões do assessor)
| Rota | Papel | Descrição |
|---|---|---|
| `GET /referrals` | assessor | Lista de indicações/comissões |
| `GET /referrals/summary` | assessor | Resumo: indicados, taxa de conversão, volume, comissões |
| `GET /referrals/top-providers` | assessor | Top 5 fornecedores por comissão ganha |
| `GET /referrals/commission-trend` | assessor | Comissão ganha por mês (últimos 6 meses) |

### `admin` — `/admin`
| Rota | Papel | Descrição |
|---|---|---|
| `GET /admin/kpis` | admin | Assinantes ativos, MRR, comissões pagas, volume bruto |
| `GET /admin/disputes` | admin | Disputas abertas (`ABERTA`/`EM_ANALISE`) |
| `GET /admin/ecosystem-activity` | admin | Eventos criados por mês (últimos 6 meses) |
| `GET /admin/platform-health` | admin | Conversão, nota média, % contratos concluídos, % disputas resolvidas |
| `GET /admin/top-vendors` | admin | Top 5 fornecedores por receita, com categoria e nota |

## 5. Modelo de dados

Entidades principais (SQLAlchemy, estilo `Mapped`/`mapped_column`):

- **`User`** — tabela central, `role` (`RoleEnum`: contratante/fornecedor/assessor/admin). 1:1 opcional com `ProviderProfile` ou `AssessorProfile` dependendo do papel.
- **`ProviderProfile`** — dados do fornecedor: categoria, moderação, `referred_by_assessor_id` (liga o fornecedor ao assessor que o indicou).
- **`AssessorProfile`** — dados do assessor: `referral_code` único.
- **`ServiceCategory`** — categorias de serviço (Buffet, Decoração, etc.), tabela de referência.
- **`Event`** — evento do contratante; m2m com `ServiceCategory`.
- **`QuoteRequest`** — pedido de orçamento. Unifica o conceito de "oportunidade" (visão fornecedor) e "pedido do marketplace". `provider_id` nulo = broadcast para a categoria inteira.
- **`Proposal`** / **`ProposalItem`** — proposta enviada por um fornecedor a um `QuoteRequest`, com itens de linha.
- **`Contract`** — 1:1 com `Proposal`. Tem **dois** status independentes: `service_status` (execução do serviço) e `payment_status` (estado do escrow) — deliberadamente desacoplados.
- **`Dispute`** / **`DisputeEvidence`** / **`DisputeEvent`** — disputa aberta pelo contratante sobre um contrato, com evidências e timeline.
- **`Review`** — avaliação 1:1 com `Contract` (não direto com o fornecedor).
- **`Commission`** — comissão do assessor sobre um contrato de um fornecedor indicado por ele.
- **`ProviderPayout`** / **`AssessorPayout`** — saques Pix, tabelas separadas mesmo tendo o mesmo formato hoje (motivo: regras devem divergir no futuro).
- **`Plan`** / **`Subscription`** — planos SaaS (só fornecedor/assessor — contratante não assina nada) e assinaturas.
- **`Conversation`** / **`Message`** — modelo de mensageria já existe no banco, mas **sem router exposto** — não há endpoint de mensagens na API hoje.

### Enums principais

`RoleEnum`, `EventTypeEnum`, `EventPhaseEnum`, `VenueStatusEnum`,
`ModerationStatusEnum`, `QuoteRequestStatusEnum`, `ProposalStatusEnum`,
`ServiceStatusEnum`, `EscrowStatusEnum`, `PayoutStatusEnum`,
`CommissionStatusEnum`, `DisputeCategoryEnum`, `DisputeSeverityEnum`,
`DisputeStatusEnum`, `DisputeResolutionEnum`, `MessageStatusEnum`,
`PlanRoleEnum`, `BillingCycleEnum`, `SubscriptionStatusEnum` — ver
`apps/api/app/models/enums.py` para os valores exatos de cada um.

## 6. Limitações conhecidas da v1

- **Sem cadastro real**: não há endpoint de signup. Novos usuários só entram via seed/DB direto.
- **Sem mensageria real**: modelo `Conversation`/`Message` existe no banco, mas nenhum router o expõe — todo chat no frontend é mock local por perfil.
- **Sem migrations**: schema criado via `create_all`, não há Alembic. Mudança de schema em dev = apagar `timtim.db` e rodar o seed de novo.
- **SQLite único ambiente suportado** hoje (nenhum driver de outro banco em `requirements.txt`).
- **`SECRET_KEY` de dev insegura por padrão** — precisa ser sobrescrita via variável de ambiente antes de qualquer deploy real.
- **Sem testes automatizados** no backend (nenhum framework de teste no `requirements.txt`).

Para o inventário completo de quais telas do frontend já consomem essa API de
verdade e quais ainda são protótipo estático, ver [`FLUXOS.md`](./FLUXOS.md).
Para containerização e deploy em nuvem, ver [`DEPLOY.md`](./DEPLOY.md).
