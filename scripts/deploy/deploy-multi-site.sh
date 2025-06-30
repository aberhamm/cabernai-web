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

# Timeout settings (in seconds)
BUILD_TIMEOUT=1800  # 30 minutes for build
STARTUP_TIMEOUT=300 # 5 minutes for startup
HEALTH_CHECK_TIMEOUT=180 # 3 minutes for health checks

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO $(date '+%H:%M:%S')]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN $(date '+%H:%M:%S')]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR $(date '+%H:%M:%S')]${NC} $1"
}

echo_debug() {
    echo -e "${BLUE}[DEBUG $(date '+%H:%M:%S')]${NC} $1"
}

echo_step() {
    echo ""
    echo -e "${GREEN}[STEP $(date '+%H:%M:%S')]${NC} =========================================="
    echo -e "${GREEN}[STEP $(date '+%H:%M:%S')]${NC} $1"
    echo -e "${GREEN}[STEP $(date '+%H:%M:%S')]${NC} =========================================="
}

# Function to run commands with timeout and logging
run_with_timeout() {
    local timeout=$1
    local description=$2
    shift 2
    local cmd="$*"

    echo_debug "Running: $cmd"
    echo_debug "Timeout: ${timeout}s"

    if timeout $timeout bash -c "$cmd"; then
        echo_debug "✓ Completed: $description"
        return 0
    else
        echo_error "✗ Timeout or failure: $description"
        echo_error "Command: $cmd"
        return 1
    fi
}

