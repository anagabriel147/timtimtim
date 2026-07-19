# TimTim — Deploy de Produção (v1)

Runbook de deploy técnico: build das imagens, simulação local do ambiente de
produção, e comandos de CLI para subir em AWS ou GCP com Postgres gerenciado.

**Leia a seção 0 antes de apontar qualquer coisa aqui para um banco real.**
Tem uma lacuna de produto que bloqueia um "go-live" de verdade hoje.

## 0. Antes de continuar — leia isto

- **Não existe endpoint de cadastro na API.** Hoje a única forma de criar um
  usuário é rodando `python -m app.seed`, que cria 4 contas fixas com senha
  `12345` (ver `docs/TECHNICAL.md`). **Nunca rode o seed contra o Postgres de
  produção real** — isso colocaria uma conta de admin com senha trivial na
  internet. Sem um fluxo de signup (ou um script controlado de criação manual
  de usuários com senha forte), a v1 não tem como onboardar usuários reais em
  produção. Isso é anterior a qualquer decisão de infraestrutura — vale
  resolver antes do go-live real, não só antes de "subir os containers".
- **`SECRET_KEY` de dev é insegura por padrão** (`dev-only-insecure-secret-change-me`)
  — o comando de deploy abaixo assume que você vai gerar uma chave forte e
  passá-la via variável de ambiente/secret manager, nunca deixar o padrão.
- **Sem migrations (Alembic)** — o schema é criado via `Base.metadata.create_all()`
  no startup da API. Isso funciona bem para o primeiro boot contra um banco
  vazio; não existe hoje um caminho para aplicar mudanças de schema
  incrementais em produção sem downtime/perda de dado. Se o plano é evoluir o
  schema depois do go-live, vale introduzir Alembic antes.

Com isso dito, o que segue cobre exatamente o que foi pedido: containerizar,
simular localmente, e os comandos de CLI para subir as imagens e o banco
gerenciado.

## 1. Build local das imagens

```bash
# API — contexto = apps/api
docker build -t timtim-api -f apps/api/Dockerfile apps/api

# Web — contexto = raiz do monorepo (precisa do pnpm-lock.yaml/workspace)
# NEXT_PUBLIC_API_URL é inlined no bundle do browser em build time — trocar
# depois exige rebuild da imagem, não só trocar env var em runtime.
docker build -t timtim-web -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.timtim.com.br .
```

## 2. Simular produção localmente

```bash
cp .env.prod.example .env.prod
# editar .env.prod: POSTGRES_PASSWORD, SECRET_KEY (gerar forte — ver comentário
# no arquivo), CORS_ORIGINS, NEXT_PUBLIC_API_URL

docker compose -f docker-compose.prod.yml --env-file .env.prod up --build
```

Isso sobe Postgres + API (gunicorn/uvicorn) + Next.js standalone, exatamente
como rodariam em produção. Frontend em `http://localhost:3000`, API em
`http://localhost:8000`. Para popular com dado de exemplo **nesta simulação
local** (nunca em produção real — ver seção 0):

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod run --rm api python -m app.seed
```

## 3. AWS — ECR + RDS + ECS Fargate

Valores entre `<...>` são placeholders — substitua pelos seus.

### 3.1 Repositórios de imagem (ECR) e push

```bash
aws ecr create-repository --repository-name timtim-api --region <REGION>
aws ecr create-repository --repository-name timtim-web --region <REGION>

aws ecr get-login-password --region <REGION> \
  | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

docker tag timtim-api:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/timtim-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/timtim-api:latest

docker tag timtim-web:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/timtim-web:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/timtim-web:latest
```

### 3.2 Postgres gerenciado (RDS)

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name timtim-subnets \
  --db-subnet-group-description "TimTim subnets" \
  --subnet-ids <SUBNET_ID_1> <SUBNET_ID_2>

aws rds create-db-instance \
  --db-instance-identifier timtim-prod \
  --engine postgres \
  --engine-version 16 \
  --db-instance-class db.t4g.micro \
  --allocated-storage 20 \
  --master-username timtim_admin \
  --master-user-password '<SENHA_FORTE>' \
  --db-name timtim \
  --vpc-security-group-ids <SECURITY_GROUP_ID> \
  --db-subnet-group-name timtim-subnets \
  --backup-retention-period 7 \
  --no-publicly-accessible \
  --storage-encrypted

aws rds wait db-instance-available --db-instance-identifier timtim-prod

aws rds describe-db-instances --db-instance-identifier timtim-prod \
  --query 'DBInstances[0].Endpoint.Address' --output text
```

O security group do RDS precisa liberar a porta 5432 só para o security group
das tasks do ECS — nunca `0.0.0.0/0`.

