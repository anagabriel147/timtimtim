# TimTim — API

Backend em Python (FastAPI), com SQLAlchemy 2.0 para persistência e Pydantic v2
para os schemas.

Este pacote não usa pnpm/Node — é um projeto Python isolado dentro do workspace,
com seu próprio ambiente virtual. O `pnpm-workspace.yaml` na raiz só reconhece
pacotes com `package.json`, então ele simplesmente ignora esta pasta.

## Estrutura

```
apps/api/
├── .venv/            ambiente virtual (não versionado)
├── requirements.txt
├── timtim.db         SQLite (não versionado, gerado no primeiro start/seed)
└── app/
    ├── main.py          instância do FastAPI, CORS, registro de routers
    ├── db.py            engine, sessão, Base declarativa
    ├── dependencies.py  get_current_user (JWT bearer)
    ├── seed.py          popula categorias, usuários demo e dados de exemplo
    ├── core/            config (env vars) e segurança (hash, JWT)
    ├── models/          entidades SQLAlchemy
    ├── schemas/         schemas Pydantic (request/response)
    └── routers/         um arquivo por domínio (auth, events, proposals, ...)
```

## Começar

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed          # idempotente — pode rodar de novo a qualquer momento
uvicorn app.main:app --reload --port 8000
```

API em http://localhost:8000 — CORS liberado para `http://localhost:3000` (o
frontend em `apps/web`). Não há sistema de migração: o schema é criado via
`Base.metadata.create_all()` no startup. Para aplicar uma mudança de schema em
desenvolvimento, apague `timtim.db` e rode o seed de novo.

Variáveis de ambiente (ver `.env.example`): `DATABASE_URL`, `SECRET_KEY`,
`ACCESS_TOKEN_EXPIRE_MINUTES`.

## Documentação completa

Referência de todos os endpoints, modelo de dados e credenciais de demo em
[`../../docs/TECHNICAL.md`](../../docs/TECHNICAL.md).
