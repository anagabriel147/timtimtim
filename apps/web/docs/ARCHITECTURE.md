# Arquitetura do frontend

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui

## Princípio

Organização **por feature (domínio)**, não por tipo de ficheiro. Cada feature é uma
fatia vertical autocontida — componentes, dados, estado e tipos — com uma API
pública explícita. As rotas em `src/app` são finas: apenas metadata e composição.

```
src/
├── app/                    # Rotas (App Router). Só metadata + composição.
├── features/               # Fatias verticais de domínio
│   └── <feature>/
│       ├── components/     # UI da feature (privado)
│       ├── data/           # Mocks / acesso a dados (privado)
│       ├── store/          # Estado client-side, Context (privado)
│       ├── types.ts        # Modelos de domínio — fonte única de verdade
│       └── index.ts        # ⬅ API pública (barrel). Único ponto de entrada externo.
├── components/
│   ├── ui/                 # Primitivos do design system (shadcn)
│   ├── layout/             # Shells: topbars, navs, footers, menu de perfil
│   └── brand/              # Logo e marca
├── config/                 # Constantes de app (navegação, feature flags)
├── hooks/                  # Hooks React reutilizáveis
├── lib/                    # Utilitários puros (cn, formatters)
└── types/                  # Tipos transversais
```

## Regra de dependências

```
app  →  features  →  components/ui · components/layout · hooks · lib · config · types
```

1. **`src/app` importa features apenas pelo barrel**: `@/features/contratos`, nunca
   `@/features/contratos/components/...`.
2. **Features comunicam entre si apenas pelo barrel.** Dentro da própria feature,
   usa-se caminho relativo (`../data/contracts-data`).
3. **As camadas partilhadas nunca importam features.** Se um componente partilhado
   precisar de dados de domínio, esses dados sobem para `src/config` ou entram por props.

Ambas as regras são aplicadas por ESLint (`no-restricted-imports` em `eslint.config.mjs`),
por isso uma violação falha o `pnpm lint` — não depende de revisão manual.

## Features

| Feature       | Domínio                                                           |
| ------------- | ----------------------------------------------------------------- |
| `auth`        | Login                                                             |
| `home`        | Landing pública                                                   |
| `cadastro`    | Registo, escolha de plano e checkout                              |
| `marketplace` | Explorar/pesquisar fornecedores, perfil e pedido de orçamento     |
| `contratante` | Painel do contratante e assistente de criação de evento           |
| `eventos`     | Detalhe do evento e pagamentos                                    |
| `contratos`   | Contratos do contratante                                          |
| `disputas`    | Abertura e acompanhamento de disputas                             |
| `avaliacoes`  | Avaliação de fornecedores                                         |
| `mensagens`   | Chat contratante ↔ fornecedor                                     |
| `fornecedor`  | Painel do fornecedor (propostas, contratos, carteira, relatórios) |
| `assessor`    | Painel do assessor e área de fornecedor delegada                  |
| `admin`       | Supervisão da plataforma                                          |

## Camada de dados

Todos os dados são **mocks estáticos** em `features/<feature>/data/*.ts` — o
protótipo não tem backend. Os tipos vivem em `features/<feature>/types.ts` e os
mocks são tipados contra eles, portanto trocar um mock por um `fetch` real é uma
mudança localizada num único ficheiro; os componentes não mudam.

Ao ligar a API real:

1. Manter a assinatura exportada do módulo `data/`.
2. Substituir a constante por uma função `async` (Server Component) ou por um hook.
3. Os tipos em `types.ts` passam a ser o contrato validado da resposta.

## Convenções

- Ficheiros e pastas em `kebab-case`; componentes em `PascalCase`.
- `'use client'` apenas onde há estado/efeitos — manter as páginas como Server Components.
- Componentes acima de ~300 linhas devem ser divididos (ver `features/contratante/components/event-wizard/`).
- Cores, raios e tipografia vêm dos tokens em `src/app/globals.css` — nada de valores hardcoded.

## Comandos

```bash
pnpm dev        # servidor de desenvolvimento
pnpm typecheck  # tsc --noEmit
pnpm lint       # ESLint + fronteiras de arquitetura
pnpm format     # Prettier
pnpm check      # typecheck + lint + format:check
```
