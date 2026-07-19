# UPGRADE.md — Como atualizar o TimTim em produção

Guia rápido pra quando você mexer no código e quiser subir a versão nova
pro servidor (EC2, `http://107.23.231.131/`).

> Sem AWS CLI configurado ou num computador novo? Use
> [`docs/DEPLOY-MANUAL.md`](docs/DEPLOY-MANUAL.md) — o mesmo processo,
> 100% pelo navegador, sem depender de nada instalado localmente.

## Resumo em 1 linha

Depois de commitar suas mudanças localmente (`git add` + `git commit`,
como sempre):

```bash
./atualizar.sh
```

Pronto — o resto deste guia explica o que esse comando faz por baixo dos
panos (seção 2), e como fazer cada passo manualmente se precisar (seção 1).

---

## 1. A rotina do código (passo a passo manual)

### 1.1 Enviar suas alterações pro GitHub

Depois de commitar suas mudanças como sempre:

```bash
git push
```

### 1.2 Entrar na instância EC2

Sua rede de trabalho bloqueia SSH direto (descobrimos isso durante o
deploy) — por isso configuramos um alias que passa por um túnel que não é
bloqueado. Já está pronto no seu `~/.ssh/config`:

```bash
ssh timtim-prod
```

Isso te deixa dentro da máquina, como usuário `ubuntu`, e o projeto vive em
`/opt/timtim`.

> **Alternativa**, se o `ssh timtim-prod` não funcionar por algum motivo:
> Console da AWS → EC2 → Instances → `timtim-prod` → botão **Connect** →
> aba **"EC2 Instance Connect"** → **Connect**. Abre um terminal direto no
> navegador, sem precisar de nada configurado localmente.

### 1.3 Atualizar o código e subir a versão nova

Já dentro da instância (depois do `ssh timtim-prod` acima):

```bash
cd /opt/timtim
git pull
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 down
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 up --build -d
```

**O banco de dados não é apagado nesse processo.** `docker compose down`
(sem nenhuma flag extra) só remove os containers e a rede — os dados do
Postgres ficam guardados num volume separado, que só seria apagado se
alguém rodasse `down -v` (com o `-v`). **Nunca use `-v` nesse fluxo.**

Confirme que os 4 containers voltaram saudáveis:

```bash
docker compose -f docker-compose.ec2.yml --env-file .env.ec2 ps
```

Devem aparecer `db`, `api`, `web` (healthy) e `nginx` (up) — igual no
primeiro deploy.

---

## 2. O comando mágico — `atualizar.sh`

Pra não repetir os passos da seção 1 toda vez, o `atualizar.sh` (na raiz
do projeto) faz tudo isso num comando só, direto do seu Mac:

```bash
./atualizar.sh
```

O que ele faz, na ordem:

1. **Confere se você tem mudanças não commitadas** — avisa e pergunta antes
   de continuar, nunca some com nada silenciosamente.
2. **`git push`** — envia seu código commitado pro GitHub.
3. **Entra na instância** (pelo mesmo túnel do `ssh timtim-prod`, então
   funciona mesmo na rede do trabalho), roda `git pull` + `docker compose
   down` + `docker compose up --build -d`, e te mostra o status final dos
   4 containers e um teste rápido da API.

Se algo der errado no meio do caminho, o script para na hora (não continua
"fingindo" que deu certo) e mostra o erro.

---

## Onde as coisas vivem (referência rápida)

| O quê | Onde |
|---|---|
| App no ar | http://107.23.231.131/ |
| Chave SSH | `~/.ssh/timtim-key.pem` |
| Alias de SSH | `timtim-prod` (configurado em `~/.ssh/config`) |
| Código no servidor | `/opt/timtim` (dentro da instância) |
| Segredos de produção (senha do banco, etc.) | `/opt/timtim/.env.ec2` — só existe no servidor, nunca é commitado |
| Docs completos de infra (AWS, custos, HTTPS) | [`docs/DEPLOY.md`](docs/DEPLOY.md) |

## Se algo der errado

- **`ssh timtim-prod` trava ou dá timeout**: use a alternativa do navegador
  (seção 1.2) e me chame — pode ser algo mudou na rede ou no endpoint.
- **Um dos 4 containers não fica "healthy"** depois do `up --build -d`:
  rode `docker compose -f docker-compose.ec2.yml --env-file .env.ec2 logs <nome-do-serviço>`
  (ex.: `logs api`) pra ver o erro real.
- **Não lembra a senha do banco/`SECRET_KEY`**: estão só em
  `/opt/timtim/.env.ec2`, no próprio servidor — não existem em nenhum
  outro lugar (de propósito, por segurança).
