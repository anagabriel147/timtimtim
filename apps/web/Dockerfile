# TimTim Web — imagem de produção (Next.js standalone)
#
# É um pacote pnpm-workspace, então o BUILD CONTEXT tem que ser a RAIZ do
# monorepo (não apps/web) — precisa enxergar pnpm-lock.yaml/pnpm-workspace.yaml:
#
#   docker build -t timtim-web -f apps/web/Dockerfile \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.timtim.com.br .
#
# IMPORTANTE: NEXT_PUBLIC_API_URL é inlined no bundle do browser em build time
# (é assim que o Next.js trata NEXT_PUBLIC_*) — não dá pra trocar via variável
# de ambiente em runtime do container. Se a URL da API mudar, a imagem do web
# precisa ser rebuildada com o novo --build-arg.

FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile --filter web...

FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter web build

# ---- runtime: só o output "standalone" traçado pelo Next, sem node_modules inteiro ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "apps/web/server.js"]
