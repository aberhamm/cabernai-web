#!/bin/bash

# Setup script for existing DigitalOcean droplets
# This script safely adds Cabernai Web to a droplet with existing sites
# Run this script on your existing droplet

set -e

# Configuration
DEPLOY_USER="deploy"
PROJECT_NAME="cabernai-web"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

check_system() {
    echo_step "Checking existing system..."

    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        echo_error "This script must be run as root"
        exit 1
    fi

    # Check Ubuntu version
    if ! grep -q "Ubuntu" /etc/os-release; then
        echo_warn "This script is designed for Ubuntu. Proceeding anyway..."
    fi

    # Check existing services
    echo_info "Checking existing services..."

    if systemctl is-active --quiet nginx; then
        echo_info "✓ Nginx is running"
        NGINX_EXISTS=true
    else
        echo_info "Nginx not running - will install if needed"
        NGINX_EXISTS=false
    fi

    if systemctl is-active --quiet apache2; then
        echo_warn "Apache2 detected - this may conflict with nginx"
        APACHE_EXISTS=true
    else
        APACHE_EXISTS=false
    fi

    if command -v docker &> /dev/null; then
        echo_info "✓ Docker is installed"
        DOCKER_EXISTS=true
    else
        echo_info "Docker not found - will install"
        DOCKER_EXISTS=false
    fi

    # Check port availability
    echo_info "Checking port availability..."

    if netstat -tulpn | grep :3000 > /dev/null; then
        echo_error "Port 3000 is already in use!"
        echo "Please stop the service using port 3000 first"
        exit 1
    fi

    if netstat -tulpn | grep :1337 > /dev/null; then
        echo_error "Port 1337 is already in use!"
        echo "Please stop the service using port 1337 first"
        exit 1
    fi

    echo_info "✓ Required ports (3000, 1337) are available"
}

install_missing_dependencies() {
    echo_step "Installing missing dependencies..."

    # Update package list
    apt update

    # Install essential packages if missing
    PACKAGES_TO_INSTALL=""

    if ! command -v curl &> /dev/null; then
        PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL curl"
    fi

    if ! command -v git &> /dev/null; then
        PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL git"
    fi

    if ! command -v rsync &> /dev/null; then
        PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL rsync"
    fi

    if [[ -n "$PACKAGES_TO_INSTALL" ]]; then
        echo_info "Installing: $PACKAGES_TO_INSTALL"
        apt install -y $PACKAGES_TO_INSTALL
    fi

    # Install Docker if not present
    if [[ "$DOCKER_EXISTS" == false ]]; then
        echo_info "Installing Docker..."

        # Add Docker's official GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

        # Add Docker repository
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

        # Install Docker
        apt update
        apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

        # Install Docker Compose (standalone)
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose

        # Start and enable Docker
        systemctl start docker
        systemctl enable docker

        echo_info "✓ Docker installed successfully"
    fi

    # Install nginx if not present
    if [[ "$NGINX_EXISTS" == false ]]; then
        echo_info "Installing nginx..."
        apt install -y nginx
        systemctl start nginx
        systemctl enable nginx
        echo_info "✓ Nginx installed successfully"
    fi

    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo_info "Installing certbot..."
        apt install -y certbot python3-certbot-nginx
        echo_info "✓ Certbot installed successfully"
    fi
}

setup_deploy_user() {
    echo_step "Setting up deploy user..."

    # Check if deploy user exists
    if id "$DEPLOY_USER" &>/dev/null; then
        echo_info "Deploy user already exists"
    else
        echo_info "Creating deploy user..."
        useradd -m -s /bin/bash $DEPLOY_USER
        echo_info "✓ Deploy user created"
    fi

    # Add to necessary groups
    usermod -aG docker $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER

    # Configure passwordless sudo for deploy user
    echo_info "Configuring passwordless sudo for deploy user..."
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
    chmod 0440 /etc/sudoers.d/$DEPLOY_USER

    # Set up SSH directory
    mkdir -p /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    chown $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

    # Create authorized_keys file if it doesn't exist
    touch /home/$DEPLOY_USER/.ssh/authorized_keys
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
    chown $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh/authorized_keys

    echo_info "✓ Deploy user configured with passwordless sudo"
    echo_warn "Don't forget to add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
}

setup_project_directory() {
    echo_step "Setting up project directory..."

    # Create project directory
    mkdir -p /opt/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /opt/$PROJECT_NAME

    # Create logs directory
    mkdir -p /var/log/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /var/log/$PROJECT_NAME

    echo_info "✓ Project directories created"
}

setup_systemd_service() {
    echo_step "Setting up systemd service..."

    cat > /etc/systemd/system/$PROJECT_NAME.service << EOF
[Unit]
Description=$PROJECT_NAME Application
Requires=docker.service
After=docker.service network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/$PROJECT_NAME
ExecStart=/usr/local/bin/docker-compose -f docker-compose.multi-site.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.multi-site.yml down
TimeoutStartSec=300
User=$DEPLOY_USER
Group=$DEPLOY_USER
Environment=COMPOSE_HTTP_TIMEOUT=300

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable $PROJECT_NAME.service

    echo_info "✓ Systemd service configured"
}

