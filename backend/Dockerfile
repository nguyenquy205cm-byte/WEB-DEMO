# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for TypeScript compiler)
RUN npm ci

# Copy source code and Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (needed for migrations at runtime if desired)
COPY prisma ./prisma

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
