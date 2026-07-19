# Testes E2E (Cypress)

46 testes cobrindo os 4 perfis (contratante, fornecedor, assessor, admin) +
auth/cadastro/landing. Para telas **REAL** (ver `docs/FLUXOS.md`), os testes
batem na API de verdade e verificam o comportamento real (POST cria
recurso, listas vêm do banco, etc.). Para telas **MOCK**, são só smoke
tests (a página carrega sem crash) — não faz sentido "testar
funcionalidade" de dado estático.

## Início rápido

Precisa do backend **e** do frontend rodando, com o banco recém-semeado:

```bash
# terminal 1 — backend com seed fresco
cd apps/api
rm -f timtim.db
source .venv/bin/activate
python -m app.seed
uvicorn app.main:app --reload --port 8000

# terminal 2 — frontend
pnpm --filter web dev

# terminal 3 — testes
pnpm --filter web cypress:run     # headless, roda tudo, imprime resultado no terminal
pnpm --filter web cypress:open    # interativo — abre um browser de verdade
```

(Ou, da raiz do repo: `pnpm test:e2e` — equivalente ao `cypress:run` acima.)

**Importante**: se você resemear o banco (`rm timtim.db && python -m app.seed`)
com o `uvicorn --reload` **já rodando**, reinicie o processo do uvicorn
depois. No Unix, um processo com o arquivo já aberto continua lendo/
escrevendo no inode antigo (apagado) em vez do arquivo novo no mesmo
caminho — isso causa dado "fantasma"/inconsistente até reiniciar o
processo. (Isso mordeu a gente escrevendo esta própria suíte.)

## Rodando só um teste (modo interativo, pra debugar)

```bash
pnpm --filter web cypress:open
```

Abre o Cypress App → escolha **E2E Testing** → escolha um browser → clique
no arquivo `.cy.ts` que quer rodar. Cada comando do teste fica clicável na
timeline à esquerda; clicar num passo mostra o DOM exatamente naquele
momento — é a forma mais rápida de entender por que um teste quebrou.

Pra rodar um spec específico sem abrir a UI interativa:

```bash
pnpm --filter web exec cypress run --spec "cypress/e2e/admin/dashboard.cy.ts"
```

Quando um teste falha no modo headless, o Cypress salva um screenshot
automático em `cypress/screenshots/` (gitignored) — abra o PNG pra ver a
tela exata no momento da falha.

## Estrutura

```
cypress/
├── e2e/
│   ├── auth/           login (as 4 roles + credencial inválida)
│   ├── contratante/     dashboard, novo evento, aceitar proposta, contratos,
│   │                    disputas, avaliações, + smoke das telas mock
│   ├── fornecedor/      dashboard, responder oportunidade, propostas,
│   │                    contratos, carteira, + smoke das telas mock
│   ├── assessor/        dashboard, indicações, saque, modo fornecedor
│   │                    delegado (smoke), + smoke das telas mock
│   ├── admin/           dashboard (KPIs/disputas/saúde/top fornecedores)
│   ├── cadastro/        smoke (100% mock, sem endpoint de signup)
│   └── home/            smoke da landing pública
├── support/
│   ├── commands.ts      comando customizado cy.loginAs(role)
│   └── e2e.ts           importa commands.ts (roda antes de cada spec)
└── tsconfig.json        tsconfig isolado do cypress/ (não conflita com o do app)
```

## Convenções pra escrever novos testes

**Login**: use `cy.loginAs('contratante' | 'fornecedor' | 'assessor' | 'admin')`
no início do teste (ou num `beforeEach`). Ele faz login de verdade via API
(`POST /auth/login`), guarda o token no `localStorage` e navega pra
`/{role}` — cacheado por role via `cy.session()`, então logins repetidos
dentro da mesma run são instantâneos. Não escreva login manual clicando em
inputs, exceto no próprio `auth/login.cy.ts` (que testa o formulário em si).

**Seletores**: o app não tem `data-testid` em lugar nenhum. Os testes usam
`cy.contains('texto exato do botão/label')` como primeira opção, e
`cy.get('input[placeholder="..."]')` / `cy.get('select').eq(n)` quando o
texto não é suficiente pra desambiguar. Antes de escrever um seletor,
confira o texto/estrutura real abrindo a tela no `cypress:open` — não
adivinhe a partir do nome do componente.

**Dados**: prefira fluxos que criam seus próprios dados (ex.:
`novo-evento.cy.ts` cria um evento novo com nome único via `Date.now()`)
em vez de depender de IDs fixos do seed. Quando não tem jeito (ver
"Por que alguns testes só passam 1x" abaixo), documente isso num
comentário no topo do arquivo, como os testes existentes fazem.

**Verificação de rede**: pra confirmar que uma ação bateu na API de
verdade (não só mudou estado local), use `cy.intercept()` +
`cy.wait('@alias').its('response.statusCode')`, não confie só em texto
que aparece na tela — telas de sucesso costumam ser transitórias
(ex.: some sozinha depois de 2-3s com um `setTimeout`) e podem já ter
desaparecido quando o Cypress checar.

## Por que alguns testes só passam 1x por seed fresco

Um punhado de fluxos reais têm efeito colateral não-idempotente no
backend — não é bug do teste, é a regra de negócio de verdade:

- `contratante/proposta-aceitar.cy.ts` — aceita a única proposta pendente
  do seed; depois de aceita, ela vira contrato e some da lista de
  pendentes.
- `contratante/avaliacoes.cy.ts` — avaliação é 1-por-contrato (constraint
  do banco); mira no único contrato do seed ainda sem avaliação.
- `fornecedor/responder-oportunidade.cy.ts` — depois que o fornecedor
  responde a uma oportunidade, a API a exclui da listagem dele.
- `fornecedor/carteira.cy.ts` e `assessor/payout.cy.ts` — sacam o saldo
  disponível inteiro (botão "MÁXIMO"/"Sacar tudo"); o saldo só volta a
  ficar disponível com novos contratos confirmados.

Rodando a suíte inteira contra um seed fresco (`pnpm test:e2e`, uma vez),
tudo passa — inclusive esses. Rodar de novo sem resemear vai falhar só
nesses testes específicos, não nos outros.

## Gap conhecido de cobertura

O wizard de "novo evento" do contratante **não** cria uma `QuoteRequest`/
oportunidade real — só o `Event`. Não existe hoje um caminho de UI real
pra "contratante cria pedido → fornecedor vê como oportunidade nova"; o
único jeito de um fornecedor ter uma oportunidade pra responder é via
seed. Por isso `responder-oportunidade.cy.ts` mira na oportunidade
semeada, não numa criada pelo próprio teste — não é uma limitação do
teste, é uma lacuna real do produto (ver `docs/FLUXOS.md`).
