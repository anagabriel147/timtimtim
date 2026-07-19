# TimTim — Fluxos por Perfil (v1)

Este documento descreve, tela por tela, o que cada perfil consegue fazer hoje
e se aquilo é dado real (vem do backend) ou ainda é protótipo estático. Para
arquitetura, setup e referência de API, ver [`TECHNICAL.md`](./TECHNICAL.md).

## Legenda

- **REAL** — a tela busca/grava dado de verdade via `apps/web/src/lib/api.ts`, que fala com o FastAPI.
- **MOCK** — a tela renderiza uma constante estática de `features/<feature>/data/*.ts`; nenhuma chamada de API.
- **PARCIAL** — parte da tela é real, parte é estática (indicado o que é o quê).

Quatro perfis: **contratante** (quem contrata o evento), **fornecedor**
(prestador de serviço), **assessor** (indica fornecedores e ganha comissão),
**admin** (operação da plataforma).

---

## Público

| Rota | Descrição | Status |
|---|---|---|
| `/` | Tela de login | **REAL** — autentica via `POST /auth/login`, guarda token, redireciona para `/{papel}` |
| `/home` | Landing de marketing (hero, fornecedores em destaque, depoimentos) | **MOCK** — inteiramente estática |

> A raiz (`/`) é o login, não a landing — a landing pública fica em `/home`.
> Vale ter isso em mente ao linkar a partir de material de marketing.

## Cadastro (`/cadastro/*`)

**Inteiramente MOCK.** Seleção de papel → perfil → plano/checkout → senha, com
navegação entre passos via `router.push`. A tela final simula "Cadastro
concluído!" a partir de estado local — nenhum dado é persistido, porque **não
existe endpoint de signup na API**. Hoje a única forma de um usuário existir é
via `app.seed`. Isso não é uma migração pendente do frontend — é backend que
ainda não foi construído.

## Contratante

| Rota | Descrição | Status |
|---|---|---|
| `/contratante` | Dashboard: eventos, contratos, propostas pendentes | **REAL** — `listEvents`, `listContracts`, `listProposals` |
| `/contratante/novo-evento` | Assistente de criação de evento | **REAL** — categorias via `listCategories`, submissão via `createEvent` |
| `/contratante/eventos/[id]` | Detalhe do evento, orçamento, propostas recebidas | **PARCIAL** — evento/propostas reais (`getEvent`, `listProposals`, `acceptProposal`, `rejectProposal`); cards de estatística lateral (orçamento, contagem regressiva, distribuição de gastos) são estáticos |
| `/contratante/contratos` | Lista de contratos | **PARCIAL** — lista real via `listContracts`; o card-resumo "Valor Protegido" no topo tem números fixos hardcoded (não somados dos contratos reais) |
| `/contratante/contratos/[id]` | Detalhe do contrato, timeline, cláusulas | **REAL** — mesmo contrato real; texto de cláusulas é conteúdo jurídico estático por natureza, não "dado fake" |
| `/contratante/disputas/nova` | Abrir disputa sobre um contrato | **REAL** — `createDispute`, a partir da lista real de contratos |
| `/contratante/avaliacoes/[id]` | Avaliar um contrato concluído | **REAL** — `createReview`; números de "impacto da avaliação" pós-envio são estáticos |
| `/contratante/mensagens` | Chat com fornecedores | **MOCK** — não existe endpoint de mensageria na API |
| `/contratante/fornecedores` (+ `busca`, `[slug]`) | Explorar/buscar fornecedores, perfil, pedido de orçamento | **MOCK — inteiramente.** Nenhuma chamada de API na feature `marketplace`; "pedir orçamento" e "contatar fornecedor" só empurram mensagens pro chat mock local |

## Fornecedor

| Rota | Descrição | Status |
|---|---|---|
| `/fornecedor` | Dashboard: oportunidades, propostas, contratos, estatísticas | **PARCIAL** — `listOpportunities`, `listMyProposals`, `listContracts` reais; widget de "Mensagens" embutido é estático, botões disparam toast "em breve" |
| `/fornecedor/propostas` | Lista de propostas enviadas | **REAL** — `listMyProposals` |
| `/fornecedor/proposta/[id]` | Responder a uma oportunidade (criar proposta) | **REAL** — `getOpportunity`, `listCategories`, submissão via `createProposal` |
| `/fornecedor/contratos` | Lista de contratos | **REAL** — `listContracts` |
| `/fornecedor/carteira` | Saldo e solicitação de saque | **REAL** — `listContracts` + `listPayouts`, saque via `requestPayout` |
| `/fornecedor/relatorios` | Relatórios de conversão, cupom, visualizações de perfil | **MOCK — inteiramente.** Objeto estático embutido no componente, sem arquivo de dados nem API |
| `/fornecedor/disputas` | Ver/responder disputa | **MOCK — inteiramente.** Caso, status e prazo são fixos — hoje o fornecedor **não consegue ver uma disputa real** pela API (não há endpoint de listagem de disputas fora do admin) |
| `/fornecedor/mensagens` | Chat com contratantes | **MOCK** — mesmo padrão dos outros chats |

