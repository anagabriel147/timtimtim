# TimTim — Deploy e Atualização 100% Manual (sem CLI, sem scripts)

Este guia existe para o dia em que `atualizar.sh` ou o `aws` CLI não
estiverem disponíveis (notebook novo, ferramentas não instaladas, etc.) —
tudo aqui é feito só com um navegador logado no Console da AWS. Não precisa
de `aws configure`, não precisa da chave `.pem`, não precisa do alias
`timtim-prod` no `~/.ssh/config`.

Duas partes:
- **Parte A** — criar a infraestrutura do zero (só necessário se a
  instância atual não existir mais).
- **Parte B** — atualizar o código na instância que já está no ar (o que
  você vai usar quase sempre).

Se você só quer subir uma alteração de código e a instância atual
(`107.23.231.131`) ainda existe, **pule direto para a Parte B**.

---

## Parte B — Atualizar o código (instância já existe)

### B.1 Enviar suas alterações pro GitHub

No seu computador, depois de commitar as mudanças como sempre:

```bash
git add .
git commit -m "sua mensagem"
git push
```

Se você não tem o Git configurado nesse computador novo, instale o Git,
rode `git clone https://github.com/anagabriel147/timtimtim.git` e configure
suas credenciais do GitHub antes desse passo.

### B.2 Entrar na instância pelo navegador