configure_firewall() {
    echo_step "Configuring firewall..."

    # Check if ufw is active
    if ufw status | grep -q "Status: active"; then
        echo_info "UFW is active - checking rules..."

        # Ensure HTTP and HTTPS are allowed
        ufw allow 80/tcp
        ufw allow 443/tcp

        echo_info "✓ Firewall rules updated"
    else
        echo_warn "UFW is not active - skipping firewall configuration"
        echo_warn "Make sure ports 80 and 443 are accessible"
    fi
}

setup_log_rotation() {
    echo_step "Setting up log rotation..."

    # Docker container log rotation
    if [[ ! -f /etc/logrotate.d/docker-container ]]; then
        cat > /etc/logrotate.d/docker-container << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF
        echo_info "✓ Docker log rotation configured"
    fi

    # Application log rotation
    cat > /etc/logrotate.d/$PROJECT_NAME << EOF
/var/log/$PROJECT_NAME/*.log {
    rotate 14
    daily
    compress
    missingok
    delaycompress
    create 644 $DEPLOY_USER $DEPLOY_USER
}
EOF

    echo_info "✓ Application log rotation configured"
}

create_backup_script() {
    echo_step "Creating backup script..."

    cat > /opt/$PROJECT_NAME/backup.sh << 'EOF'
#!/bin/bash

# Backup script for cabernai-web (multi-site deployment)
BACKUP_DIR="/opt/backups"
PROJECT_NAME="cabernai-web"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Starting backup at $(date)"

# Backup Docker volumes
if docker volume ls | grep -q cabernai_strapi_uploads; then
    echo "Backing up Strapi uploads..."
    docker run --rm -v cabernai_strapi_uploads:/source -v $BACKUP_DIR:/backup alpine tar czf /backup/strapi_uploads_$DATE.tar.gz -C /source .
fi

# Backup environment file
if [[ -f "/opt/$PROJECT_NAME/.env" ]]; then
    cp /opt/$PROJECT_NAME/.env $BACKUP_DIR/env_$DATE.backup
fi

# Note: Database is backed up automatically by Supabase
echo "Database is backed up automatically by Supabase"

# Clean old backups (keep last 14 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +14 -delete
find $BACKUP_DIR -name "*.backup" -mtime +14 -delete

echo "Backup completed at $(date)"
EOF

    chmod +x /opt/$PROJECT_NAME/backup.sh
    chown $DEPLOY_USER:$DEPLOY_USER /opt/$PROJECT_NAME/backup.sh

    # Add to crontab for deploy user
    (crontab -u $DEPLOY_USER -l 2>/dev/null; echo "0 3 * * * /opt/$PROJECT_NAME/backup.sh >> /var/log/$PROJECT_NAME/backup.log 2>&1") | crontab -u $DEPLOY_USER -

    echo_info "✓ Backup script configured"
}

check_conflicts() {
    echo_step "Checking for potential conflicts..."

    # Check nginx configuration
    if [[ -f /etc/nginx/sites-enabled/default ]]; then
        echo_warn "Default nginx site is enabled"
        echo_warn "Consider disabling it if it conflicts: sudo rm /etc/nginx/sites-enabled/default"
    fi

    # Check for existing proxy configurations
    if grep -r "proxy_pass.*:3000" /etc/nginx/sites-* 2>/dev/null; then
        echo_warn "Found existing nginx proxy to port 3000 - this may conflict"
    fi

    if grep -r "proxy_pass.*:1337" /etc/nginx/sites-* 2>/dev/null; then
        echo_warn "Found existing nginx proxy to port 1337 - this may conflict"
    fi

    # Check Docker networks
    if docker network ls | grep -q cabernai; then
        echo_warn "Cabernai Docker network already exists"
    fi
}

main() {
    echo_info "Setting up existing droplet for Cabernai Web..."
    echo_info "============================================="

    check_system
    install_missing_dependencies
    setup_deploy_user
    setup_project_directory
    setup_systemd_service
    configure_firewall
    setup_log_rotation
    create_backup_script
    check_conflicts

    echo ""
    echo_info "Setup completed successfully!"
    echo_warn "Next steps:"
    echo_warn "1. Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
    echo_warn "2. Copy your project files to /opt/$PROJECT_NAME/"
    echo_warn "3. Configure your .env file in /opt/$PROJECT_NAME/"
    echo_warn "4. Run deployment: ./scripts/deploy/deploy-multi-site.sh production"
    echo_warn "5. Set up SSL certificates for your domains"
    echo ""
    echo_info "✅ Deploy user has passwordless sudo configured for GitHub Actions"
    echo_info "The system is now ready for Cabernai Web deployment alongside your existing sites!"
}

main "$@"
