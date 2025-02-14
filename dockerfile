ARG BUILDER_IMAGE=node:22-slim
ARG RUNNER_IMAGE=gcr.io/distroless/nodejs22-debian12
ARG TURBO_VERSION=2.3.1



###
# Base image (except for runner)
###
FROM ${BUILDER_IMAGE} AS base

RUN corepack enable
RUN npm install -g turbo@$TURBO_VERSION
RUN pnpm config set store-dir ~/.pnpm-store



###
# Prepare a subset of the repository containing only the application and its dependencies
###
FROM base AS pruner

ARG APPLICATION_NAME

WORKDIR /app
COPY . .
RUN pnpm turbo prune --docker --scope=$APPLICATION_NAME



###
# Build applications
###
FROM base AS builder

ARG APPLICATION_NAME
ARG NPM_REGISTRY_TOKEN

WORKDIR /app
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_REGISTRY_TOKEN" >> .npmrc

# Install dependencies
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY --from=pruner /app/out/full/ /app

# Build application
RUN  pnpm turbo run build:swc

# Generate application subset with production dependencies
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store  pnpm deploy --prod --ignore-scripts --filter=$APPLICATION_NAME /deploy




###
# Application runner
###
FROM ${RUNNER_IMAGE} AS runner

ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=4000

WORKDIR /app

COPY --from=builder /deploy .