# Function to monitor long-running processes with progress updates
monitor_progress() {
    local pid=$1
    local description=$2
    local timeout=${3:-1800}  # Default 30 minutes

    local start_time=$(date +%s)
    local last_update=0

    echo_info "⏳ $description (PID: $pid, Timeout: ${timeout}s)"

    while kill -0 $pid 2>/dev/null; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))

        # Update every 30 seconds
        if [[ $((elapsed - last_update)) -ge 30 ]]; then
            echo_debug "⏱️  Still running... ${elapsed}s elapsed ($(($elapsed / 60))m)"
            last_update=$elapsed

            # Show system resources every 2 minutes
            if [[ $((elapsed % 120)) -eq 0 ]] && [[ $elapsed -gt 0 ]]; then
                echo_debug "📊 System resources:"
                df -h /opt | head -2
                free -h | head -2
            fi
        fi

        # Check timeout
        if [[ $elapsed -ge $timeout ]]; then
            echo_error "⏰ Process timed out after ${timeout}s"
            kill $pid 2>/dev/null || true
            return 1
        fi

        sleep 5
    done

    # Check exit status
    if wait $pid; then
        local final_elapsed=$(($(date +%s) - start_time))
        echo_info "✅ $description completed in ${final_elapsed}s ($(($final_elapsed / 60))m)"
        return 0
    else
        echo_error "❌ $description failed"
        return 1
    fi
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
    echo_step "Checking for existing services..."

    # Check if nginx is running
    echo_debug "Checking nginx status..."
    if systemctl is-active --quiet nginx; then
        echo_info "✓ Nginx is running"
        NGINX_RUNNING=true
        echo_debug "Nginx version: $(nginx -v 2>&1)"
    else
        echo_warn "Nginx is not running - will need to install/start it"
        NGINX_RUNNING=false
    fi

    # Check for port conflicts with detailed logging
    echo_debug "Checking port conflicts..."

    if netstat -tulpn | grep :80 | grep -v nginx > /dev/null; then
        echo_warn "Port 80 is occupied by a non-nginx service:"
        netstat -tulpn | grep :80 | grep -v nginx
    fi

    if netstat -tulpn | grep :443 | grep -v nginx > /dev/null; then
        echo_warn "Port 443 is occupied by a non-nginx service:"
        netstat -tulpn | grep :443 | grep -v nginx
    fi

    # Check if ports 3000 and 1337 are free
    echo_debug "Checking application ports 3000 and 1337..."

    if netstat -tulpn | grep :3000 > /dev/null; then
        echo_error "Port 3000 is already in use!"
        echo_error "Services using port 3000:"
        netstat -tulpn | grep :3000
        echo "Please stop the service using port 3000 or modify the configuration"
        exit 1
    fi

    if netstat -tulpn | grep :1337 > /dev/null; then
        echo_error "Port 1337 is already in use!"
        echo_error "Services using port 1337:"
        netstat -tulpn | grep :1337
        echo "Please stop the service using port 1337 or modify the configuration"
        exit 1
    fi

    echo_info "✓ Port check passed - 3000 and 1337 are available"

    # Check Docker status
    echo_debug "Checking Docker status..."
    if systemctl is-active --quiet docker; then
        echo_info "✓ Docker is running"
        echo_debug "Docker version: $(docker --version)"
        echo_debug "Docker Compose version: $(docker-compose --version)"
    else
        echo_error "Docker is not running!"
        exit 1
    fi

    # Check available disk space
    echo_debug "Checking disk space..."
    df -h /opt

    # Check available memory
    echo_debug "Checking memory usage..."
    free -h
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

        # Check if root .env file exists (using env_file directive)
    if [[ ! -f .env ]]; then
        echo_error "Root .env file not found!"
        echo ""
        echo "✨ With the new env_file directive, you only need ONE .env file!"
        echo "Please run './scripts/deploy/env-generator.sh' to create it"
        exit 1
    fi

    echo_info "✅ Found .env file - using env_file directive for clean multi-site deployment"

    # Check for existing services and conflicts
    check_existing_services

    # Pull latest code (if using git deployment)
    if [[ -d .git ]]; then
        echo_info "Pulling latest code..."
        git pull origin main
    fi

    # Stop any existing containers gracefully
    if [[ -f $DOCKER_COMPOSE_FILE ]]; then
        echo_step "Stopping existing containers..."
        echo_debug "Checking for existing containers..."
        docker-compose -f $DOCKER_COMPOSE_FILE ps

        echo_debug "Stopping containers with timeout..."
        run_with_timeout 120 "Stop existing containers" \
            "docker-compose -f $DOCKER_COMPOSE_FILE down --timeout 30 || true"

        echo_debug "Removing orphaned containers..."
        docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans || true

        echo_info "✓ Existing containers stopped"
    fi

    # Build and deploy with Docker Compose
    echo_step "Building Docker images..."
    echo_debug "Starting build process - this may take 15-30 minutes..."
    echo_debug "Build timeout set to: ${BUILD_TIMEOUT}s ($(($BUILD_TIMEOUT / 60)) minutes)"

    # Show system resources before build
    echo_debug "System resources before build:"
    df -h /opt
    free -h

    # Build with progress monitoring
    echo_info "Building images (this will take several minutes)..."

    # Use a more efficient build strategy with progress monitoring
    echo_info "Starting Docker build with parallel processing..."

    # Start build in background and monitor progress
    docker-compose -f $DOCKER_COMPOSE_FILE build --parallel &
    BUILD_PID=$!

    if monitor_progress $BUILD_PID "Docker image build (parallel)" $BUILD_TIMEOUT; then
        echo_info "✓ Docker images built successfully with parallel processing"
    else
        echo_error "Parallel build failed or timed out. Trying sequential build..."

        # Try sequential build as fallback
        docker-compose -f $DOCKER_COMPOSE_FILE build &
        BUILD_PID=$!

        if monitor_progress $BUILD_PID "Docker image build (sequential)" $BUILD_TIMEOUT; then
            echo_info "✓ Docker images built successfully with sequential processing"
        else
            echo_error "Both parallel and sequential builds failed!"
            exit 1
        fi
    fi

    # Show system resources after build
    echo_debug "System resources after build:"
    df -h /opt
    free -h
    docker images | head -20

    echo_step "Starting services..."
    echo_debug "Starting containers with timeout..."

    run_with_timeout $STARTUP_TIMEOUT "Start services" \
        "docker-compose -f $DOCKER_COMPOSE_FILE up -d"

    echo_info "✓ Services started"

    # Show running containers
    echo_debug "Running containers:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps

    # Set up nginx integration
    setup_nginx_integration

    # Wait for services to be ready with progress monitoring
    echo_step "Waiting for services to be ready..."
    echo_debug "Services may take 2-5 minutes to fully initialize..."

    # Progressive health checking instead of blind wait
    for i in {1..10}; do
        echo_debug "Health check attempt $i/10..."
        sleep 15

        # Check if containers are still running
        if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
            echo_debug "✓ Containers are running"
        else
            echo_warn "Some containers may have stopped. Checking logs..."
            docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=20
        fi

        # Try basic connectivity
        if curl -f -s http://127.0.0.1:3000/ > /dev/null 2>&1; then
            echo_info "✓ UI is responding - services are ready!"
            break
        elif [[ $i -eq 10 ]]; then
            echo_warn "Services may still be initializing. Proceeding with health checks..."
        else
            echo_debug "UI not ready yet, waiting..."
        fi
    done

    # Check service health with timeout
    echo_step "Running comprehensive health checks..."
    run_with_timeout $HEALTH_CHECK_TIMEOUT "Service health checks" "check_services"

    echo_info "Deployment completed successfully!"
    echo_warn "Don't forget to:"
    echo_warn "1. Set up SSL certificate: sudo certbot --nginx -d $DOMAIN_NAME"
    echo_warn "2. Uncomment rate limiting in nginx config if desired"
}

