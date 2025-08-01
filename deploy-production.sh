#!/bin/bash

# Production Deployment Script
# Complete deployment solution for Digital Ocean droplets
# Handles first-time setup, SSL certificates, and application deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Update these for your deployment
PROJECT_NAME="cabernai-web-v2"
DOMAINS=("cabernai.io www.cabernai.io" "api.cabernai.io")
SSL_EMAIL="admin@cabernai.io"
GITHUB_REPO="https://github.com/your-username/cabernai-web-v2.git"

# Deployment paths
PROJECT_DIR="/opt/apps/$PROJECT_NAME"
BACKUP_DIR="/opt/backups/$PROJECT_NAME"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                       Production Deployment Script                            ║${NC}"
echo -e "${BLUE}║                          $PROJECT_NAME                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════════╝${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Function to check if this is first-time setup
is_first_time() {
    [ ! -d "$PROJECT_DIR" ]
}

# Function to setup server (first-time only)
setup_server() {
    echo -e "\n${GREEN}=== First-Time Server Setup ===${NC}"
    
    # Update system
    echo "Updating system packages..."
    apt update && apt upgrade -y
    
    # Install required packages
    echo "Installing required packages..."
    apt install -y curl wget git docker.io docker-compose nginx certbot python3-certbot-nginx ufw
    
    # Setup firewall
    echo "Configuring firewall..."
    ufw --force enable
    ufw allow ssh
    ufw allow http
    ufw allow https
    
    # Start and enable Docker
    echo "Starting Docker service..."
    systemctl start docker
    systemctl enable docker
    
    # Create project directories
    echo "Creating project directories..."
    mkdir -p "$PROJECT_DIR"
    mkdir -p "$BACKUP_DIR"
    
    echo -e "${GREEN}✓ Server setup complete${NC}"
}

# Function to clone/update project
setup_project() {
    echo -e "\n${GREEN}=== Project Setup ===${NC}"
    
    if [ -d "$PROJECT_DIR/.git" ]; then
        echo "Updating existing project..."
        cd "$PROJECT_DIR"
        git pull origin main
    else
        echo "Cloning project..."
        git clone "$GITHUB_REPO" "$PROJECT_DIR"
        cd "$PROJECT_DIR"
    fi
    
    # Copy environment files if they don't exist
    if [ ! -f ".env.production" ]; then
        echo -e "${YELLOW}Creating .env.production file...${NC}"
        echo -e "${BLUE}IMPORTANT: Configure your external database settings in this file${NC}"
        cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production

# External Database Configuration
# Option 1: Connection String (Recommended)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ompkcxbssxfweeqwdibt.supabase.co:5432/postgres?sslmode=require
DATABASE_SCHEMA=strapi_cabernai_web  # Required: specify schema name (even when using connection string)

# Option 2: Individual Parameters (use if not using DATABASE_URL)
DATABASE_HOST=your-external-db-host.com
DATABASE_PORT=5432
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_secure_db_password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
DATABASE_SCHEMA=strapi_cabernai_web

# Strapi Configuration
APP_KEYS=\${APP_KEYS}
API_TOKEN_SALT=\${API_TOKEN_SALT}
ADMIN_JWT_SECRET=\${ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=\${TRANSFER_TOKEN_SALT}
JWT_SECRET=\${JWT_SECRET}

# Public URLs
APP_PUBLIC_URL=https://cabernai.io
STRAPI_URL=https://api.cabernai.io
STRAPI_REST_READONLY_API_KEY=\${STRAPI_REST_READONLY_API_KEY}

# NextAuth Configuration
NEXTAUTH_URL=https://cabernai.io
NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}

# Build Configuration
NEXT_OUTPUT=standalone
EOF
        
        echo -e "${RED}IMPORTANT: You need to update .env.production with your actual values:${NC}"
        echo "  - Configure your external database connection (DATABASE_URL or individual parameters)"
        echo "  - Generate secure values for APP_KEYS, API_TOKEN_SALT, etc."
        echo "  - Configure your API keys"
        echo ""
        echo -e "${YELLOW}IMPORTANT: This deployment now uses external database.${NC}"
        echo -e "${YELLOW}Make sure your external database is set up and accessible.${NC}"
        echo ""
        echo "Edit the file: nano $PROJECT_DIR/.env.production"
        echo "Press Enter when ready to continue..."
        read
    fi
    
    echo -e "${GREEN}✓ Project setup complete${NC}"
}

