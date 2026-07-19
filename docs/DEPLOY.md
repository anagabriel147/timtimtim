# TimTim — Deploy de Produção (v1)

Runbook de deploy técnico: build das imagens, simulação local do ambiente de
produção, e comandos de CLI para subir em AWS ou GCP.

**Sem usuários ativos ainda?** Comece pela seção 5 — uma única instância EC2
rodando tudo em Docker Compose, bem mais barata que ECS/RDS (seção 3)
enquanto não há tráfego real que justifique o custo/robustez de serviços
gerenciados separados.

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

## 5. AWS — instância única (EC2, menor custo)

Arquitetura: 1 EC2 rodando `docker-compose.ec2.yml` — Postgres + API + Web +
nginx, todos em containers na mesma máquina. Só o nginx expõe porta pro
mundo (80, depois 443); Postgres/API/Web só conversam pela rede interna do
Docker. Nenhum RDS, nenhum ALB, nenhum ECS — é o `docker-compose` que já
testamos localmente, só que rodando na nuvem atrás de 1 IP fixo.

Isso é deliberadamente menos resiliente que as seções 3/4 (sem failover, sem
scaling horizontal, um reboot do host derruba tudo por alguns segundos) — é
a troca certa **enquanto não há usuários reais**. Migrar pra ECS+RDS depois é
só trocar de arquivo de compose/infra; o código da aplicação não muda.

### 5.1 Tamanho da instância — cuidado com a RAM

| Tipo | vCPU | RAM | ~Custo/mês (on-demand, sob consulta*) | Free Tier |
|---|---|---|---|---|
| `t4g.nano` | 2 | 0.5 GB | mais barato (ARM/Graviton) | não é o Free Tier clássico |
| `t3.micro` | 2 | 1 GB | um pouco mais caro | sim, 750h/mês por 12 meses em conta nova |