### 3.3 Rodando os containers (ECS Fargate)

Isto é o esqueleto mínimo — um rollout corporativo completo também quer ALB +
target groups com health check, auto scaling e secrets via Secrets Manager em
vez de env var em texto puro (`--secrets` no lugar de `--environment` na task
definition).

```bash
aws ecs create-cluster --cluster-name timtim

# Guardar segredos no Secrets Manager em vez de texto puro na task definition:
aws secretsmanager create-secret --name timtim/secret-key --secret-string '<CHAVE_FORTE>'
aws secretsmanager create-secret --name timtim/database-url \
  --secret-string 'postgresql+psycopg2://timtim_admin:<SENHA_FORTE>@<RDS_ENDPOINT>:5432/timtim'

# Registrar as task definitions (JSON próprio por serviço, referenciando as
# imagens do ECR acima e os secrets criados) e criar os serviços:
aws ecs register-task-definition --cli-input-json file://ecs/timtim-api-task.json
aws ecs register-task-definition --cli-input-json file://ecs/timtim-web-task.json

aws ecs create-service \
  --cluster timtim \
  --service-name timtim-api \
  --task-definition timtim-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<SUBNET_ID_1>,<SUBNET_ID_2>],securityGroups=[<SG_ID>],assignPublicIp=ENABLED}"

aws ecs create-service \
  --cluster timtim \
  --service-name timtim-web \
  --task-definition timtim-web \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<SUBNET_ID_1>,<SUBNET_ID_2>],securityGroups=[<SG_ID>],assignPublicIp=ENABLED}"
```

## 4. GCP — Artifact Registry + Cloud SQL + Cloud Run

```bash
gcloud config set project <PROJECT_ID>
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
```

### 4.1 Artifact Registry e push

```bash
gcloud artifacts repositories create timtim --repository-format=docker --location=<REGION>
gcloud auth configure-docker <REGION>-docker.pkg.dev

docker tag timtim-api:latest <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/api:latest
docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/api:latest

docker tag timtim-web:latest <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/web:latest
docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/web:latest
```

### 4.2 Postgres gerenciado (Cloud SQL)

```bash
gcloud sql instances create timtim-prod \
  --database-version=POSTGRES_16 \
  --tier=db-custom-1-3840 \
  --region=<REGION> \
  --storage-size=20GB \
  --storage-auto-increase \
  --backup-start-time=03:00

gcloud sql databases create timtim --instance=timtim-prod
gcloud sql users create timtim_admin --instance=timtim-prod --password='<SENHA_FORTE>'
```

### 4.3 Segredos e deploy (Cloud Run)

```bash
printf '%s' '<CHAVE_FORTE>' | gcloud secrets create timtim-secret-key --data-file=-
printf '%s' 'postgresql+psycopg2://timtim_admin:<SENHA_FORTE>@/timtim?host=/cloudsql/<PROJECT_ID>:<REGION>:timtim-prod' \
  | gcloud secrets create timtim-database-url --data-file=-

gcloud run deploy timtim-api \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/api:latest \
  --region <REGION> \
  --add-cloudsql-instances <PROJECT_ID>:<REGION>:timtim-prod \
  --set-secrets DATABASE_URL=timtim-database-url:latest,SECRET_KEY=timtim-secret-key:latest \
  --set-env-vars CORS_ORIGINS=https://app.timtim.com.br \
  --allow-unauthenticated

gcloud run deploy timtim-web \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/timtim/web:latest \
  --region <REGION> \
  --allow-unauthenticated
```

Se a URL do serviço `timtim-api` só é conhecida depois do primeiro deploy
(Cloud Run gera o domínio), rebuilde a imagem do web com o
`--build-arg NEXT_PUBLIC_API_URL=<url-real-da-api>` antes do `gcloud run
deploy timtim-web` final — de novo, por causa do inlining em build time
mencionado na seção 1.

## 5. Checklist antes de apontar DNS de verdade

- [ ] `SECRET_KEY` forte e único, fora do repositório (Secrets Manager / Secret Manager)
- [ ] `CORS_ORIGINS` restrito ao(s) domínio(s) real(is) do frontend
- [ ] Banco gerenciado sem acesso público (`--no-publicly-accessible` / sem IP público no Cloud SQL), só acessível pela rede da API
- [ ] Backups automáticos habilitados no banco gerenciado
- [ ] Resolvido o problema da seção 0 (cadastro real de usuários) — ou aceito conscientemente que só as contas seedadas existirão
- [ ] Rotação/expiração de `ACCESS_TOKEN_EXPIRE_MINUTES` revisada para o caso de uso real