# Function to test domain accessibility
test_domains() {
    echo -e "\n${GREEN}=== Domain Accessibility Test ===${NC}"
    
    local all_accessible=true
    
    for domain_group in "${DOMAINS[@]}"; do
        for domain in $domain_group; do
            echo -n "Testing $domain... "
            if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://$domain" | grep -q "200\|301\|302\|404"; then
                echo -e "${GREEN}OK${NC}"
            else
                echo -e "${RED}FAILED${NC}"
                all_accessible=false
            fi
        done
    done
    
    if [ "$all_accessible" = false ]; then
        echo -e "\n${RED}✗ Some domains are not accessible${NC}"
        echo -e "${YELLOW}Please ensure:${NC}"
        echo "  1. DNS records point to this server's IP"
        echo "  2. Domain registrar settings are correct"
        echo "  3. Allow time for DNS propagation"
        echo ""
        echo "Test DNS with: dig cabernai.io && dig api.cabernai.io"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All domains are accessible${NC}"
}

# Function to setup initial HTTP configurations
setup_http_configs() {
    echo -e "\n${GREEN}=== HTTP Configuration Setup ===${NC}"
    
    local nginx_dir="$PROJECT_DIR/docker/nginx/sites-enabled"
    
    # Create HTTP-only config for main site
    cat > "$nginx_dir/cabernai.io" << 'EOF'
server {
    listen 80;
    server_name cabernai.io www.cabernai.io;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location /_next/static/ {
        proxy_pass http://ui-app:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/strapi/ {
        proxy_pass http://strapi-app:1337/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://ui-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

    # Create HTTP-only config for API
    cat > "$nginx_dir/api.cabernai.io" << 'EOF'
server {
    listen 80;
    server_name api.cabernai.io;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://strapi-app:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF
    
    echo -e "${GREEN}✓ HTTP configurations created${NC}"
}

# Function to build and start application
start_application() {
    echo -e "\n${GREEN}=== Application Deployment ===${NC}"
    
    cd "$PROJECT_DIR"
    
    # Build and start containers
    echo "Building and starting application..."
    docker-compose -f docker-compose.production.yml --env-file .env.production up -d --build
    
    # Wait for services to be ready
    echo "Waiting for services to start..."
    sleep 30
    
    # Check container health
    echo "Checking container status..."
    docker-compose -f docker-compose.production.yml --env-file .env.production ps
    
    echo -e "${GREEN}✓ Application started${NC}"
}

# Function to generate SSL certificates
generate_ssl_certificates() {
    echo -e "\n${GREEN}=== SSL Certificate Generation ===${NC}"
    
    local data_path="/var/lib/docker/volumes/${PROJECT_NAME}_nginx_certs/_data"
    local webroot_path="/var/lib/docker/volumes/${PROJECT_NAME}_nginx_webroot/_data"
    
    # Create directory structure
    mkdir -p "$data_path"
    
    # Download TLS parameters
    if [ ! -e "$data_path/options-ssl-nginx.conf" ]; then
        echo "Downloading TLS parameters..."
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/options-ssl-nginx.conf"
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/ssl-dhparams.pem"
    fi
    
    cd "$PROJECT_DIR"
    
    # Test webroot accessibility
    echo "Testing webroot accessibility..."
    docker-compose -f docker-compose.production.yml --env-file .env.production exec -T nginx sh -c 'echo "test" > /var/www/certbot/test.txt'
    
    if ! curl -s http://cabernai.io/test.txt | grep -q "test"; then
        echo -e "${RED}✗ Webroot test failed${NC}"
        exit 1
    fi
    
    docker-compose -f docker-compose.production.yml --env-file .env.production exec -T nginx rm -f /var/www/certbot/test.txt
    
    # Generate certificates for each domain group
    for domain_group in "${DOMAINS[@]}"; do
        echo "Generating certificate for: $domain_group"
        
        # Parse domain arguments
        domain_args=""
        for domain in $domain_group; do
            domain_args="$domain_args -d $domain"
        done
        
        # Run certbot
        docker run --rm --name certbot \
            -v "$data_path:/etc/letsencrypt" \
            -v "$webroot_path:/var/www/certbot" \
            certbot/certbot:latest \
            certonly --webroot -w /var/www/certbot \
            --email "$SSL_EMAIL" \
            $domain_args \
            --rsa-key-size 4096 \
            --agree-tos \
            --non-interactive \
            --force-renewal
    done
    
    echo -e "${GREEN}✓ SSL certificates generated${NC}"
}

# Function to setup HTTPS configurations
setup_https_configs() {
    echo -e "\n${GREEN}=== HTTPS Configuration Setup ===${NC}"
    
    local nginx_dir="$PROJECT_DIR/docker/nginx/sites-enabled"
    
    # Create HTTPS config for main site
    cat > "$nginx_dir/cabernai.io" << 'EOF'
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name cabernai.io www.cabernai.io;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server for UI app
server {
    listen 443 ssl;
    http2 on;
    server_name cabernai.io www.cabernai.io;

    ssl_certificate /etc/letsencrypt/live/cabernai.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cabernai.io/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location /_next/static/ {
        proxy_pass http://ui-app:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/strapi/ {
        proxy_pass http://strapi-app:1337/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://ui-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

    # Create HTTPS config for API
    cat > "$nginx_dir/api.cabernai.io" << 'EOF'
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name api.cabernai.io;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server for Strapi API
server {
    listen 443 ssl;
    http2 on;
    server_name api.cabernai.io;

    ssl_certificate /etc/letsencrypt/live/api.cabernai.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cabernai.io/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;

    location ~ ^/.*$ {
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Max-Age 86400;
            add_header Content-Type "text/plain charset=UTF-8";
            add_header Content-Length 0;
            return 204;
        }

        proxy_pass http://strapi-app:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF
    
    # Restart nginx with new configs
    echo "Restarting nginx with HTTPS configuration..."
    cd "$PROJECT_DIR"
    docker-compose -f docker-compose.production.yml --env-file .env.production restart nginx
    
    echo -e "${GREEN}✓ HTTPS configurations applied${NC}"
}

# Function to setup certificate renewal
setup_certificate_renewal() {
    echo -e "\n${GREEN}=== Certificate Renewal Setup ===${NC}"
    
    # Create renewal script
    cat > /root/renew-ssl-certificates.sh << EOF
#!/bin/bash
set -e

PROJECT_DIR="$PROJECT_DIR"
COMPOSE_FILE="\$PROJECT_DIR/docker-compose.production.yml"
ENV_FILE="\$PROJECT_DIR/.env.production"
LOG_FILE="/var/log/ssl-renewal.log"

log_message() {
    echo "\$(date '+%Y-%m-%d %H:%M:%S') - \$1" | tee -a "\$LOG_FILE"
}

log_message "Starting SSL certificate renewal process"

cd "\$PROJECT_DIR"

docker run --rm \\
    -v "/var/lib/docker/volumes/${PROJECT_NAME}_nginx_certs/_data:/etc/letsencrypt" \\
    -v "/var/lib/docker/volumes/${PROJECT_NAME}_nginx_webroot/_data:/var/www/certbot" \\
    certbot/certbot:latest \\
    renew --quiet --webroot --webroot-path=/var/www/certbot

if [ \$? -eq 0 ]; then
    log_message "Certificate renewal successful"
    docker-compose -f "\$COMPOSE_FILE" --env-file "\$ENV_FILE" exec -T nginx nginx -s reload
    log_message "Nginx reloaded successfully"
else
    log_message "ERROR: Certificate renewal failed"
    exit 1
fi
EOF
    
    chmod +x /root/renew-ssl-certificates.sh
    
    # Set up cron job
    CRON_JOB="0 2,14 * * * /root/renew-ssl-certificates.sh"
    if ! crontab -l 2>/dev/null | grep -q "renew-ssl-certificates.sh"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        echo "✓ Added automatic renewal cron job"
    else
        echo "✓ Renewal cron job already exists"
    fi
    
    echo -e "${GREEN}✓ Certificate renewal configured${NC}"
}

# Function to test final deployment
test_deployment() {
    echo -e "\n${GREEN}=== Deployment Testing ===${NC}"
    
    # Test HTTPS connectivity
    local all_working=true
    
    for domain_group in "${DOMAINS[@]}"; do
        for domain in $domain_group; do
            echo -n "Testing https://$domain... "
            if curl -s -o /dev/null -w "%{http_code}" --max-time 10 --insecure "https://$domain" | grep -q "200\|301\|302"; then
                echo -e "${GREEN}OK${NC}"
            else
                echo -e "${RED}FAILED${NC}"
                all_working=false
            fi
        done
    done
    
    if [ "$all_working" = true ]; then
        echo -e "\n${GREEN}🎉 Deployment successful!${NC}"
        echo ""
        echo -e "${GREEN}Your sites are live:${NC}"
        echo "  • https://cabernai.io"
        echo "  • https://api.cabernai.io"
        echo "  • https://api.cabernai.io/admin"
        echo ""
        echo -e "${GREEN}✅ Features configured:${NC}"
        echo "  • SSL certificates (auto-renewal enabled)"
        echo "  • HTTP to HTTPS redirects"
        echo "  • Docker containerized deployment"
        echo "  • Nginx reverse proxy"
        echo ""
        echo -e "${GREEN}Next steps:${NC}"
        echo "  1. Set up your Strapi admin account"
        echo "  2. Configure your application content"
        echo "  3. Test all functionality"
    else
        echo -e "\n${YELLOW}⚠ Deployment completed with issues${NC}"
        echo "Some endpoints may need additional configuration."
    fi
}

# Main deployment flow
main() {
    if is_first_time; then
        echo -e "${YELLOW}First-time deployment detected${NC}"
        setup_server
    else
        echo -e "${YELLOW}Updating existing deployment${NC}"
    fi
    
    setup_project
    test_domains
    setup_http_configs
    start_application
    generate_ssl_certificates
    setup_https_configs
    setup_certificate_renewal
    test_deployment
    
    echo -e "\n${GREEN}=== Deployment Complete ===${NC}"
}

# Run main function
main "$@"