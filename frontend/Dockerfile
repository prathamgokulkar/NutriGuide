# ============================================================
# Stage 1 — deps
# Install node_modules cleanly with npm ci (reproducible).
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps


# ============================================================
# Stage 2 — builder
# Build the Next.js production bundle.
# output: 'standalone' in next.config.mjs produces a minimal
# self-contained server in .next/standalone — no node_modules needed.
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy deps from Stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time env vars needed by Next.js
# NEXT_PUBLIC_* vars are inlined at build time, so they must be present here.
# The value below is for browser (client-side) fetches — points to the host port.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# ============================================================
# Stage 3 — runner (final image)
# Copies only the standalone output — no node_modules, no source.
# This is the smallest possible Next.js image.
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server output
COPY --from=builder /app/.next/standalone ./
# Copy static assets (images, fonts, etc.)
COPY --from=builder /app/.next/static ./.next/static
# Copy public folder (favicon, robots.txt, etc.)
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
