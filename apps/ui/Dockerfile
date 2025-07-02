# This is PRODUCTION Dockerfile for NextJS in Turborepo.
# It's assumed that this Dockerfile is run from the root of the monorepo.

# Created according to following examples:
# - https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/web/Dockerfile
# - https://dev.to/moofoo/creating-a-development-dockerfile-and-docker-composeyml-for-yarn-122-monorepo-using-turborepo-896

# Customize APP (name of folder in /apps) and WORKSPACE (name from package.json) to match this app
ARG APP=ui
ARG WORKSPACE=@repo/ui

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

# No need to install turbo globally - will use npx

# Copy files needed for pruning (including source code)
COPY package.json yarn.lock turbo.json ./
COPY packages packages
COPY apps/ui apps/ui
COPY apps/strapi/package.json apps/strapi/

# see https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget
RUN npx turbo prune ${WORKSPACE} --docker

# -------------------------- stage installer ---------------------------------
FROM base AS installer
ARG APP
ARG WORKSPACE

# Set Node.js memory limits and optimization flags for build process
ENV NODE_OPTIONS="--max-old-space-size=2048 "
ENV GENERATE_SOURCEMAP=false

WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/yarn.lock ./yarn.lock

# No need to install turbo globally - will use npx

# Install dependencies with resource constraints optimization
# First install all dependencies at root level
RUN \
    --mount=type=cache,id=yarn-cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked \
    yarn config set network-concurrency 1 && \
    export JOBS=1 && \
    export npm_config_jobs=1 && \
    yarn install --prefer-offline --network-timeout 300000 && \
    echo "🔍 Verifying @t3-oss/env-nextjs installation..." && \
    find . -name "*t3-oss*" -type d && \
    node -e "console.log('✅ Package resolved:', require.resolve('@t3-oss/env-nextjs'))" || echo "❌ Package not found"

# Copy source files AFTER dependency installation to avoid conflicts
COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json

# PATH not needed with npx - it handles CLI access automatically

# Set build environment with memory optimizations
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP=0
ENV NEXT_OUTPUT=standalone
ENV NEXT_IMAGES_UNOPTIMIZED=false

# Add required environment variables for @t3-oss/env-nextjs validation
ENV NEXT_PUBLIC_APP_PUBLIC_URL=http://localhost:3000
ENV NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Build with turbo cache and memory constraints
RUN \
    --mount=type=cache,id=turbo-cache,target=/app/.turbo,sharing=locked \
    echo "🚀 Starting UI build..." && \
    NODE_OPTIONS="--max-old-space-size=2048 " \
    npx turbo run build --filter=${WORKSPACE} --only --concurrency=1 --verbosity=2 && \
    echo "✅ Build completed successfully!" || (echo "❌ Build failed!" && exit 1)

# -------------------------- stage runner ---------------------------------
FROM base AS runner
ARG APP
ARG WORKSPACE
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install only runtime dependencies
RUN apk add --no-cache vips-dev dumb-init curl

# Don't run production as root
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy only necessary files for runtime
COPY --from=installer --chown=nextjs:nextjs /app/apps/${APP}/next.config.mjs .
COPY --from=installer --chown=nextjs:nextjs /app/apps/${APP}/package.json .

# Automatically leverage output traces to reduce image size - https://nextjs.org/docs/14/pages/api-reference/next-config-js/output
# next.config.mjs's `output` options has to be set to "standalone" to make this work (see README)
COPY --from=installer --chown=nextjs:nextjs /app/apps/${APP}/.next/standalone ./
COPY --from=installer --chown=nextjs:nextjs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=installer --chown=nextjs:nextjs /app/apps/${APP}/public ./apps/${APP}/public

USER nextjs

WORKDIR /app/apps/${APP}
EXPOSE ${PORT:-3000}

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
