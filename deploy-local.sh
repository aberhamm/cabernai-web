#!/bin/bash

# Local Production Deployment Script
# Test production builds locally with flexible options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.local-prod.yml"
ENV_FILE=".env.local-prod"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                         Local Production Deployment                           ║${NC}"
echo -e "${BLUE}║                      Test Production Builds Locally                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════════╝${NC}"

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

# Function to show usage
show_usage() {
    echo -e "\n${GREEN}Usage:${NC}"
    echo "  $0 [OPTIONS] [COMMAND]"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo "  up       Start services (default)"
    echo "  down     Stop services"
    echo "  restart  Restart services"
    echo "  logs     View logs"
    echo "  build    Build images only"
    echo "  clean    Stop and remove containers, volumes, and images"
    echo ""
    echo -e "${GREEN}Options:${NC}"
    echo "  --strapi     Run only Strapi service"
    echo "  --ui         Run only UI service"
    echo "  --both       Run both services (default)"
    echo "  --build      Force rebuild images"
    echo "  --follow     Follow logs (for logs command)"
    echo "  --help       Show this help message"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  $0                    # Start both services"
    echo "  $0 --strapi          # Start only Strapi"
    echo "  $0 --ui --build      # Start only UI with rebuild"
    echo "  $0 logs --strapi     # View Strapi logs"
    echo "  $0 down              # Stop all services"
    echo "  $0 clean             # Full cleanup"
}

# Parse command line arguments
SERVICES="strapi-app ui-app"
COMMAND="up"
BUILD_FLAG=""
FOLLOW_LOGS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --strapi)
            SERVICES="strapi-app"
            shift
            ;;
        --ui)
            SERVICES="ui-app"
            shift
            ;;
        --both)
            SERVICES="strapi-app ui-app"
            shift
            ;;
        --build)
            BUILD_FLAG="--build"
            shift
            ;;
        --follow)
            FOLLOW_LOGS="-f"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        up|down|restart|logs|build|clean)
            COMMAND="$1"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done


# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    print_warning "Environment file $ENV_FILE not found!"
    if [ -f ".env.production" ]; then
        print_step "Creating $ENV_FILE from .env.production..."
        cp .env.production "$ENV_FILE"
        
        # Update URLs for local testing
        sed -i.bak 's|STRAPI_URL=https://api.cabernai.io|STRAPI_URL=http://localhost:1337|g' "$ENV_FILE"
        sed -i.bak 's|APP_PUBLIC_URL=https://cabernai.io|APP_PUBLIC_URL=http://localhost:3000|g' "$ENV_FILE"
        sed -i.bak 's|NEXTAUTH_URL=https://cabernai.io|NEXTAUTH_URL=http://localhost:3000|g' "$ENV_FILE"
        
        # Uncomment DATABASE_URL if it's commented out
        sed -i.bak 's|# DATABASE_URL=|DATABASE_URL=|g' "$ENV_FILE"
        
        # If DATABASE_URL is still empty, create it from individual parameters
        if ! grep -q "^DATABASE_URL=postgresql://" "$ENV_FILE"; then
            if grep -q "^DATABASE_HOST=" "$ENV_FILE" && grep -q "^DATABASE_PASSWORD=" "$ENV_FILE"; then
                HOST=$(grep "^DATABASE_HOST=" "$ENV_FILE" | cut -d'=' -f2)
                PORT=$(grep "^DATABASE_PORT=" "$ENV_FILE" | cut -d'=' -f2)
                NAME=$(grep "^DATABASE_NAME=" "$ENV_FILE" | cut -d'=' -f2)
                USER=$(grep "^DATABASE_USERNAME=" "$ENV_FILE" | cut -d'=' -f2)
                PASS=$(grep "^DATABASE_PASSWORD=" "$ENV_FILE" | cut -d'=' -f2)
                
                # Add DATABASE_URL at the top of database section
                sed -i.bak "/^# External Database Configuration/a\\
DATABASE_URL=postgresql://$USER:$PASS@$HOST:$PORT/$NAME?sslmode=require" "$ENV_FILE"
            fi
        fi
        
        rm "$ENV_FILE.bak"
        
        print_status "Created $ENV_FILE with localhost URLs"
        print_warning "Please review and update $ENV_FILE with your local testing values"
    else
        print_error "Neither $ENV_FILE nor .env.production found!"
        print_error "Please create $ENV_FILE first"
        exit 1
    fi
fi

# Execute commands
case $COMMAND in
    up)
        print_step "Starting services: $SERVICES"
        if [ -n "$BUILD_FLAG" ]; then
            print_status "Building images..."
        fi
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up $BUILD_FLAG -d $SERVICES
        
        print_status "Services started successfully!"
        echo ""
        echo -e "${GREEN}Access your applications:${NC}"
        if [[ "$SERVICES" == *"strapi-app"* ]]; then
            echo -e "  🚀 Strapi Admin: ${BLUE}http://localhost:1337/admin${NC}"
            echo -e "  📡 Strapi API: ${BLUE}http://localhost:1337${NC}"
        fi
        if [[ "$SERVICES" == *"ui-app"* ]]; then
            echo -e "  🌐 UI Application: ${BLUE}http://localhost:3000${NC}"
        fi
        echo ""
        echo -e "${YELLOW}View logs with: $0 logs${NC}"
        echo -e "${YELLOW}Stop services with: $0 down${NC}"
        ;;
    down)
        print_step "Stopping services..."
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
        print_status "Services stopped"
        ;;
    restart)
        print_step "Restarting services: $SERVICES"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart $SERVICES
        print_status "Services restarted"
        ;;
    logs)
        print_step "Viewing logs for: $SERVICES"
        if [ -n "$FOLLOW_LOGS" ]; then
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f $SERVICES
        else
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail=50 $SERVICES
        fi
        ;;
    build)
        print_step "Building images for: $SERVICES"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build $SERVICES
        print_status "Build complete"
        ;;
    clean)
        print_step "Cleaning up all containers, volumes, and images..."
        print_warning "This will remove all local production containers, volumes, and images!"
        echo -e "${YELLOW}Continue? (y/N):${NC}"
        read -r confirm
        
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            # Stop and remove containers
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down -v --remove-orphans
            
            # Remove images
            docker images | grep -E "(cabernai|strapi|ui)" | awk '{print $3}' | xargs -r docker rmi -f
            
            # Clean up Docker system
            docker system prune -f
            
            print_status "Cleanup complete"
        else
            print_status "Cleanup cancelled"
        fi
        ;;
esac

# Show status if up command was used
if [ "$COMMAND" = "up" ]; then
    echo ""
    print_step "Container Status:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
fi