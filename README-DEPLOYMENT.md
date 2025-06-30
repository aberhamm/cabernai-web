# 🚀 Cabernai Web Deployment Guide

Complete deployment guide for your Cabernai Web monorepo to DigitalOcean with Supabase database.

## 🎯 Choose Your Deployment Type

**Before starting, choose the right deployment approach:**

| **Fresh/Dedicated Droplet**                           | **Existing Droplet with Sites**                     |
| ----------------------------------------------------- | --------------------------------------------------- |
| ✅ New DigitalOcean droplet                           | ✅ Droplet with existing websites                   |
| ✅ Full server control                                | ✅ Shared hosting environment                       |
| ✅ Simpler setup                                      | ✅ No port conflicts                                |
| ✅ Maximum isolation                                  | ✅ Cost-effective                                   |
| **Use: [Single-Site Setup](#single-site-deployment)** | **Use: [Multi-Site Setup](#multi-site-deployment)** |

## 📋 Prerequisites

- DigitalOcean account
- Supabase account
- Domain name (optional but recommended)
- Basic terminal/SSH knowledge

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Choose a region close to your DigitalOcean droplet
3. Wait for the project to be ready

### 2. Get Database Connection String

1. In your Supabase dashboard, go to **Settings** > **Database**
2. Find the **Connection string** section
3. Copy the **URI** format connection string
4. Replace `[YOUR-PASSWORD]` with your actual database password

Example:

```
postgresql://postgres.abcdefghijklmnop:your-real-password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 3. Configure Database for Strapi

Supabase PostgreSQL is compatible with Strapi out of the box. No additional configuration needed.

## 🔧 Environment Configuration

### 1. Generate Environment Variables

On your local machine:

```bash
# Clone your repository
git clone https://github.com/your-username/cabernai-web.git
cd cabernai-web

# Make the generator script executable
chmod +x scripts/deploy/env-generator.sh

# Generate environment file
./scripts/deploy/env-generator.sh
```

This creates a `.env` file with:

- Secure random secrets
- Supabase database configuration
- Your domain settings
- Optional service configurations

### 2. Key Environment Variables

Make sure these are properly configured:

```bash
# Domain Configuration
UI_PUBLIC_URL=https://your-domain.com
STRAPI_PUBLIC_URL=https://your-domain.com

# Supabase Database
SUPABASE_DATABASE_URL=postgresql://postgres.xxx:password@xxx.pooler.supabase.com:6543/postgres

# File Upload (choose one)
# Cloudinary (recommended)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OR AWS S3
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_ACCESS_SECRET=your-secret-key
# AWS_REGION=us-west-2
# AWS_BUCKET=your-bucket-name
```

---

## 🆕 Single-Site Deployment

_For fresh/dedicated DigitalOcean droplets_

### Create DigitalOcean Droplet

1. **Image**: Ubuntu 22.04 LTS
2. **Size**: Basic plan, 2GB RAM minimum (4GB recommended)
3. **Region**: Choose same region as your Supabase project
4. **Authentication**: SSH keys (recommended) or password
5. **Hostname**: Give it a memorable name

### Initial Server Setup

Connect to your droplet:

```bash
ssh root@your-droplet-ip
```

Run the setup script:

```bash
# Copy the setup script to your droplet
curl -o setup-droplet.sh https://raw.githubusercontent.com/your-repo/cabernai-web/main/scripts/deploy/setup-droplet.sh
chmod +x setup-droplet.sh

# Run the setup (as root)
sudo ./setup-droplet.sh
```

This script will:

- Install Docker, Node.js, and dependencies
- Configure firewall and security
- Create a deploy user
- Set up SSL certificate support
- Configure system optimization

### Add SSH Key for Deploy User

```bash
# Add your public SSH key to the deploy user
echo "your-ssh-public-key" >> /home/deploy/.ssh/authorized_keys
```

### Deploy to Fresh Droplet

#### Method 1: Manual Deployment

```bash
# From your local machine
SSH_HOST=your-droplet-ip ./scripts/deploy/deploy.sh production
```

#### Method 2: Git-based Deployment

1. **Push your code to GitHub**
2. **On your droplet, clone the repository:**
   ```bash
   ssh deploy@your-droplet-ip
   cd /opt/cabernai-web
   git clone https://github.com/your-username/cabernai-web.git .
   ```
3. **Copy your environment file:**
   ```bash
   scp .env deploy@your-droplet-ip:/opt/cabernai-web/.env
   ```
4. **Run deployment:**
   ```bash
   ssh deploy@your-droplet-ip
   cd /opt/cabernai-web
   ./scripts/deploy/deploy.sh production
   ```

#### Method 3: GitHub Actions (Automated)

1. **Copy the workflow file:**

   ```bash
   cp scripts/deploy/github-actions.yml .github/workflows/deploy.yml
   ```

2. **Set up GitHub Secrets:** Go to your GitHub repository → Settings → Secrets and add:

   ```
   DROPLET_HOST=your-droplet-ip
   SSH_PRIVATE_KEY=your-private-ssh-key
   DOMAIN_NAME=your-domain.com
   UI_PUBLIC_URL=https://your-domain.com
   STRAPI_PUBLIC_URL=https://your-domain.com
   SUPABASE_DATABASE_URL=your-supabase-connection-string
   APP_KEYS=generated-app-keys
   ADMIN_JWT_SECRET=generated-secret
   API_TOKEN_SALT=generated-salt
   TRANSFER_TOKEN_SALT=generated-salt
   JWT_SECRET=generated-secret
   NEXTAUTH_SECRET=generated-secret
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   # ... other optional secrets
   ```

3. **Push to main branch** - deployment will trigger automatically

### Single-Site Service Management

```bash
# Start/stop all services
sudo systemctl start cabernai-web
sudo systemctl stop cabernai-web
sudo systemctl restart cabernai-web

# Check service status
sudo systemctl status cabernai-web

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Manual Docker commands
cd /opt/cabernai-web
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f strapi
docker-compose -f docker-compose.prod.yml restart strapi
```

---

## 🏠 Multi-Site Deployment

_For droplets with existing websites_

### What's Different in Multi-Site Mode

Instead of taking over the entire server:

✅ **Uses internal ports only** (127.0.0.1:3000, 127.0.0.1:1337)
✅ **Integrates with existing nginx** instead of replacing it
✅ **No port conflicts** with existing services
✅ **Isolated Docker networks** to avoid conflicts
✅ **Site-specific configuration** that coexists peacefully

### Key Changes

| Single-Site Setup               | Multi-Site Setup                  |
| ------------------------------- | --------------------------------- |
| Nginx container on ports 80/443 | Uses existing nginx + site config |
| Direct port binding             | Localhost-only binding            |
| Own nginx config                | Adds to existing nginx            |
| `docker-compose.prod.yml`       | `docker-compose.multi-site.yml`   |

### Prepare Your Existing Droplet

```bash
# On your droplet (as root)
curl -o setup-existing-droplet.sh https://raw.githubusercontent.com/your-repo/cabernai-web/main/scripts/deploy/setup-existing-droplet.sh
chmod +x setup-existing-droplet.sh
sudo ./setup-existing-droplet.sh
```

This script will:

- ✅ Check for conflicts with existing services
- ✅ Install missing dependencies (Docker, nginx, certbot)
- ✅ Create deploy user and project directories
- ✅ Set up systemd service for auto-start
- ✅ Configure backups and log rotation

### Deploy to Multi-Site Droplet

```bash
# From your local machine
SSH_HOST=your-droplet-ip ./scripts/deploy/deploy-multi-site.sh production
```

This will:

- ✅ Copy project files to `/opt/cabernai-web/`
- ✅ Build Docker containers (ports 127.0.0.1:3000, 127.0.0.1:1337)
- ✅ Add nginx site configuration
- ✅ Configure SSL-ready reverse proxy
- ✅ Test all connections

### Multi-Site File Structure

```
/opt/cabernai-web/               # Your application
├── docker-compose.multi-site.yml
├── .env
├── apps/
└── nginx/sites-available/cabernai-web

/etc/nginx/
├── sites-available/cabernai-web    # Your site config
├── sites-enabled/cabernai-web      # Symlinked
├── sites-enabled/your-other-site   # Existing sites unchanged
└── nginx.conf                      # Enhanced with rate limiting

/var/log/cabernai-web/              # Application logs
```

### Multi-Site Service Management

```bash
# Start/stop your application
sudo systemctl start cabernai-web
sudo systemctl stop cabernai-web
sudo systemctl restart cabernai-web

# Check status
sudo systemctl status cabernai-web

# View logs
docker-compose -f docker-compose.multi-site.yml logs -f
tail -f /var/log/cabernai-web/*.log

# Update deployment
cd /opt/cabernai-web
git pull origin main
./scripts/deploy/deploy-multi-site.sh production
```

### Multi-Site Port Configuration

| Service      | Internal Port  | External Access               |
| ------------ | -------------- | ----------------------------- |
| Next.js UI   | 127.0.0.1:3000 | https://your-domain.com       |
| Strapi API   | 127.0.0.1:1337 | https://your-domain.com/api   |
| Strapi Admin | 127.0.0.1:1337 | https://your-domain.com/admin |

**Why localhost-only?** This prevents external access to internal ports and ensures all traffic goes through nginx for security and SSL termination.

---

## 🌐 Domain & SSL Setup

_For both deployment types_

### 1. Point Domain to Droplet

In your domain registrar's DNS settings:

```
Type: A
Name: @
Value: your-droplet-ip
TTL: 3600

Type: A
Name: www
Value: your-droplet-ip
TTL: 3600
```

### 2. Set up SSL Certificate

```bash
ssh deploy@your-droplet-ip

# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 3. Update Configuration

**Single-Site:**

```bash
# Edit the nginx configuration
sudo nano /opt/cabernai-web/nginx/conf.d/app.conf
# Replace "your-domain.com" with your actual domain
cd /opt/cabernai-web
docker-compose -f docker-compose.prod.yml restart nginx
```

**Multi-Site:**

```bash
# Configuration is handled automatically by the deployment script
# SSL is configured directly in the existing nginx installation
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check if services are responding
curl https://your-domain.com/health
curl https://your-domain.com/api/health

# Check system resources
htop
docker stats
```

### Log Management

**Single-Site:**

```bash
# View application logs
tail -f /var/log/cabernai-web/*.log

# View nginx logs (from container)
cd /opt/cabernai-web
docker-compose -f docker-compose.prod.yml logs nginx
```

**Multi-Site:**

```bash
# View application logs
tail -f /var/log/cabernai-web/*.log

# View nginx logs (system-wide)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check systemd journal
journalctl -u cabernai-web -f
```

### Backups

The system includes automated backup scripts:

```bash
# Manual backup
/opt/cabernai-web/backup.sh

# View backup logs
tail -f /var/log/cabernai-web/backup.log

# List backups
ls -la /opt/backups/
```

**Database backups** are handled automatically by Supabase.

### Updates

```bash
# Pull latest code (if using git)
cd /opt/cabernai-web
git pull origin main

# Rebuild and deploy
# Single-Site:
./scripts/deploy/deploy.sh production

# Multi-Site:
./scripts/deploy/deploy-multi-site.sh production

# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean up old Docker images
docker system prune -f
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Services not starting

**Single-Site:**

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check environment file
cat .env

# Verify database connection
docker-compose -f docker-compose.prod.yml exec strapi yarn strapi console
```

**Multi-Site:**

```bash
# Check logs
docker-compose -f docker-compose.multi-site.yml logs

# Check container status
docker-compose -f docker-compose.multi-site.yml ps

# Test local endpoints
curl http://127.0.0.1:3000/
curl http://127.0.0.1:1337/
```

#### 2. Port Conflicts (Multi-Site Only)

```bash
# Check what's using your ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :1337

# If conflicts exist, stop the conflicting service
sudo systemctl stop conflicting-service
```

#### 3. Nginx Configuration Issues

**Single-Site:**

```bash
# Check nginx container logs
docker-compose -f docker-compose.prod.yml logs nginx

# Restart nginx container
docker-compose -f docker-compose.prod.yml restart nginx
```

**Multi-Site:**

```bash
# Test nginx configuration
sudo nginx -t

# Check site-specific logs
sudo tail -f /var/log/nginx/error.log

# Reload nginx safely
sudo systemctl reload nginx
```

#### 4. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
curl -I https://your-domain.com
```

#### 5. Database Connection Issues

- Verify Supabase connection string
- Check if IP is whitelisted in Supabase
- Test connection: `psql "your-connection-string"`

#### 6. File Upload Issues

- Check Cloudinary/S3 credentials
- Verify environment variables
- Check upload permissions

### Performance Optimization

1. **Enable monitoring:**

   ```bash
   # Install monitoring tools
   sudo apt install netdata

   # Access at http://your-droplet-ip:19999
   ```

2. **Optimize Docker:**

   ```bash
   # Limit log size
   echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' | sudo tee /etc/docker/daemon.json
   sudo systemctl restart docker
   ```

3. **Database optimization:**
   - Use connection pooling (already configured)
   - Monitor query performance in Supabase dashboard
   - Set up database indexes as needed

### Migration Between Deployment Types

#### From Single-Site to Multi-Site

```bash
# 1. Stop current setup
cd /opt/cabernai-web
docker-compose -f docker-compose.prod.yml down

# 2. Remove nginx container
docker-compose -f docker-compose.prod.yml rm nginx

# 3. Deploy multi-site version
./scripts/deploy/deploy-multi-site.sh production
```

#### From Multi-Site to Single-Site

```bash
# 1. Stop multi-site setup
cd /opt/cabernai-web
docker-compose -f docker-compose.multi-site.yml down

# 2. Remove nginx site config
sudo rm /etc/nginx/sites-enabled/cabernai-web

# 3. Deploy single-site version
./scripts/deploy/deploy.sh production
```

## 💰 Cost Estimation

**DigitalOcean Droplet:**

- Basic (2GB RAM): $12/month
- Standard (4GB RAM): $24/month

**Supabase:**

- Free tier: $0/month (up to 2 projects, 500MB database)
- Pro tier: $25/month (unlimited projects, 8GB database)

**Total estimated cost:** $12-49/month

## 🎉 Success Checklist

After deployment, verify:

- [ ] `https://your-domain.com` shows your Next.js app
- [ ] `https://your-domain.com/admin` shows Strapi admin
- [ ] `https://your-domain.com/api/health` returns health status
- [ ] SSL certificate is valid and auto-renewing
- [ ] **Multi-Site Only:** Your existing sites still work normally
- [ ] Logs are being rotated properly
- [ ] Backups are running (check `/opt/backups/`)
- [ ] Services start automatically on reboot

## 🆘 Support

If you encounter issues:

1. Check the logs first
2. Verify all environment variables are set correctly
3. Ensure your domain DNS is properly configured
4. Test database connectivity separately
5. Check DigitalOcean and Supabase status pages

## 🔄 Updates & Maintenance

Regular maintenance tasks:

- **Weekly:** Check system updates, review logs
- **Monthly:** Rotate logs, clean up Docker images
- **Quarterly:** Review security settings, update dependencies

Your deployment should now be running successfully! 🎉
