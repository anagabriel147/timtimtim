# TimTim API — imagem de produção
#
# Build (contexto = apps/api):
#   docker build -t timtim-api -f apps/api/Dockerfile apps/api
#
# Todas as configurações sensíveis (DATABASE_URL, SECRET_KEY, CORS_ORIGINS,
# ACCESS_TOKEN_EXPIRE_MINUTES) são lidas de variáveis de ambiente em runtime
# (ver apps/api/app/core/config.py e app/db.py) — nada de segredo é copiado
# para dentro da imagem.

# ---- builder: resolve as dependências Python isoladamente ----
FROM python:3.12-slim AS builder
WORKDIR /install
ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
COPY requirements.txt .
RUN pip install --prefix=/install/deps -r requirements.txt

# ---- runtime: imagem final, sem toolchain de build ----
FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

COPY --from=builder /install/deps /usr/local
COPY app ./app

RUN useradd --create-home --uid 1000 appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request as u; u.urlopen('http://127.0.0.1:8000/', timeout=3)" || exit 1

# PORT/WEB_CONCURRENCY são injetados pela plataforma de deploy (ECS, Cloud
# Run, etc.) quando aplicável; os valores abaixo são o fallback local.
CMD ["sh", "-c", "gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-4} --timeout 60 --access-logfile - --error-logfile -"]
