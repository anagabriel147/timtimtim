# TimTim — API

Backend ainda não implementado.

Este diretório é o slot reservado para o serviço de backend no workspace pnpm.
Quando a stack for definida (Node/Hono, NestJS, outra linguagem, etc.), o serviço
entra aqui como um pacote independente — com o seu próprio `package.json` — e passa
a ser reconhecido automaticamente pelo `pnpm-workspace.yaml` (`apps/*`) na raiz.

O frontend (`apps/web`) hoje usa apenas mocks estáticos (ver
`apps/web/docs/ARCHITECTURE.md`, seção "Camada de dados"). Ligar a API real é uma
mudança localizada nos módulos `data/` de cada feature — os componentes não mudam.