deploy_from_local() {
    echo_info "Deploying from local machine to $SSH_HOST..."

        # Check if root .env file exists locally (using env_file directive)
    if [[ ! -f .env ]]; then
        echo_error "Root .env file not found locally!"
        echo ""
        echo "✨ With the new env_file directive, you only need ONE .env file!"
        echo "Please run './scripts/deploy/env-generator.sh' to create it"
        exit 1
    fi

    echo_info "✅ Found .env file locally - using env_file directive for clean deployment"

    # Copy files to server
    echo_info "Copying project files..."
    rsync -avz --exclude node_modules --exclude .git \
        ./ $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/

    echo_info "✓ Copied all files including:"
    echo_info "  - .env (automatically loaded into all containers via env_file directive)"

    # Copy the multi-site docker compose file
    scp docker-compose.multi-site.yml $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/
    scp nginx/sites-available/cabernai-web $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/nginx/sites-available/

    # Run deployment on server
    ssh $DEPLOY_USER@$SSH_HOST "cd /opt/$PROJECT_NAME && ./scripts/deploy/deploy-multi-site.sh $ENVIRONMENT"
}

check_services() {
    echo_debug "Starting comprehensive service health checks..."

    # Check if containers are running
    echo_debug "Checking container status..."
    CONTAINERS=$(docker-compose -f $DOCKER_COMPOSE_FILE ps -q)

    if [[ -z "$CONTAINERS" ]]; then
        echo_error "No containers found! Docker Compose may have failed."
        echo_debug "Checking docker-compose logs..."
        docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=50
        return 1
    fi

    for container in $CONTAINERS; do
        STATUS=$(docker inspect --format='{{.State.Status}}' $container 2>/dev/null || echo "not found")
        NAME=$(docker inspect --format='{{.Name}}' $container 2>/dev/null | sed 's/\///' || echo "unknown")
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo "none")

        if [[ "$STATUS" == "running" ]]; then
            echo_info "✓ $NAME is running (Health: $HEALTH)"
        else
            echo_error "✗ $NAME is not running (Status: $STATUS)"
            echo_debug "Container logs for $NAME:"
            docker logs --tail=20 $container 2>&1 || true
        fi
    done

    # Test local endpoints with detailed logging
    echo_debug "Testing local endpoints..."

    # Test UI (local) with retries
    echo_debug "Testing UI on http://127.0.0.1:3000..."
    for attempt in {1..5}; do
        if curl -f -s --max-time 10 http://127.0.0.1:3000/ > /dev/null; then
            echo_info "✓ UI is responding locally (attempt $attempt)"
            break
        elif [[ $attempt -eq 5 ]]; then
            echo_warn "✗ UI is not responding locally after 5 attempts"
            echo_debug "Checking UI container logs..."
            docker-compose -f $DOCKER_COMPOSE_FILE logs ui --tail=20
        else
            echo_debug "UI not ready, attempt $attempt/5, retrying in 10s..."
            sleep 10
        fi
    done

    # Test Strapi (local) with retries
    echo_debug "Testing Strapi API on http://127.0.0.1:1337..."
    for attempt in {1..5}; do
        if curl -f -s --max-time 10 http://127.0.0.1:1337/ > /dev/null 2>&1; then
            echo_info "✓ Strapi API is responding locally (attempt $attempt)"
            break
        elif [[ $attempt -eq 5 ]]; then
            echo_warn "✗ Strapi API may not be ready yet (this is normal during first startup)"
            echo_debug "Checking Strapi container logs..."
            docker-compose -f $DOCKER_COMPOSE_FILE logs strapi --tail=20
        else
            echo_debug "Strapi not ready, attempt $attempt/5, retrying in 15s..."
            sleep 15
        fi
    done

    # Test through nginx (if domain is configured)
    if [[ -n "$DOMAIN_NAME" ]]; then
        echo_debug "Testing through nginx proxy for domain: $DOMAIN_NAME"

        # Test if nginx config exists
        if [[ -f "/etc/nginx/sites-enabled/$NGINX_SITE_NAME" ]]; then
            echo_debug "✓ Nginx site configuration exists"
        else
            echo_warn "Nginx site configuration not found"
        fi

        # Test nginx proxy
        if curl -f -s --max-time 10 -H "Host: $DOMAIN_NAME" http://localhost/ > /dev/null; then
            echo_info "✓ Nginx proxy is working"
        else
            echo_warn "✗ Nginx proxy may need additional configuration"
            echo_debug "Checking nginx error logs..."
            sudo tail -20 /var/log/nginx/error.log || true
        fi
    fi

    # Show resource usage after deployment
    echo_debug "System resources after deployment:"
    df -h /opt
    free -h
    echo_debug "Docker system usage:"
    docker system df
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
