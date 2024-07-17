FROM node:21.7.3-alpine3.20 AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /temp-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --loglevel info


FROM base AS builder
WORKDIR /build
COPY . ./
COPY --from=deps /temp-deps/node_modules ./node_modules
RUN pnpm run build && pnpm install --prod --frozen-lockfile --loglevel info



FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /build/docker.env ./.env
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./
COPY --from=builder /build/public ./public


EXPOSE 4000

COPY src/script/runner.sh ./
RUN chmod +x ./runner.sh

ENTRYPOINT ["./runner.sh"]
CMD ["node", "--trace-sigint", "--trace-uncaught", "dist/server.js"]





