# This is PRODUCTION Dockerfile for Strapi in Turborepo.
# It's assumed that this Dockerfile is run from the root of the monorepo.

# Created according to following examples:
# - https://docs.strapi.io/dev-docs/installation/docker#production-dockerfile
# - https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# - https://dev.to/moofoo/creating-a-development-dockerfile-and-docker-composeyml-for-yarn-122-monorepos-using-turborepo-896

# Customize APP (name of folder in /apps) and WORKSPACE (name from package.json) to match this app
ARG APP=strapi
ARG WORKSPACE=@repo/strapi

FROM node:20-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# -------------------------- stage pruned ---------------------------------
FROM base AS pruned
ARG WORKSPACE

# Set working directory
WORKDIR /app

# Install turbo globally with specific version for consistency
RUN yarn global add turbo@^2.0.9

# Copy only necessary files for pruning
COPY package.json yarn.lock turbo.json ./
COPY packages packages
COPY apps/ui/package.json apps/ui/
COPY apps/strapi/package.json apps/strapi/

# see https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget
RUN turbo prune ${WORKSPACE} --docker

# -------------------------- stage installer ---------------------------------
FROM base AS installer
ARG APP
ARG WORKSPACE
ENV NODE_ENV=production

WORKDIR /app

# Install system dependencies for Strapi in a single layer
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# First install dependencies (as they change less often)
COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/yarn.lock ./yarn.lock

# Install global dependencies
RUN yarn global add node-gyp turbo@^2.0.9

# Install dependencies with resource constraints optimization
RUN \
    --mount=type=cache,id=yarn-cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked \
    --mount=type=cache,id=node-modules,target=/app/node_modules,sharing=locked \
    yarn config set network-concurrency 1 && \
    export JOBS=1 && \
    export npm_config_jobs=1 && \
    yarn install --prefer-offline --frozen-lockfile --ignore-scripts --production --network-timeout 300000

# Install Sharp for Strapi image processing with single thread
RUN \
    --mount=type=cache,id=yarn-cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked \
    yarn config set network-concurrency 1 && \
    export JOBS=1 && \
    export npm_config_jobs=1 && \
    yarn workspace ${WORKSPACE} add sharp --ignore-engines --prefer-offline --frozen-lockfile --network-timeout 300000

ENV PATH /app/apps/${APP}/node_modules/.bin:$PATH

# Build the project and its dependencies
COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1

# Build with turbo cache
RUN \
    --mount=type=cache,id=turbo-cache,target=/app/.turbo,sharing=locked \
    turbo run build --filter=${WORKSPACE}

# -------------------------- stage runner ---------------------------------
FROM base AS runner
ARG APP
ARG WORKSPACE
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install only runtime dependencies
RUN apk add --no-cache vips-dev dumb-init curl

# Don't run production as root
RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi

WORKDIR /app

# Copy application files with proper ownership
COPY --from=installer --chown=strapi:strapi /app .

USER strapi

ENV PATH /app/apps/${APP}/node_modules/.bin:$PATH

WORKDIR /app/apps/${APP}
EXPOSE ${PORT:-1337}

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start"]
