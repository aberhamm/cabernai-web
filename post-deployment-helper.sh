#!/bin/bash

# Post-Deployment Helper Script
# Assists with common post-deployment tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/apps/cabernai-web-v2"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.production.yml"
ENV_FILE="$PROJECT_DIR/.env.production"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                         Post-Deployment Helper                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════════╝${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Project directory not found: $PROJECT_DIR${NC}"
    echo "Please run the deployment script first."
    exit 1
fi

cd "$PROJECT_DIR"

echo -e "\n${GREEN}Available post-deployment tasks:${NC}"
echo "1. Import database seed data"
echo "2. Update API token in environment"
echo "3. Restart services"
echo "4. Check service status"
echo "5. View service logs"
echo "6. Test HTTPS connectivity"
echo "7. Show important URLs"
echo "8. Rebuild Strapi (after import or schema changes)"
echo "0. Exit"

while true; do
    echo -e "\n${YELLOW}Select an option (0-8):${NC}"
    read -r choice

    case $choice in
        1)
            echo -e "\n${GREEN}=== Import Database Seed Data ===${NC}"
            if [ -f "apps/strapi/strapi-export.tar.gz" ]; then
                echo "Importing seed data from apps/strapi/strapi-export.tar.gz..."
                echo -e "${YELLOW}Note: This will delete existing data and may show TypeScript compilation warnings.${NC}"
                echo -e "${YELLOW}Press Enter to continue or Ctrl+C to cancel...${NC}"
                read -r
                
                # Fix permissions first by changing ownership of dist and public directories
                echo "Fixing file permissions..."
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T --user root strapi-app chown -R strapi:strapi /app/apps/strapi/dist || true
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T --user root strapi-app chown -R strapi:strapi /app/apps/strapi/public || true
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T --user root strapi-app mkdir -p /app/apps/strapi/public/uploads || true
                
                # Run the import with forced schema updates
                echo "Running import (this may take a moment)..."
                echo -e "${BLUE}Note: Import will use the configured database schema from DATABASE_SCHEMA environment variable.${NC}"
                if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T strapi-app yarn strapi import -f strapi-export.tar.gz --force; then
                    echo -e "${GREEN}✓ Seed data imported successfully${NC}"
                    echo -e "${BLUE}You may need to rebuild types after import.${NC}"
                else
                    echo -e "${YELLOW}⚠ Import completed with warnings/errors${NC}"
                    echo -e "${BLUE}This is normal if there are schema differences.${NC}"
                    echo -e "${BLUE}Check if your content was imported by visiting the admin panel.${NC}"
                fi
            else
                echo -e "${YELLOW}No strapi-export.tar.gz file found in apps/strapi/${NC}"
                echo "Seed data import skipped."
                echo -e "${BLUE}If you have seed data, place it at: apps/strapi/strapi-export.tar.gz${NC}"
            fi
            ;;
        2)
            echo -e "\n${GREEN}=== Update API Token ===${NC}"
            echo "Current STRAPI_REST_READONLY_API_KEY in .env.production:"
            grep "STRAPI_REST_READONLY_API_KEY" "$ENV_FILE" || echo "Not set"
            echo ""
            echo -e "${YELLOW}To update the API token:${NC}"
            echo "1. Go to https://api.cabernai.io/admin"
            echo "2. Navigate to Settings > API Tokens"
            echo "3. Create new Read-only token"
            echo "4. Copy the token"
            echo ""
            echo -e "${YELLOW}Enter new API token (or press Enter to skip):${NC}"
            read -r api_token
            
            if [ -n "$api_token" ]; then
                # Update the API token in .env.production
                if grep -q "STRAPI_REST_READONLY_API_KEY" "$ENV_FILE"; then
                    sed -i "s/STRAPI_REST_READONLY_API_KEY=.*/STRAPI_REST_READONLY_API_KEY=$api_token/" "$ENV_FILE"
                else
                    echo "STRAPI_REST_READONLY_API_KEY=$api_token" >> "$ENV_FILE"
                fi
                echo -e "${GREEN}✓ API token updated${NC}"
                echo -e "${YELLOW}Run option 3 to restart services to apply changes${NC}"
            else
                echo "API token update skipped."
            fi
            ;;
        3)
            echo -e "\n${GREEN}=== Restart Services ===${NC}"
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
            echo -e "${GREEN}✓ Services restarted${NC}"
            ;;
        4)
            echo -e "\n${GREEN}=== Service Status ===${NC}"
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
            ;;
        5)
            echo -e "\n${GREEN}=== Service Logs ===${NC}"
            echo "Available services: ui-app, strapi-app, nginx, db"
            echo -e "${YELLOW}Enter service name (or 'all' for all services):${NC}"
            read -r service
            
            if [ "$service" = "all" ]; then
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail 20
            else
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs "$service" --tail 20
            fi
            ;;
        6)
            echo -e "\n${GREEN}=== Test HTTPS Connectivity ===${NC}"
            
            echo -n "Testing https://cabernai.io... "
            if curl -s -o /dev/null -w "%{http_code}" --max-time 10 --insecure https://cabernai.io | grep -q "200\|301\|302"; then
                echo -e "${GREEN}OK${NC}"
            else
                echo -e "${RED}FAILED${NC}"
            fi
            
            echo -n "Testing https://api.cabernai.io... "
            if curl -s -o /dev/null -w "%{http_code}" --max-time 10 --insecure https://api.cabernai.io | grep -q "200\|301\|302"; then
                echo -e "${GREEN}OK${NC}"
            else
                echo -e "${RED}FAILED${NC}"
            fi
            ;;
        7)
            echo -e "\n${GREEN}=== Important URLs ===${NC}"
            echo -e "${BLUE}🌐 Your Sites:${NC}"
            echo "  • Main site: https://cabernai.io"
            echo "  • API: https://api.cabernai.io"
            echo "  • Admin panel: https://api.cabernai.io/admin"
            echo ""
            echo -e "${BLUE}📋 Next Steps:${NC}"
            echo "  1. Visit the admin panel to create your account"
            echo "  2. Go to Settings > Config Sync > Tools and click 'Import'"
            echo "  3. Go to Settings > API Tokens to create API tokens"
            echo "  4. Use option 2 above to update the API token"
            ;;
        8)
            echo -e "\n${GREEN}=== Rebuild Strapi ===${NC}"
            echo "This will rebuild Strapi to fix TypeScript compilation issues after import."
            echo -e "${YELLOW}This will temporarily stop the Strapi service. Continue? (y/N):${NC}"
            read -r rebuild_confirm
            
            if [[ "$rebuild_confirm" =~ ^[Yy]$ ]]; then
                echo "Stopping Strapi service..."
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop strapi-app
                
                echo "Rebuilding Strapi container..."
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build strapi-app
                
                echo "Starting Strapi service..."
                docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" start strapi-app
                
                echo "Waiting for service to start..."
                sleep 10
                
                echo -e "${GREEN}✓ Strapi rebuilt and restarted${NC}"
                echo "Check service status with option 4 to verify it's running correctly."
            else
                echo "Rebuild cancelled."
            fi
            ;;
        0)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please select 0-8.${NC}"
            ;;
    esac
done