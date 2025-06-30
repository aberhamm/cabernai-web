#!/bin/bash

# Multi-site Deployment script for DigitalOcean Ubuntu Droplet
# This script deploys Cabernai Web alongside existing sites
# Usage: ./scripts/deploy/deploy-multi-site.sh [production|staging]

set -e

# Configuration
ENVIRONMENT=${1:-production}
DEPLOY_USER="deploy"
PROJECT_NAME="cabernai-web"
DOCKER_COMPOSE_FILE="docker-compose.multi-site.yml"
NGINX_SITE_NAME="cabernai-web"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're running this locally or on the server
if [[ "$HOSTNAME" == *"droplet"* ]] || [[ "$USER" == "deploy" ]]; then
    echo_info "Running deployment on server..."
    DEPLOY_MODE="server"
else
    echo_info "Running deployment locally..."
    DEPLOY_MODE="local"

    # Check if SSH_HOST is set for remote deployment
    if [[ -z "$SSH_HOST" ]]; then
        echo_error "SSH_HOST environment variable not set"
        echo "Usage: SSH_HOST=your-droplet-ip ./scripts/deploy/deploy-multi-site.sh"
        exit 1
    fi
fi

check_existing_services() {
    echo_info "Checking for existing services..."

    # Check if nginx is running
    if systemctl is-active --quiet nginx; then
        echo_info "✓ Nginx is running"
        NGINX_RUNNING=true
    else
        echo_warn "Nginx is not running - will need to install/start it"
        NGINX_RUNNING=false
    fi

    # Check for port conflicts
    if netstat -tulpn | grep :80 | grep -v nginx > /dev/null; then
        echo_warn "Port 80 is occupied by a non-nginx service"
    fi

    if netstat -tulpn | grep :443 | grep -v nginx > /dev/null; then
        echo_warn "Port 443 is occupied by a non-nginx service"
    fi

    # Check if ports 3000 and 1337 are free
    if netstat -tulpn | grep :3000 > /dev/null; then
        echo_error "Port 3000 is already in use!"
        echo "Please stop the service using port 3000 or modify the configuration"
        exit 1
    fi

    if netstat -tulpn | grep :1337 > /dev/null; then
        echo_error "Port 1337 is already in use!"
        echo "Please stop the service using port 1337 or modify the configuration"
        exit 1
    fi

    echo_info "Port check passed"
}

setup_nginx_integration() {
    echo_info "Setting up nginx integration..."

    # Install nginx if not present
    if ! command -v nginx &> /dev/null; then
        echo_info "Installing nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi

    # Create nginx site configuration
    echo_info "Creating nginx site configuration..."
    sudo cp /opt/$PROJECT_NAME/nginx/sites-available/$NGINX_SITE_NAME /etc/nginx/sites-available/

    # Prompt for domain name
    if [[ -z "$DOMAIN_NAME" ]]; then
        read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
    fi

    # Update domain in nginx config
    sudo sed -i "s/your-domain.com/$DOMAIN_NAME/g" /etc/nginx/sites-available/$NGINX_SITE_NAME

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE_NAME /etc/nginx/sites-enabled/

    # Test nginx configuration
    if sudo nginx -t; then
        echo_info "✓ Nginx configuration is valid"
    else
        echo_error "Nginx configuration test failed!"
        exit 1
    fi

    # Add rate limiting to main nginx.conf if not present
    if ! grep -q "cabernai_api" /etc/nginx/nginx.conf; then
        echo_info "Adding rate limiting configuration..."
        sudo sed -i '/http {/a\\n    # Rate limiting for Cabernai Web\n    limit_req_zone $binary_remote_addr zone=cabernai_api:10m rate=10r/s;\n    limit_req_zone $binary_remote_addr zone=cabernai_admin:10m rate=5r/s;' /etc/nginx/nginx.conf
    fi

    # Reload nginx
    sudo systemctl reload nginx
    echo_info "✓ Nginx configuration updated and reloaded"
}

