#!/bin/bash

# Quick Deployment Fix Script
# Run this on your server to fix common deployment issues

set -e

PROJECT_NAME="cabernai-web"
PROJECT_PATH="/opt/$PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
echo_success() { echo -e "${GREEN}✅ $1${NC}"; }
echo_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
echo_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔧 CABERNAI WEB DEPLOYMENT QUICK FIX"
echo "====================================="
echo "📊 Started at: $(date)"
echo ""

# Check if running as deploy user
if [[ "$USER" != "deploy" ]]; then
    echo_error "This script must be run as the deploy user!"
    echo "Run: sudo -u deploy $0"
    exit 1
fi

if [[ ! -d "$PROJECT_PATH" ]]; then
    echo_error "Project directory not found: $PROJECT_PATH"
    echo "Please ensure the project has been deployed first."
    exit 1
fi

cd "$PROJECT_PATH"

echo_info "🧹 Step 1: Cleaning up existing containers and images"
echo "Stopping any running containers..."
docker-compose -f docker-compose.multi-site.yml down --remove-orphans --timeout 30 || true

echo "Removing unused Docker resources..."
docker system prune -f

echo_success "Cleanup completed"
echo ""

echo_info "🔍 Step 2: Checking system resources"
MEMORY_AVAILABLE=$(free -m | awk 'NR==2{printf "%.0f", $7}')
DISK_AVAILABLE=$(df /opt | tail -1 | awk '{print $4}')

echo "Available memory: ${MEMORY_AVAILABLE}MB"
echo "Available disk space: ${DISK_AVAILABLE}KB"

if [[ $MEMORY_AVAILABLE -lt 200 ]]; then
    echo_warning "Low memory available. Adding temporary swap..."
    # Add 1GB temporary swap if needed
    if [[ ! -f /swapfile ]] || [[ $(swapon --show | wc -l) -eq 0 ]]; then
        echo "Creating temporary swap file..."
        sudo fallocate -l 1G /tmp/tempswap
        sudo chmod 600 /tmp/tempswap
        sudo mkswap /tmp/tempswap
        sudo swapon /tmp/tempswap
        echo_success "Temporary swap added"
    fi
fi
echo ""

echo_info "🔧 Step 3: Checking environment configuration"
if [[ ! -f ".env" ]]; then
    echo_error "Environment file missing! Please create .env file first."
    exit 1
fi

# Check critical environment variables
critical_vars=("DATABASE_URL" "APP_KEYS" "ADMIN_JWT_SECRET" "JWT_SECRET" "NEXTAUTH_SECRET")
missing_vars=()

for var in "${critical_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        missing_vars+=("$var")
    fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo_error "Missing critical environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo "Please add these variables to your .env file"
    exit 1
fi

echo_success "Environment configuration looks good"
echo ""

echo_info "🐳 Step 4: Rebuilding containers with optimizations"
echo "Building images with no cache and single-threaded operations..."

# Set resource constraints for build
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with resource constraints
docker-compose -f docker-compose.multi-site.yml build \
    --no-cache \
    --build-arg JOBS=1 \
    --build-arg npm_config_jobs=1 \
    --parallel=false

echo_success "Images built successfully"
echo ""

echo_info "🚀 Step 5: Starting services"
echo "Starting containers..."
docker-compose -f docker-compose.multi-site.yml up -d

echo "Waiting for services to initialize..."
sleep 30

echo_info "🔍 Step 6: Verifying deployment"
echo "Checking container status..."
docker-compose -f docker-compose.multi-site.yml ps

echo ""
echo "Testing local endpoints..."

# Test UI
if timeout 15 curl -f -s http://127.0.0.1:3000/ > /dev/null 2>&1; then
    echo_success "UI is responding on localhost:3000"
else
    echo_error "UI is not responding on localhost:3000"
    echo "UI container logs:"
    docker-compose -f docker-compose.multi-site.yml logs --tail=10 ui
fi

# Test Strapi
if timeout 15 curl -f -s http://127.0.0.1:1337/ > /dev/null 2>&1; then
    echo_success "Strapi is responding on localhost:1337"
else
    echo_error "Strapi is not responding on localhost:1337"
    echo "Strapi container logs:"
    docker-compose -f docker-compose.multi-site.yml logs --tail=10 strapi
fi

echo ""
echo_info "🔧 Step 7: Nginx configuration"
if systemctl is-active --quiet nginx; then
    echo_success "Nginx is running"

    # Test nginx configuration
    if sudo nginx -t; then
        echo_success "Nginx configuration is valid"
    else
        echo_error "Nginx configuration has errors"
        echo "Please check nginx configuration"
    fi
else
    echo_warning "Nginx is not running"
    echo "Starting nginx..."
    sudo systemctl start nginx
fi

echo ""
echo "📊 Fix completed at: $(date)"
echo ""
echo "🎯 Summary:"
echo "- Cleaned up old containers and images"
echo "- Rebuilt images with optimizations"
echo "- Started services"
echo "- Verified basic connectivity"
echo ""
echo "If issues persist:"
echo "1. Check container logs: docker-compose -f docker-compose.multi-site.yml logs"
echo "2. Monitor resources: htop or free -h"
echo "3. Check database connectivity from Strapi container"
echo "4. Verify all environment variables are set correctly"
