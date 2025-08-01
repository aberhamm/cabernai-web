# Production Deployment Guide

Quick reference for deploying this application to production.

## Prerequisites

- Fresh Ubuntu 20.04+ Digital Ocean droplet
- Domain names pointing to server IP
- SSH access to the server

## Quick Deployment

```bash
# 1. Upload deployment script to server
scp deploy-production.sh root@your-server-ip:/root/

# 2. SSH into server
ssh root@your-server-ip

# 3. Run deployment
chmod +x deploy-production.sh
sudo ./deploy-production.sh
```

## What the Script Does

1. **Server Setup** (first-time only)

   - Installs Docker, Docker Compose, and required packages
   - Configures UFW firewall (SSH, HTTP, HTTPS)
   - Creates project directories

2. **Project Deployment**

   - Clones/updates project from Git
   - Creates `.env.production` template (you'll need to fill in secrets)
   - Tests domain accessibility

3. **Application Startup**

   - Builds and starts Docker containers
   - Verifies services are healthy

4. **SSL Configuration**

   - Generates Let's Encrypt certificates
   - Configures HTTPS with automatic HTTP redirects
   - Sets up certificate auto-renewal (every 12 hours)

5. **Final Testing**
   - Verifies HTTPS connectivity
   - Displays success summary

## Post-Deployment Setup

After deployment, you need to complete these setup steps:

### 1. Configure Environment Variables

Edit `/opt/apps/cabernai-web-v2/.env.production` with your actual values

### 2. Set Up Strapi Admin

1. Visit `https://api.cabernai.io/admin`
2. Create your admin account
3. Import initial configuration:
   - Go to **Settings > Config Sync > Tools**
   - Click **"Import"** to import configuration from files

### 3. Seed Database (Optional)

Import initial data if available:

```bash
cd /opt/apps/cabernai-web-v2

# Fix permissions first
docker-compose -f docker-compose.production.yml exec --user root strapi-app chown -R strapi:strapi /app/apps/strapi/dist
docker-compose -f docker-compose.production.yml exec --user root strapi-app chown -R strapi:strapi /app/apps/strapi/public
docker-compose -f docker-compose.production.yml exec --user root strapi-app mkdir -p /app/apps/strapi/public/uploads

# Import seed data (use --force to handle schema differences)
docker-compose -f docker-compose.production.yml exec strapi-app yarn strapi import -f strapi-export.tar.gz --force
```

**Notes**:

- The seed file should be located at `apps/strapi/strapi-export.tar.gz` in the project directory
- You may see TypeScript compilation warnings - these are usually safe to ignore
- If there are schema differences, the import will show warnings but may still succeed

### 4. Create API Tokens

1. In Strapi admin, go to **Settings > API Tokens**
2. Create **Read-only API Token**:

   - Name: `Frontend Read-only`
   - Token duration: `Unlimited`
   - Token type: `Read-only`
   - **Save the token** (shown only once)

3. Create **Custom API Token** (if needed):
   - Name: `Frontend Custom`
   - Token duration: `Unlimited`
   - Token type: `Custom`
   - Permissions: Select specific operations needed

### 5. Update Environment with API Key

```bash
# Edit environment file
nano /opt/apps/cabernai-web-v2/.env.production

# Add the API token:
STRAPI_REST_READONLY_API_KEY=your_readonly_token_here

# Restart services to pick up new environment
cd /opt/apps/cabernai-web-v2
docker-compose -f docker-compose.production.yml restart
```

### 6. Test Your Sites

- **Main site**: `https://cabernai.io`
- **API**: `https://api.cabernai.io`
- **Admin**: `https://api.cabernai.io/admin`

## Updates

For subsequent deployments:

```bash
sudo ./update.sh
```

## Troubleshooting

```bash
# Check container status
cd /opt/apps/cabernai-web-v2
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs [service_name]

# Restart services
docker-compose -f docker-compose.production.yml restart

# Check SSL certificates
docker run --rm -v /var/lib/docker/volumes/cabernai-web-v2_nginx_certs/_data:/etc/letsencrypt \
  certbot/certbot:latest certificates
```

## Helpful Scripts

- **`deploy-production.sh`** - Complete deployment automation (now uses external database)
- **`post-deployment-helper.sh`** - Interactive helper for post-deployment tasks
- **`update.sh`** - Quick updates for existing deployments
- **`backup-db.sh`** - Database backup utility

## Quick Post-Deployment Helper

For easier post-deployment management, use the interactive helper:

```bash
sudo ./post-deployment-helper.sh
```

This script provides options to:

- Import database seed data
- Update API tokens
- Restart services
- Check service status
- View logs
- Test connectivity

## External Database Configuration

This deployment uses **external managed databases** for better performance, reliability, and scalability.

### Recommended Database Providers

- **DigitalOcean Managed Databases** - Same provider as your droplet
- **AWS RDS PostgreSQL** - Enterprise features, global availability
- **Supabase** - Modern PostgreSQL with generous free tier
- **Railway** - Developer-friendly with simple pricing

### Database Setup

1. **Create PostgreSQL database** with your chosen provider
2. **Note connection details** (host, port, database name, credentials)
3. **Enable SSL** (most providers enable this by default)
4. **Configure firewall** to allow connections from your droplet IP
5. **Create schema** (optional): `CREATE SCHEMA IF NOT EXISTS strapi_cabernai_web;`

### Development Setup

For local development with a custom schema, update `apps/strapi/.env`:

```bash
DATABASE_SCHEMA=strapi_cabernai_web  # or your preferred schema name
```

### Environment Configuration

Update your `.env.production` with:

```bash
# Option 1: Connection String (Recommended)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ompkcxbssxfweeqwdibt.supabase.co:5432/postgres?sslmode=require
DATABASE_SCHEMA=strapi_cabernai_web  # Schema must be set separately when using connection string

# Option 2: Individual Parameters
DATABASE_HOST=your-external-db-host.com
DATABASE_PORT=5432
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_secure_db_password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
DATABASE_SCHEMA=strapi_cabernai_web  # Optional: specify schema name (defaults to 'public')
```

---

🎉 **That's it!** The deployment script handles everything automatically.