deploy_to_server() {
    echo_info "Deploying $PROJECT_NAME to $ENVIRONMENT environment (multi-site mode)..."

    # Create project directory
    sudo mkdir -p /opt/$PROJECT_NAME
    cd /opt/$PROJECT_NAME

    # Check if .env file exists
    if [[ ! -f .env ]]; then
        echo_error ".env file not found!"
        echo "Please copy .env.example to .env and configure it"
        exit 1
    fi

    # Check for existing services and conflicts
    check_existing_services

    # Pull latest code (if using git deployment)
    if [[ -d .git ]]; then
        echo_info "Pulling latest code..."
        git pull origin main
    fi

    # Stop any existing containers gracefully
    if [[ -f $DOCKER_COMPOSE_FILE ]]; then
        echo_info "Stopping existing containers..."
        docker-compose -f $DOCKER_COMPOSE_FILE down || true
    fi

    # Build and deploy with Docker Compose
    echo_info "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache

    echo_info "Starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d

    # Set up nginx integration
    setup_nginx_integration

    # Wait for services to be ready
    echo_info "Waiting for services to start..."
    sleep 30

    # Check service health
    check_services

    echo_info "Deployment completed successfully!"
    echo_warn "Don't forget to:"
    echo_warn "1. Set up SSL certificate: sudo certbot --nginx -d $DOMAIN_NAME"
    echo_warn "2. Uncomment rate limiting in nginx config if desired"
}

deploy_from_local() {
    echo_info "Deploying from local machine to $SSH_HOST..."

    # Copy files to server
    echo_info "Copying project files..."
    rsync -avz --exclude node_modules --exclude .git \
        ./ $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/

    # Copy the multi-site docker compose file
    scp docker-compose.multi-site.yml $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/
    scp nginx/sites-available/cabernai-web $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/nginx/sites-available/

    # Run deployment on server
    ssh $DEPLOY_USER@$SSH_HOST "cd /opt/$PROJECT_NAME && ./scripts/deploy/deploy-multi-site.sh $ENVIRONMENT"
}

check_services() {
    echo_info "Checking service health..."

    # Check if containers are running
    CONTAINERS=$(docker-compose -f $DOCKER_COMPOSE_FILE ps -q)
    for container in $CONTAINERS; do
        STATUS=$(docker inspect --format='{{.State.Status}}' $container 2>/dev/null || echo "not found")
        NAME=$(docker inspect --format='{{.Name}}' $container 2>/dev/null | sed 's/\///' || echo "unknown")

        if [[ "$STATUS" == "running" ]]; then
            echo_info "✓ $NAME is running"
        else
            echo_error "✗ $NAME is not running (Status: $STATUS)"
        fi
    done

    # Test local endpoints
    echo_info "Testing local endpoints..."

    # Test UI (local)
    if curl -f -s http://127.0.0.1:3000/ > /dev/null; then
        echo_info "✓ UI is responding locally"
    else
        echo_warn "✗ UI is not responding locally"
    fi

    # Test Strapi (local)
    if curl -f -s http://127.0.0.1:1337/api/health > /dev/null 2>&1; then
        echo_info "✓ Strapi API is responding locally"
    else
        echo_warn "✗ Strapi API may not be ready yet (this is normal during first startup)"
    fi

    # Test through nginx (if domain is configured)
    if [[ -n "$DOMAIN_NAME" ]]; then
        echo_info "Testing through nginx proxy..."
        if curl -f -s -H "Host: $DOMAIN_NAME" http://localhost/health > /dev/null; then
            echo_info "✓ Nginx proxy is working"
        else
            echo_warn "✗ Nginx proxy may need additional configuration"
        fi
    fi
}

cleanup_old_images() {
    echo_info "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
}

show_next_steps() {
    echo ""
    echo_info "🎉 Multi-site deployment completed!"
    echo_warn "Next steps:"
    echo_warn "1. Set up SSL certificate:"
    echo_warn "   sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
    echo_warn ""
    echo_warn "2. Update your DNS records:"
    echo_warn "   A record: $DOMAIN_NAME -> your-droplet-ip"
    echo_warn "   A record: www.$DOMAIN_NAME -> your-droplet-ip"
    echo_warn ""
    echo_warn "3. Test your site:"
    echo_warn "   https://$DOMAIN_NAME"
    echo_warn "   https://$DOMAIN_NAME/admin (Strapi admin)"
    echo_warn ""
    echo_warn "4. Monitor logs:"
    echo_warn "   docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo_warn "   sudo tail -f /var/log/nginx/error.log"
}

# Main deployment logic
case $DEPLOY_MODE in
    "server")
        deploy_to_server
        cleanup_old_images
        show_next_steps
        ;;
    "local")
        deploy_from_local
        ;;
    *)
        echo_error "Unknown deployment mode"
        exit 1
        ;;
esac
