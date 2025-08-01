# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v5 & Next.js v15 monorepo starter template that functions as a page builder for enterprise applications. It uses Turborepo for monorepo management and combines a headless CMS (Strapi) with a modern Next.js frontend.

## Development Commands

### Root level (monorepo commands)

- `yarn dev` - Run all apps in development mode
- `yarn build` - Build all apps
- `yarn lint` - Run linting across all apps
- `yarn format` - Format code using Prettier across the monorepo
- `yarn format:check` - Check formatting without modifying files
- `yarn commit` - Interactive commit message generator (conventional commits)

### App-specific commands

- `yarn dev:strapi` - Run only Strapi in development mode
- `yarn dev:ui` - Run only UI app in development mode
- `yarn build:strapi` - Build only Strapi app
- `yarn build:ui` - Build only UI app
- `yarn start:strapi` - Start Strapi in production mode
- `yarn start:ui` - Start UI app in production mode

### Strapi-specific commands (in apps/strapi)

- `yarn develop` - Start Strapi in development mode
- `yarn develop:watch` - Start Strapi with admin panel watch mode
- `yarn generate:types` - Generate TypeScript types from Strapi schema
- `yarn test` - Run Jest tests
- `yarn run:db` - Start PostgreSQL database via Docker Compose
- `yarn export:all` - Export all Strapi data
- `yarn import` - Import Strapi data from export

### UI-specific commands (in apps/ui)

- `yarn typecheck` - Run TypeScript type checking
- `yarn preview` - Build and start in production mode locally

## Architecture

### Monorepo Structure

- `apps/strapi/` - Strapi v5 headless CMS with custom plugins and page builder components
- `apps/ui/` - Next.js v15 frontend with App Router, internationalization, and authentication
- `packages/` - Shared packages for config, design system, and utilities

### Key Frontend Architecture

- **Page Builder System**: Dynamic component rendering based on Strapi content types
- **Component Mapping**: `PageContentComponents` in `apps/ui/src/components/page-builder/index.tsx` maps Strapi UIDs to React components
- **API Clients**: Separate public and private Strapi clients in `apps/ui/src/lib/strapi-api/`
- **Internationalization**: Uses `next-intl` with locale-based routing
- **Authentication**: NextAuth.js with JWT tokens from Strapi Users & Permissions

### Key Backend Architecture

- **Content Types**: Page builder components defined in `apps/strapi/src/components/`
- **Custom APIs**: Extended controllers and services in `apps/strapi/src/api/`
- **Lifecycle Hooks**: User and admin user subscribers in `apps/strapi/src/lifeCycles/`
- **Middleware**: Document middleware for populating page content

### Page Builder Components

Components are organized by type:

- **Sections**: Large content blocks (hero, carousel, FAQ, etc.)
- **Forms**: Contact and newsletter forms with validation
- **Utilities**: Reusable components like CkEditor content, images, links
- **Elements**: Footer items and other small components

## Environment Setup

1. Run `yarn setup:apps` to copy environment files
2. Manual setup required for Strapi API tokens (see apps/ui/README.md)
3. Database runs via Docker Compose (PostgreSQL)

## Development Workflow

1. Start database: `yarn run:db` (in apps/strapi)
2. Run development: `yarn dev` (from root)
3. Strapi admin: http://localhost:1337/admin
4. Next.js app: http://localhost:3000

## Production Deployment

Streamlined single-script deployment system for Digital Ocean droplets with automated SSL management.

### Quick Start

1. **Prepare**: Fresh Ubuntu droplet + DNS pointing to server IP
2. **Deploy**: `sudo ./deploy-production.sh`
3. **Configure**: Update `.env.production` with your secrets
4. **Setup Strapi**: Create admin account, import config, generate API tokens
5. **Done**: Script handles server setup, Docker, SSL certificates, and HTTPS

### Deployment Scripts

- **`deploy-production.sh`** - Complete deployment with external database support
  - Server setup (Docker, firewall, directories)
  - Project deployment with external database configuration
  - SSL certificate generation and HTTPS setup
  - Certificate auto-renewal configuration
- **`post-deployment-helper.sh`** - Interactive helper for post-deployment tasks
  - Database seed import, API token setup, service management
- **`update.sh`** - Quick updates for existing deployments
- **`deploy-local.sh`** - Test production builds locally with flexible options
- **`backup-db.sh`** - Database backup utility

### Production Features

- **Automated SSL**: Let's Encrypt certificates with auto-renewal every 12 hours
- **HTTPS Enforcement**: Automatic HTTP to HTTPS redirects
- **Security**: UFW firewall configuration (SSH, HTTP, HTTPS only)
- **Health Monitoring**: Docker container health checks
- **Zero Downtime Updates**: Use `update.sh` for application updates

### Directory Structure

- **Application**: `/opt/apps/cabernai-web-v2/`
- **Backups**: `/opt/backups/cabernai-web-v2/`
- **SSL Certificates**: Docker volumes managed by Let's Encrypt
- **Logs**: `/var/log/ssl-renewal.log` + Docker container logs

## Testing

- Strapi tests: `yarn test` (in apps/strapi directory)
- Uses Jest with Node.js environment
- No specific test framework configured for UI app

## Code Quality

- ESLint and Prettier configured via shared packages
- Husky pre-commit hooks for linting and formatting
- Commitizen for conventional commits
- TypeScript strict mode enabled

## Technical Stack

- **Node.js**: 22.x.x (see .nvmrc)
- **Package Manager**: Yarn 1.22.x
- **Database**: PostgreSQL (external managed database for production)
- **Build System**: Turborepo v2.x with build caching
- **Production**: Docker containers with multi-stage builds
- **SSL**: Let's Encrypt with automated renewal
- **Reverse Proxy**: Nginx with HTTPS termination

## Important Notes

- Strapi types are auto-generated - run `yarn generate:types` after schema changes
- All production services run in Docker containers
- SSL certificates automatically renew every 12 hours
- Environment variables must be configured in `.env.production` for production deployment

## Production Commands

### Deployment

```bash
# Complete deployment (first-time or full rebuild)
sudo ./deploy-production.sh

# Quick updates (existing deployments)
sudo ./update.sh
```

### Service Management

```bash
# Navigate to project directory
cd /opt/apps/cabernai-web-v2

# View logs
docker-compose -f docker-compose.production.yml logs [service_name]

# Restart services
docker-compose -f docker-compose.production.yml restart [service_name]

# Stop all services
docker-compose -f docker-compose.production.yml down

# View container status
docker-compose -f docker-compose.production.yml ps
```

### SSL Certificate Management

```bash
# Manual certificate renewal
/root/renew-ssl-certificates.sh

# Check renewal logs
tail -f /var/log/ssl-renewal.log

# View certificate info
docker run --rm -v /var/lib/docker/volumes/cabernai-web-v2_nginx_certs/_data:/etc/letsencrypt \
  certbot/certbot:latest certificates
```

### Troubleshooting

```bash
# Check nginx configuration
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# Restart nginx only
docker-compose -f docker-compose.production.yml restart nginx

# View specific service logs
docker-compose -f docker-compose.production.yml logs nginx --tail 50
```
