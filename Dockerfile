FROM oven/bun:alpine AS base
WORKDIR /app

COPY package.json bun.lock ./

FROM base AS prod-deps
RUN bun install --production --frozen-lockfile

FROM base AS build-deps
RUN bun install --frozen-lockfile

FROM build-deps AS build
ARG DIRECTUS_URL="https://directus.thewasteatlas.com"
ENV DIRECTUS_URL=$DIRECTUS_URL
COPY . .
RUN --mount=type=secret,id=directus-token \
    export DIRECTUS_TOKEN=$(cat /run/secrets/directus-token) && \
    bun run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0 PORT=4321

EXPOSE 4321

ENTRYPOINT ["bun"]
CMD ["./dist/server/entry.mjs"]
