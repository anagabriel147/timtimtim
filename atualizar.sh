#!/bin/bash
# atualizar.sh — envia suas alterações locais pro GitHub e atualiza o TimTim
# rodando na instância EC2 de produção, sem apagar os dados do Postgres.
#
# "docker compose down" (sem "-v") só remove containers e rede — o volume
# nomeado do Postgres continua intacto. Nunca rode "down -v" nesse fluxo.
#
# Uso: ./atualizar.sh

set -euo pipefail
cd "$(dirname "$0")"

echo "==> 1/3 — verificando o repositório local"
if [ -n "$(git status --porcelain)" ]; then
  echo "AVISO: há mudanças não commitadas — elas NÃO serão enviadas:"
  git status --short
  read -r -p "Continuar mesmo assim, enviando só o que já foi commitado? (s/N) " ans
  [[ "$ans" =~ ^[sS]$ ]] || { echo "Cancelado."; exit 1; }
fi

echo "==> 2/3 — enviando pro GitHub"
git push

echo "==> 3/3 — atualizando o servidor (leva alguns minutos pra rebuildar as imagens)"
ssh timtim-prod bash -s <<'REMOTE'
set -euo pipefail
cd /opt/timtim
git pull
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 down
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up --build -d
echo "--- containers ---"
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 ps
echo "--- teste local (loopback — não passa pela sua rede/proxy) ---"
curl -s http://localhost/api/ && echo
REMOTE

echo
echo "==> Pronto! http://107.23.231.131/"
echo "    (se sua rede tiver Zscaler/proxy corporativo, teste pelo celular)"
