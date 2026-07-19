# Testes do backend (pytest)

92 testes cobrindo todos os routers reais da API — autenticação, ownership
(quem pode ver/editar o quê), os padrões deliberados de 403 vs. 404 mascarado,
regras de negócio (broadcast vs. solicitação direcionada, comissão pendente
vs. confirmada) e alguns bugs reais que já apareceram e foram corrigidos
antes desta suíte existir, agora travados como regressão.

## Rodar

```bash
cd apps/api
source .venv/bin/activate
pip install -r requirements-dev.txt   # inclui requirements.txt + pytest/httpx
pytest                                 # tudo
pytest tests/test_admin.py -v          # um arquivo, verboso
pytest -k mrr                          # só os testes com "mrr" no nome
```

Não precisa do servidor (`uvicorn`) rodando — os testes chamam a aplicação
FastAPI diretamente via `TestClient`, sem HTTP de verdade.

## Isolamento do banco

Cada teste roda contra `test.db` (SQLite dedicado, na raiz de `apps/api`,
gitignored), com o schema inteiro recriado do zero **antes de cada teste**
(fixture `_fresh_schema` em `conftest.py`, `autouse=True`). Isso é
completamente separado do `timtim.db` de desenvolvimento e do
`app.seed` — os testes não dependem de nenhum dado semeado, cada um cria
só o que precisa via fixtures.

`DATABASE_URL` é setado pra `test.db` no topo de `conftest.py`, **antes**
de qualquer `import app.*` — `app/db.py` lê essa variável uma única vez,
no momento do import, pra construir o engine. Se algum dia um teste
parecer estar lendo o banco errado, comece verificando a ordem de imports.

## Fixtures principais (`conftest.py`)

Todas seguem o padrão "factory as fixture" — a fixture é uma função que
você chama com os parâmetros que quiser, não um objeto fixo:

| Fixture | Cria |
|---|---|
| `client` | `TestClient` da app (usa como um `requests`/`httpx`) |
| `db` | Sessão SQLAlchemy direta, pra inspecionar/preparar estado que a API não expõe |
| `make_user(role, ...)` | `User` com senha já hasheada |
| `auth_headers(user)` | `{"Authorization": "Bearer <token>"}` — gera o JWT direto, sem passar pelo `/auth/login` |
| `make_category`, `make_provider_profile`, `make_assessor_profile` | Catálogo e perfis de papel |
| `make_event`, `make_quote_request`, `make_proposal`, `make_contract` | A cadeia evento → solicitação → proposta → contrato |
| `make_commission`, `make_plan`, `make_subscription`, `make_review` | Dados usados pelos paineis de assessor/admin |

## Por que estes testes existem (não são só cobertura por cobertura)

- **`test_proposals.py::test_broadcast_quote_request_stays_open_after_one_proposal`**
  e **`test_accept_proposal_closes_broadcast_for_all_providers`** — travam a
  correção de um bug real: uma solicitação broadcast (múltiplos fornecedores
  podem responder) fechava pra todo mundo assim que UM respondia, matando a
  concorrência. Corrigido antes desta suíte existir; sem o teste, alguém
  poderia reintroduzir o bug sem perceber.
- **`test_admin.py::TestKpis::test_mrr_only_counts_ativa_subscriptions_not_trial`**
  — trava outra correção real: o MRR (receita recorrente) contava
  assinantes em período de trial como se já estivessem pagando.
- **Todo teste com `404` no nome pra dono errado** (`test_get_event_404_for_non_owner`,
  `test_accept_proposal_404_for_non_owner_contratante`, etc.) — confirma o
  padrão deliberado do backend de mascarar posse como 404 em vez de 403 (não
  revelar que um recurso existe pra quem não tem acesso a ele). Ver
  `docs/TECHNICAL.md` seção de autenticação.

## Convenções pra escrever novos testes

- Um arquivo por router (`test_<router>.py`), espelhando `app/routers/`.
- Monte só o que o teste precisa via fixtures — não existe um "seed padrão"
  compartilhado entre testes, de propósito (evita testes que só passam por
  causa de dado de outro teste).
- Prefira `client.get/post(...)` (via HTTP de verdade contra a app) a chamar
  funções do router diretamente — testa o contrato real da API (validação
  Pydantic, status codes, serialização), não só a lógica interna.
- Quando o comportamento não é óbvio pela leitura do endpoint (uma regra de
  negócio, uma exclusão específica, um bug corrigido), escreva um comentário
  curto no teste explicando o "porquê" — como nos dois exemplos citados acima.
