# ════════════════════════════════════════════════════════════════
#  Hormonitas — multi-stage build (Next.js standalone + Prisma)
# ════════════════════════════════════════════════════════════════

# ──── Stage 1: deps + build ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# OpenSSL es requerido por Prisma engines en Alpine
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .

# Genera el Prisma client antes del build (los tipos son requeridos)
RUN npx prisma generate

# Build Next.js con output: 'standalone'
RUN npm run build

# ──── Stage 2: runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# OpenSSL también necesario en runtime para Prisma
RUN apk add --no-cache openssl libc6-compat

# Crear usuario no-root para mejor seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone: incluye solo lo que Next necesita (sin extra deps)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma: schema + CLI + engines + client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs

EXPOSE 3000

# Al arrancar:
#   1. prisma db push → sincroniza el schema (crea tablas si no existen)
#   2. node server.js → arranca Next.js en standalone mode
# Usamos el entry JS directo en vez de node_modules/.bin/prisma porque los
# symlinks de bin se pierden al copiar entre stages.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --skip-generate && node server.js"]
