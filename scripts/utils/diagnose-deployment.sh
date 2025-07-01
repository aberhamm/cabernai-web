#!/bin/bash

# Deployment Diagnostic Script
# Run this on your server to diagnose deployment issues

set -e

echo "🔍 CABERNAI WEB DEPLOYMENT DIAGNOSTICS"
echo "======================================="
echo "📊 Started at: $(date)"
echo ""

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

# Check if running as deploy user
if [[ "$USER" != "deploy" ]]; then
    echo_warning "Run this script as the deploy user: sudo -u deploy $0"
    echo "Continuing anyway..."
fi

echo "🔍 SYSTEM STATUS"
echo "================"
echo_info "System resources:"
free -h
echo ""
df -h /opt
echo ""
echo_info "CPU cores: $(nproc)"
echo_info "Uptime: $(uptime)"
echo ""

echo "🐳 DOCKER STATUS"
echo "================"
echo_info "Docker version:"
docker --version
docker-compose --version
echo ""

echo_info "Docker system usage:"
docker system df
echo ""

echo_info "Running containers:"
docker ps -a
echo ""

if [[ -d "$PROJECT_PATH" ]]; then
    cd "$PROJECT_PATH"

    echo "📁 PROJECT STATUS"
    echo "================="
    echo_info "Project directory exists: $PROJECT_PATH"

    if [[ -f ".env" ]]; then
        echo_success "Environment file exists"
        echo_info "Environment file size: $(wc -l < .env) lines"

        # Check for critical environment variables (without showing values)
        echo_info "Checking critical environment variables:"

        critical_vars=(
            "DATABASE_URL"
            "APP_KEYS"
            "ADMIN_JWT_SECRET"
            "JWT_SECRET"
            "NEXTAUTH_SECRET"
            "NEXT_PUBLIC_APP_PUBLIC_URL"
            "NEXT_PUBLIC_STRAPI_URL"
        )

        for var in "${critical_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                echo_success "$var is set"
            else
                echo_error "$var is missing"
            fi
        done
    else
        echo_error "Environment file missing!"
    fi
    echo ""

    if [[ -f "docker-compose.multi-site.yml" ]]; then
        echo_success "Docker Compose file exists"

        echo "📊 CONTAINER STATUS"
        echo "=================="
        echo_info "Current container status:"
        docker-compose -f docker-compose.multi-site.yml ps
        echo ""

        echo_info "Container logs (last 20 lines each):"
        echo "--- UI LOGS ---"
        docker-compose -f docker-compose.multi-site.yml logs --tail=20 ui 2>/dev/null || echo "No UI logs available"
        echo ""
        echo "--- STRAPI LOGS ---"
        docker-compose -f docker-compose.multi-site.yml logs --tail=20 strapi 2>/dev/null || echo "No Strapi logs available"
        echo ""

        echo "🔍 HEALTH CHECKS"
        echo "================"

        # Test local endpoints
        echo_info "Testing local endpoints:"

        if timeout 10 curl -f -s http://127.0.0.1:3000/ > /dev/null 2>&1; then
            echo_success "UI responding on localhost:3000"
        else
            echo_error "UI not responding on localhost:3000"
        fi

        if timeout 10 curl -f -s http://127.0.0.1:1337/ > /dev/null 2>&1; then
            echo_success "Strapi responding on localhost:1337"
        else
            echo_error "Strapi not responding on localhost:1337"
        fi
        echo ""

        echo "🌐 NETWORK STATUS"
        echo "================="
        echo_info "Port bindings:"
        netstat -tulpn | grep -E ':(3000|1337|80|443)' || echo "No relevant ports bound"
        echo ""

        echo_info "Docker networks:"
        docker network ls | grep cabernai || echo "No cabernai networks found"
        echo ""

    else
        echo_error "Docker Compose file missing!"
    fi

else
    echo_error "Project directory not found: $PROJECT_PATH"
fi

echo "🔧 NGINX STATUS"
echo "==============="
if systemctl is-active --quiet nginx; then
    echo_success "Nginx is running"
    echo_info "Nginx configuration test:"
    if sudo nginx -t; then
        echo_success "Nginx configuration is valid"
    else
        echo_error "Nginx configuration has errors"
    fi

    echo_info "Nginx sites enabled:"
    ls -la /etc/nginx/sites-enabled/ | grep cabernai || echo "No cabernai sites found"
else
    echo_error "Nginx is not running"
fi
echo ""

echo "📋 RECENT SYSTEM LOGS"
echo "===================="
echo_info "Recent Docker events:"
docker events --since '30m' --until '0s' 2>/dev/null | tail -10 || echo "No recent Docker events"
echo ""

echo_info "Recent system logs (errors only):"
journalctl --since '30 minutes ago' --no-pager -p err | tail -10 || echo "No recent errors"
echo ""

echo "🎯 RECOMMENDATIONS"
echo "=================="

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [[ $MEMORY_USAGE -gt 80 ]]; then
    echo_warning "High memory usage: ${MEMORY_USAGE}%"
    echo "   Consider adding swap or reducing container memory usage"
fi

# Check disk usage
DISK_USAGE=$(df /opt | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $DISK_USAGE -gt 80 ]]; then
    echo_warning "High disk usage: ${DISK_USAGE}%"
    echo "   Consider cleaning up Docker images: docker system prune -a"
fi

# Check if containers are running
if [[ -d "$PROJECT_PATH" ]] && [[ -f "$PROJECT_PATH/docker-compose.multi-site.yml" ]]; then
    cd "$PROJECT_PATH"
    RUNNING_CONTAINERS=$(docker-compose -f docker-compose.multi-site.yml ps --services --filter "status=running" | wc -l)
    if [[ $RUNNING_CONTAINERS -eq 0 ]]; then
        echo_error "No containers are running"
        echo "   Try: docker-compose -f docker-compose.multi-site.yml up -d"
    elif [[ $RUNNING_CONTAINERS -lt 2 ]]; then
        echo_warning "Only $RUNNING_CONTAINERS/2 containers running"
        echo "   Check container logs above for errors"
    else
        echo_success "All containers appear to be running"
    fi
fi

echo ""
echo "📊 Diagnostics completed at: $(date)"
echo ""
echo "🔗 Next steps:"
echo "1. Review the output above for any red ❌ errors"
echo "2. If containers aren't running, check the container logs"
echo "3. If memory/disk usage is high, consider cleanup or server upgrade"
echo "4. For database issues, verify DATABASE_URL in .env file"
echo "5. For build issues, try rebuilding: docker-compose -f docker-compose.multi-site.yml build --no-cache"
