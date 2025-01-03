ARG BUILDER_IMAGE=node:22-slim
ARG RUNNER_IMAGE=gcr.io/distroless/nodejs22-debian12
ARG TURBO_VERSION=2.3.1

###
# Base image for following stages
###
FROM ${BUILDER_IMAGE} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable
RUN pnpm install -g turbo@$TURBO_VERSION


###
# Prepare a subset of the repository containing only the application and its dependencies
###
FROM base AS pruner

ARG APPLICATION_NAME

COPY . .

RUN pnpm turbo prune --docker --scope=$APPLICATION_NAME


###
# Install dependencies and build application
###
FROM base AS builder

ARG NPM_REGISTRY_TOKEN

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_REGISTRY_TOKEN" >> .npmrc

# Copy lockfile and package.json's of isolated workspaces
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# First install dependencies (as they change less often)
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm install --ignore-scripts

# Copy source code of isolated workspaces
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build:swc
RUN pnpm prune --prod --no-optional --config.ignore-scripts=true
RUN rm -rf ./**/*/src
RUN rm -rf ./**/*/node_modules
RUN pnpm install --prod --no-optional --ignore-scripts --frozen-lockfile


###
# Application packager
###
FROM ${RUNNER_IMAGE} AS runner

WORKDIR /app

# Define some environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV APP_SERVER_HOST=0.0.0.0
ENV APP_SERVER_PORT=4000

USER node

COPY --from=builder --chown=node:node /app /app