1. Abra [console.aws.amazon.com](https://console.aws.amazon.com) e faça login.
2. Confirme que está na região **us-east-1** (canto superior direito da tela).
3. Menu de serviços → **EC2**.
4. **Instances** (menu lateral) → clique na instância chamada **`timtim-prod`**.
5. Botão **Connect** (canto superior direito da página da instância).
6. Aba **"EC2 Instance Connect"** → usuário `ubuntu` (já vem preenchido) → botão **Connect**.

Abre uma aba nova com um terminal já logado dentro da instância. Isso
funciona de qualquer rede/computador — não depende de nada estar
configurado localmente.

> Se essa aba não conectar: confirme que o Security Group da instância
> ainda libera a porta 22 (ver Parte A.3) — algum ajuste manual pode ter
> removido a regra sem querer.

### B.3 Atualizar o código e subir a versão nova

Já dentro do terminal do navegador:

```bash
cd /opt/timtim
git pull
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 down
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up --build -d
```

**Isso não apaga o banco de dados.** `docker compose down` (sem `-v`) só
remove os containers e a rede — os dados do Postgres ficam guardados num
volume separado (`timtim_pg_data`), que só seria apagado com `down -v`.
**Nunca use `-v` aqui.**

### B.4 Confirmar que funcionou

Ainda no mesmo terminal:

```bash
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 ps
curl -s http://localhost/
curl -s http://localhost/api/
```

O primeiro comando deve mostrar 4 containers (`db`, `api`, `web` como
`healthy`, `nginx` como `Up`). O `curl http://localhost/api/` deve
devolver `{"status":"ok","message":"TimTim API is running"}`.

Esses `curl` são feitos de dentro da própria instância (loopback), então
funcionam mesmo que sua rede pessoal tenha proxy/firewall corporativo. Pra
testar no navegador de verdade, abra `http://107.23.231.131/` — se sua
rede tiver Zscaler ou proxy corporativo e a página não abrir, teste pelo
celular (dados móveis) antes de assumir que algo quebrou.

---

## Parte A — Criar a infraestrutura do zero

Só siga esta parte se a instância `timtim-prod` foi terminada/perdida e
você precisa recriar tudo. **Isso cria um servidor novo com um IP novo** —
o antigo (`107.23.231.131`) deixa de existir.

### A.1 Par de chaves (opcional nesta abordagem manual)

Como toda a Parte B usa o EC2 Instance Connect pelo navegador, você **não
precisa** de uma chave `.pem` pra nada neste guia manual. Pode pular esta
etapa — ela só seria necessária pra SSH tradicional de linha de comando.

### A.2 Lançar a instância

1. Console da AWS → **EC2** → **Instances** → botão **Launch instance**.
2. **Name**: `timtim-prod`.
3. **Application and OS Images**: busque `Ubuntu` → escolha **Ubuntu Server 24.04 LTS**.
   - Se quiser a versão mais barata (ARM/Graviton): arquitetura `64-bit (Arm)`, tipo `t4g.nano`.
   - Se quiser mais folga de memória: arquitetura `64-bit (x86)`, tipo `t3.micro` (elegível ao Free Tier em conta nova).
4. **Instance type**: selecione o tipo escolhido acima.
5. **Key pair**: pode escolher **"Proceed without a key pair"** — não é
   necessário, já que vamos usar o EC2 Instance Connect pelo navegador.
6. **Network settings** → **Edit**:
   - Crie um novo Security Group chamado `timtim-sg`.
   - Adicione 3 regras (**Add security group rule**):
     - Type `SSH`, port 22, Source `My IP` (o console preenche seu IP atual sozinho).
     - Type `HTTP`, port 80, Source `Anywhere` (`0.0.0.0/0`).
     - Type `HTTPS`, port 443, Source `Anywhere` (`0.0.0.0/0`).
7. **Configure storage**: 20 GiB, tipo `gp3`.
8. **Advanced details** (expandir) → campo **User data** → cole o conteúdo
   inteiro do arquivo [`deploy.sh`](../deploy.sh) da raiz do projeto.
9. **Launch instance**.

Espere a instância ficar com status **Running** (1-2 minutos) e o *status
check* ficar **2/2 checks passed** (mais 1-2 minutos) antes de continuar —
o `deploy.sh` ainda está instalando Docker nesse meio tempo.

### A.3 Liberar o acesso do EC2 Instance Connect

O botão "Connect" pelo navegador (usado na Parte B) precisa que a porta 22
aceite conexões vindas da AWS, não só do seu IP. No Security Group
`timtim-sg` criado acima:

1. EC2 → **Security Groups** → `timtim-sg` → aba **Inbound rules** → **Edit inbound rules**.
2. **Add rule**: Type `SSH`, port 22, Source `Custom` → cole `18.206.107.24/29`
   (faixa de IP oficial do serviço EC2 Instance Connect na região `us-east-1` —
   confirme o valor atual em
   [ip-ranges.amazonaws.com](https://ip-ranges.amazonaws.com/ip-ranges.json),
   procurando por `"service": "EC2_INSTANCE_CONNECT"` e `"region": "us-east-1"`).
3. **Save rules**.

### A.4 Elastic IP (pra ter um endereço fixo)

1. EC2 → **Elastic IPs** (menu lateral) → **Allocate Elastic IP address** → **Allocate**.
2. Selecione o IP recém-criado → **Actions** → **Associate Elastic IP address**.
3. **Instance**: selecione `timtim-prod` → **Associate**.
4. Anote o novo IP público — ele substitui `107.23.231.131` em todo lugar
   deste projeto (`CORS_ORIGINS`, `NEXT_PUBLIC_API_URL`, este documento, o
   `UPGRADE.md`, o `atualizar.sh`).

### A.5 Conectar e criar os segredos de produção

Siga a **Parte B.2** acima (Connect → EC2 Instance Connect) pra entrar na
instância nova. Depois:

```bash
cd /opt/timtim
cp .env.ec2.example .env.ec2
nano .env.ec2
```

Preencha com valores **novos** (não reaproveite senhas antigas):

```
POSTGRES_USER=timtim_admin
POSTGRES_PASSWORD=<gere uma nova — ver comando abaixo>
POSTGRES_DB=timtim
SECRET_KEY=<gere uma nova — ver comando abaixo>
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://<SEU_NOVO_ELASTIC_IP>
NEXT_PUBLIC_API_URL=http://<SEU_NOVO_ELASTIC_IP>/api
API_WEB_CONCURRENCY=2
```

Pra gerar senha/chave fortes, rode isto no seu próprio computador (não
precisa ser na instância) e copie os valores:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(24))"   # POSTGRES_PASSWORD
python3 -c "import secrets; print(secrets.token_urlsafe(48))"   # SECRET_KEY
```

Salve o arquivo (`nano`: Ctrl+O, Enter, Ctrl+X) e suba os containers:

```bash
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build
```

Depois disso, este é um banco **novo e vazio** — sem usuários. Ver a seção
0 do [`docs/DEPLOY.md`](DEPLOY.md) sobre o seed de demonstração (só use em
ambiente de teste, nunca com usuários reais).

---

## Referência rápida

| O quê | Onde encontrar |
|---|---|
| Instância | Console AWS → EC2 → Instances → `timtim-prod` |
| IP público atual | Coluna "Public IPv4 address" na lista de instâncias |
| Security Group | `timtim-sg`, visível na página da instância |
| Segredos de produção | Só existem em `/opt/timtim/.env.ec2`, dentro da própria instância |
| Deploy automatizado (se tiver AWS CLI configurado) | [`UPGRADE.md`](../UPGRADE.md) |
| Runbook técnico completo (custos, HTTPS, GCP/ECS) | [`DEPLOY.md`](DEPLOY.md) |
