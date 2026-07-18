# TimTim — API

Backend em Python (FastAPI), com SQLAlchemy para persistência.

Este pacote não usa pnpm/Node — é um projeto Python isolado dentro do workspace,
com seu próprio ambiente virtual. O `pnpm-workspace.yaml` na raiz só reconhece
pacotes com `package.json`, então ele simplesmente ignora esta pasta.

## Estrutura

```
apps/api/
├── .venv/            ambiente virtual (não versionado)
├── requirements.txt
└── app/
    └── main.py       instância do FastAPI, CORS, rotas
```

## Começar

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API em http://localhost:8000 — CORS liberado para `http://localhost:3000` (o
frontend em `apps/web`).

## Próximos passos

- Definir os models SQLAlchemy e a conexão com o banco de dados.
- Ligar os módulos `data/` do frontend (ver `apps/web/docs/ARCHITECTURE.md`,
  seção "Camada de dados") aos endpoints reais conforme forem criados.
