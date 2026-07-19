#!/bin/bash
# TimTim — bootstrap da instância EC2 (arquitetura de instância única).
#
# Uso pretendido: passar este arquivo como --user-data na criação da
# instância (roda como root, uma vez, no primeiro boot via cloud-init).
# Também é seguro rodar de novo manualmente via SSH depois de um `git pull`
# — atualiza o código e resobe os containers se .env.ec2 já existir.
#
# O QUE ESTE SCRIPT FAZ:
#   1. Atualiza o sistema (apt update/upgrade)
#   2. Instala Docker Engine + plugin do Compose (repositório oficial Docker)
#   3. Cria 1GB de swap (instâncias t4g.nano/t3.micro têm pouca RAM — sem
#      swap, qualquer pico de carga arrisca OOM-kill do Postgres/Node)
#   4. Clona ou atualiza o repositório (público — não precisa de credencial)
#
# O QUE ESTE SCRIPT DELIBERADAMENTE NÃO FAZ:
#   Não sobe os containers na primeira vez, porque isso exigiria colocar
#   segredos de produção (senha do banco, SECRET_KEY) dentro do user-data —
#   e user-data NÃO é secreto: fica visível via
#   `aws ec2 describe-instance-attribute --attribute userData` para qualquer
#   principal com permissão de leitura no EC2, e também em
#   /var/log/cloud-init-output.log dentro da própria instância. Por isso o
#   .env.ec2 é criado manualmente via SSH, uma vez, na seção final deste
#   script (ver instruções impressas no final).

set -euxo pipefail

REPO_URL="https://github.com/anagabriel147/timtimtim.git"
BRANCH="main"
APP_DIR="/opt/timtim"

exec > >(tee -a /var/log/timtim-deploy.log) 2>&1
echo "== TimTim deploy.sh iniciado em $(date -u '+%Y-%m-%d %H:%M:%S UTC') =="

# 1. Atualiza o sistema
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y

# 2. Instala Docker Engine + Compose plugin (repositório oficial Docker)
apt-get install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
usermod -aG docker ubuntu || true

# 3. Swap de 1GB — mitigação barata de OOM em instâncias com pouca RAM
if [ ! -f /swapfile ]; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 4. Clona ou atualiza o repositório (público, sem credenciais)
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch origin
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
chown -R ubuntu:ubuntu "$APP_DIR"

cd "$APP_DIR"

# 5. Se .env.ec2 já existe (re-execução manual pós git-pull), resobe os
#    containers com a imagem/código novos. Na primeira execução (via
#    user-data) isso ainda não existe — ver instruções abaixo.
if [ -f "$APP_DIR/.env.ec2" ]; then
  sudo -u ubuntu docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build
  echo "== containers atualizados =="
else
  cat <<'EOF'

== deploy.sh terminou a parte automática ==

Falta 1 passo manual, DE PROPÓSITO — ver comentário no topo deste arquivo
sobre por que segredos não entram em user-data. Faça via SSH, uma vez só:

  ssh ubuntu@<SEU_ELASTIC_IP>
  cd /opt/timtim
  cp .env.ec2.example .env.ec2
  nano .env.ec2   # preencha com valores reais — ver docs/DEPLOY.md secao 5
  docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build

Para popular com dado de exemplo (NUNCA em produção com usuários reais):
  docker compose -f docker-compose.ec2.yml --env-file .env.ec2 run --rm api python -m app.seed

Para atualizar depois de um novo push (pode rodar este mesmo deploy.sh de
novo via SSH, ou só):
  cd /opt/timtim && git pull && docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up -d --build

EOF
fi

echo "== TimTim deploy.sh terminou em $(date -u '+%Y-%m-%d %H:%M:%S UTC') =="
