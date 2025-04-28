FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build-deps AS build

ARG DIRECTUS_URL="https://directus.thewasteatlas.com"
ENV DIRECTUS_URL=$DIRECTUS_URL

COPY . .
RUN --mount=type=secret,id=directus-token \
    export DIRECTUS_TOKEN=$(cat /run/secrets/directus-token) && \
    pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

ENTRYPOINT ["node"]
CMD ["./dist/server/entry.mjs"]