Rodar Postgres + gunicorn(FastAPI) + Node(Next.js) + nginx simultaneamente em
0.5 GB é apertado — `deploy.sh` já cria 1GB de swap como mitigação barata,
mas se notar OOM/lentidão, `t3.micro` (1GB) dá bem mais folga por pouca
diferença de custo. *Confirme os valores atuais na sua região no
[AWS Pricing Calculator](https://calculator.aws) antes de decidir — preços mudam.

### 5.2 Criar a instância (AWS CLI)

Placeholders `<...>` — substitua pelos seus. Requer `aws configure` feito.

```bash
export AWS_REGION=us-east-1   # ajuste pra sua região
export KEY_NAME=timtim-key

# Par de chaves SSH (pule se já tiver um)
aws ec2 create-key-pair --region "$AWS_REGION" --key-name "$KEY_NAME" \
  --query 'KeyMaterial' --output text > "$KEY_NAME.pem"
chmod 400 "$KEY_NAME.pem"

# AMI mais recente do Ubuntu 24.04 LTS via SSM (evita hardcodear um ami-id
# que fica desatualizado/varia por região) — arm64 para t4g.nano:
AMI_ID=$(aws ec2 describe-images --region "$AWS_REGION" --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*" \
            "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)
# Para t3.micro (x86_64), troque "arm64" por "amd64" no filtro acima.

# Security group no VPC default
VPC_ID=$(aws ec2 describe-vpcs --region "$AWS_REGION" \
  --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)
SG_ID=$(aws ec2 create-security-group --region "$AWS_REGION" \
  --group-name timtim-sg --description "TimTim - 22/80/443" --vpc-id "$VPC_ID" \
  --query 'GroupId' --output text)

MY_IP="$(curl -s https://checkip.amazonaws.com)/32"
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" --group-id "$SG_ID" \
  --protocol tcp --port 22 --cidr "$MY_IP"                # SSH só do seu IP
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" --group-id "$SG_ID" \
  --protocol tcp --port 80 --cidr 0.0.0.0/0                # HTTP público
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" --group-id "$SG_ID" \
  --protocol tcp --port 443 --cidr 0.0.0.0/0               # HTTPS público (uso futuro)

# Instância — deploy.sh (raiz do repo) vira o user-data
INSTANCE_ID=$(aws ec2 run-instances --region "$AWS_REGION" \
  --image-id "$AMI_ID" \
  --instance-type t4g.nano \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]' \
  --user-data file://deploy.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=timtim-prod}]' \
  --query 'Instances[0].InstanceId' --output text)

aws ec2 wait instance-running --region "$AWS_REGION" --instance-ids "$INSTANCE_ID"
echo "Instância: $INSTANCE_ID"
```

Alternativa pelo console: EC2 → Launch instance → Ubuntu Server 24.04 LTS →
`t4g.nano` (ou `t3.micro`) → criar/selecionar key pair → Network settings →
criar security group com as 3 regras acima → Advanced details → User data →
colar o conteúdo de `deploy.sh` → Launch.

### 5.3 Elastic IP

```bash
ALLOC_ID=$(aws ec2 allocate-address --region "$AWS_REGION" --domain vpc \
  --query 'AllocationId' --output text)
aws ec2 associate-address --region "$AWS_REGION" \
  --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC_ID"

aws ec2 describe-addresses --region "$AWS_REGION" --allocation-ids "$ALLOC_ID" \
  --query 'Addresses[0].PublicIp' --output text
```

Um Elastic IP associado a uma instância **em execução** não tem custo
adicional — só é cobrado se ficar alocado e **sem** associar a nada em
execução (checar preço atual — política muda). Console: EC2 → Elastic IPs →
Allocate Elastic IP address → Actions → Associate Elastic IP address.

### 5.4 Primeiro boot — o único passo manual

`deploy.sh` faz tudo automaticamente (update do SO, Docker, swap, clone do
repo) **exceto** subir os containers, de propósito — ver o comentário no
topo do arquivo sobre por que segredos não entram em user-data. Espere ~2-3
min o boot/user-data terminarem, depois:

```bash
ssh -i timtim-key.pem ubuntu@<ELASTIC_IP>
cd /opt/timtim
cp .env.ec2.example .env.ec2
nano .env.ec2   # CORS_ORIGINS e NEXT_PUBLIC_API_URL = http://<ELASTIC_IP> (e /api)
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build
```

App em `http://<ELASTIC_IP>/`, API em `http://<ELASTIC_IP>/api/...`. Ver
seção 0 antes de rodar o seed contra esta instância.

Pra atualizar depois de um novo push: `cd /opt/timtim && git pull &&
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build`
(ou rode `deploy.sh` de novo — ele já sabe fazer isso quando `.env.ec2` existe).

### 5.5 HTTPS depois (precisa de domínio)

Let's Encrypt não emite certificado válido pra um IP nu — só pra domínio.
Quando tiver um domínio apontando (registro A) pro Elastic IP:

```bash
ssh -i timtim-key.pem ubuntu@<ELASTIC_IP>
sudo apt-get install -y certbot
sudo docker compose -f /opt/timtim/docker-compose.ec2.yml --env-file /opt/timtim/.env.ec2 stop nginx
sudo certbot certonly --standalone -d SEU_DOMINIO --non-interactive --agree-tos -m SEU_EMAIL
```

Depois: descomentar a porta `443` e o volume de certs em
`docker-compose.ec2.yml`, apontar `ssl_certificate`/`ssl_certificate_key`
para `/etc/letsencrypt/live/SEU_DOMINIO/` em `nginx/ec2.conf` (adicionar um
`server { listen 443 ssl; ... }` e redirecionar 80→443), atualizar
`NEXT_PUBLIC_API_URL`/`CORS_ORIGINS` para `https://SEU_DOMINIO/...` e
rebuildar (`docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up
-d --build`). Renovação: `certbot renew` via cron, parando o nginx antes e
subindo depois (ou usar o plugin webroot do certbot pra renovar sem downtime
— fora do escopo deste runbook inicial).

## 6. Checklist antes de apontar DNS de verdade

- [ ] `SECRET_KEY` forte e único, fora do repositório (Secrets Manager / Secret Manager)
- [ ] `CORS_ORIGINS` restrito ao(s) domínio(s) real(is) do frontend
- [ ] Banco gerenciado sem acesso público (`--no-publicly-accessible` / sem IP público no Cloud SQL), só acessível pela rede da API
- [ ] Backups automáticos habilitados no banco gerenciado
- [ ] Resolvido o problema da seção 0 (cadastro real de usuários) — ou aceito conscientemente que só as contas seedadas existirão
- [ ] Rotação/expiração de `ACCESS_TOKEN_EXPIRE_MINUTES` revisada para o caso de uso real
