# Multi-stage Dockerfile for Next.js 15 (Node 20 Alpine)

# 1) Builder
FROM node:20-alpine AS builder

# System deps sometimes needed by sharp
RUN apk add --no-cache libc6-compat

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy lockfiles first for better caching
COPY package.json pnpm-lock.yaml ./

# Install deps (prod+dev to build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# 2) Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install only prod deps for runtime
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile

# Copy built app and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start Next.js; Railway will inject PORT
CMD ["pnpm", "start", "--", "-p", "${PORT:-3000}"]
