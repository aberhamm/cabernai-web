#!/bin/bash

# Deployment script for DigitalOcean Ubuntu Droplet
# Usage: ./scripts/deploy/deploy.sh [production|staging]

set -e

# Configuration
ENVIRONMENT=${1:-production}
DEPLOY_USER="deploy"
PROJECT_NAME="cabernai-web"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

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
        echo "Usage: SSH_HOST=your-droplet-ip ./scripts/deploy/deploy.sh"
        exit 1
    fi
fi

deploy_to_server() {
    echo_info "Deploying $PROJECT_NAME to $ENVIRONMENT environment..."

    # Create project directory
    sudo mkdir -p /opt/$PROJECT_NAME
    cd /opt/$PROJECT_NAME

    # Check if .env file exists
    if [[ ! -f .env ]]; then
        echo_error ".env file not found!"
        echo "Please copy .env.production to .env and configure it"
        exit 1
    fi

    # Pull latest code (if using git deployment)
    if [[ -d .git ]]; then
        echo_info "Pulling latest code..."
        git pull origin main
    fi

    # Build and deploy with Docker Compose
    echo_info "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache

    echo_info "Starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d

    # Wait for services to be ready
    echo_info "Waiting for services to start..."
    sleep 30

    # Check service health
    check_services

    echo_info "Deployment completed successfully!"
}

deploy_from_local() {
    echo_info "Deploying from local machine to $SSH_HOST..."

    # Copy files to server
    echo_info "Copying project files..."
    rsync -avz --exclude node_modules --exclude .git \
        ./ $DEPLOY_USER@$SSH_HOST:/opt/$PROJECT_NAME/

    # Run deployment on server
    ssh $DEPLOY_USER@$SSH_HOST "cd /opt/$PROJECT_NAME && ./scripts/deploy/deploy.sh $ENVIRONMENT"
}

check_services() {
    echo_info "Checking service health..."

    # Check if containers are running
    CONTAINERS=$(docker-compose -f $DOCKER_COMPOSE_FILE ps -q)
    for container in $CONTAINERS; do
        STATUS=$(docker inspect --format='{{.State.Status}}' $container)
        NAME=$(docker inspect --format='{{.Name}}' $container | sed 's/\///')

        if [[ "$STATUS" == "running" ]]; then
            echo_info "✓ $NAME is running"
        else
            echo_error "✗ $NAME is not running (Status: $STATUS)"
        fi
    done

    # Test HTTP endpoints
    echo_info "Testing HTTP endpoints..."

    # Test UI
    if curl -f -s http://localhost:80/health > /dev/null; then
        echo_info "✓ UI is responding"
    else
        echo_warn "✗ UI is not responding"
    fi

    # Test Strapi
    if curl -f -s http://localhost:80/api/health > /dev/null; then
        echo_info "✓ Strapi API is responding"
    else
        echo_warn "✗ Strapi API is not responding"
    fi
}

cleanup_old_images() {
    echo_info "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
}

# Main deployment logic
case $DEPLOY_MODE in
    "server")
        deploy_to_server
        cleanup_old_images
        ;;
    "local")
        deploy_from_local
        ;;
    *)
        echo_error "Unknown deployment mode"
        exit 1
        ;;
esac
