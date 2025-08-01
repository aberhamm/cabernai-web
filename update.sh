#!/bin/bash

# Update and redeploy script for production server
# This script pulls the latest code and redeploys the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cabernai-web-v2"
DEPLOY_DIR="/opt/apps/$PROJECT_NAME"
SCRIPT_DIR="/root"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

print_status "Starting application update..."

# Step 1: Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    print_error "Deployment directory $DEPLOY_DIR not found!"
    print_error "Please run the initial deployment first: sudo ./deploy.sh"
    exit 1
fi

# Step 1.5: Check for external database configuration
cd "$DEPLOY_DIR"
if [ -f ".env.production" ]; then
    if grep -q "DATABASE_URL\|DATABASE_HOST" .env.production; then
        print_status "External database configuration detected"
        # Note: No local database service will be started
    else
        print_warning "No external database configuration found in .env.production"
        print_warning "If you're using an external database, make sure to configure DATABASE_URL or DATABASE_HOST"
    fi
else
    print_error ".env.production not found! Please configure your environment variables."
    exit 1
fi

# Step 2: Check if services are running and stop them
print_step "(1/5) Stopping current services..."
cd $DEPLOY_DIR
if [ -f "docker-compose.production.yml" ] && [ -f ".env.production" ]; then
    docker-compose -f docker-compose.production.yml --env-file .env.production down || true
else
    print_warning "Docker compose files not found, skipping service stop"
fi

# Step 3: Pull latest changes
print_step "(2/5) Pulling latest code from repository..."
cd $DEPLOY_DIR
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    print_status "Code is already up to date!"
    UPDATED=false
else
    print_status "New changes found, updating..."
    git pull origin main
    UPDATED=true
fi

# Step 4: Update environment file if needed
print_step "(3/5) Checking environment configuration..."
if [ -f "$SCRIPT_DIR/.env.production" ]; then
    if [ ! -f "$DEPLOY_DIR/.env.production" ] || ! cmp -s "$SCRIPT_DIR/.env.production" "$DEPLOY_DIR/.env.production"; then
        print_status "Updating environment configuration..."
        cp "$SCRIPT_DIR/.env.production" "$DEPLOY_DIR/.env.production"
    else
        print_status "Environment configuration is up to date"
    fi
else
    print_warning "Environment file not found in $SCRIPT_DIR/.env.production"
fi

# Step 5: Rebuild and start services
print_step "(4/5) Building and starting services..."
cd $DEPLOY_DIR

# Clean up unused Docker resources to free space
print_status "Cleaning up Docker resources..."
docker system prune -f

# Build and start services
docker-compose -f docker-compose.production.yml --env-file .env.production build
docker-compose -f docker-compose.production.yml --env-file .env.production up -d

# Step 6: Wait for services and check health
print_step "(5/5) Checking service health..."
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    print_status "Services are running successfully!"
    
    # Show service status
    echo ""
    print_status "Service status:"
    docker-compose -f docker-compose.production.yml ps
    
    echo ""
    print_status "Update completed successfully!"
    if [ "$UPDATED" = true ]; then
        print_status "Application has been updated with latest changes"
    else
        print_status "Application has been restarted with current version"
    fi
    
    print_status "Your applications should be accessible at:"
    print_status "- Frontend: https://your-domain.com"
    print_status "- Strapi API: https://api.your-domain.com/api"
    print_status "- Strapi Admin: https://api.your-domain.com/admin"
    
else
    print_error "Some services failed to start!"
    print_error "Check the logs with: docker-compose -f docker-compose.production.yml logs"
    exit 1
fi

echo ""
print_status "Useful commands:"
print_status "- View logs: cd $DEPLOY_DIR && docker-compose -f docker-compose.production.yml logs"
print_status "- Restart services: cd $DEPLOY_DIR && docker-compose -f docker-compose.production.yml restart"
print_status "- Stop services: cd $DEPLOY_DIR && docker-compose -f docker-compose.production.yml down"