## Assessor

| Rota | Descrição | Status |
|---|---|---|
| `/assessor` | Dashboard: KPIs, cupom, gráfico de comissões, comissões recentes, saque | **PARCIAL** — `getReferralSummary`, `getCommissionTrend`, `listReferrals`, `listAssessorPayouts`/`requestAssessorPayout` reais; a seção "Casamentos sob sua Assessoria" é estática e a própria UI já mostra um selo **"exemplo"** avisando disso (não existe modelo de gestão de casamento por assessor ainda) |
| `/assessor/indicacoes` | Lista completa de indicações e comissões | **REAL** — `getReferralSummary`, `getCommissionTrend`, `listReferrals`, `listTopProviders`, `listAssessorPayouts`, `requestAssessorPayout` |
| `/assessor/carteira` | Carteira/saldo do assessor | **MOCK — inteiramente.** Objeto estático, nenhuma chamada de API — **duplica e contradiz** o painel de carteira real já embutido em `/assessor`; são duas implementações inconsistentes do mesmo conceito |
| `/assessor/mensagens` | Chat | **MOCK** — mesmo padrão |
| `/assessor/fornecedor/*` | "Modo fornecedor" delegado (mesma UI do fornecedor, com chrome do assessor) | Espelha exatamente o status da seção Fornecedor acima: dashboard/propostas/contratos/carteira **REAL**, relatórios/disputas **MOCK** |

## Admin

| Rota | Descrição | Status |
|---|---|---|
| `/admin` ("Visão Geral") | KPIs globais, disputas abertas, atividade do ecossistema, saúde da plataforma, top fornecedores | **REAL** — `getAdminKpis`, `listOpenDisputes`, `getEcosystemActivity`, `getPlatformHealth`, `getAdminTopVendors` |
| Disputas, Métricas Avançadas, Fornecedores, Configurações (abas do menu) | — | **Não implementadas** — nenhuma rota/página existe; clicar só dispara toast "em breve" |

## Funcionalidades transversais

- **Mensagens** (`features/mensagens`) — mock em todo lugar onde aparece (contratante, fornecedor, assessor), cada um com seu próprio estado local. Não é falta de integração pontual: **não existe endpoint de mensageria na API** (o modelo `Conversation`/`Message` existe no banco, mas sem router).
- **Marketplace** (`features/marketplace`) — busca/perfil de fornecedor e pedido de orçamento, usado só pelo contratante. 100% mock, incluindo o fluxo de "pedir orçamento", que hoje não vira um `QuoteRequest` real — só uma mensagem no chat mock.

## Pontas soltas a considerar antes de expandir a v1

1. **Carteira do assessor duplicada**: `/assessor/carteira` (mock, isolada) vs. o painel real já dentro de `/assessor`. Escolher uma — provavelmente aposentar a rota dedicada ou torná-la real e redirecionar a home pra ela.
2. **Fornecedor não vê disputas reais**: a tela existe e parece funcional, mas é 100% estática. Sem um endpoint de listagem de disputas para o fornecedor, ele não sabe que tem uma disputa aberta contra ele a não ser que o contratante fale por outro canal.
3. **Cadastro e mensageria dependem de trabalho de backend**, não só de "trocar o mock por fetch" — os endpoints correspondentes ainda não existem.
4. **Admin tem só 1 de 5 abas construídas.** Se a v1 for divulgada com o menu completo visível, vale avaliar esconder as abas não implementadas em vez de deixá-las como toast.
5. Cards com números fixos escondidos dentro de telas já reais (contratante/contratos "Valor Protegido", eventos/detalhe "distribuição de orçamento", avaliações "impacto") — pequenos, mas valem uma limpeza para não misturar dado real com decoração numérica fixa na mesma tela.
