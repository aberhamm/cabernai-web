#!/bin/bash

# DigitalOcean Ubuntu Droplet Setup Script
# Run this script on a fresh Ubuntu 22.04 droplet

set -e

# Configuration
DEPLOY_USER="deploy"
PROJECT_NAME="cabernai-web"
NODE_VERSION="20"

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

setup_system() {
    echo_info "Updating system packages..."
    apt update && apt upgrade -y

    echo_info "Installing essential packages..."
    apt install -y \
        curl \
        wget \
        git \
        vim \
        htop \
        ufw \
        fail2ban \
        unattended-upgrades \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        rsync
}

setup_firewall() {
    echo_info "Configuring firewall..."
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable

    echo_info "Firewall rules:"
    ufw status
}

setup_fail2ban() {
    echo_info "Configuring fail2ban..."
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

    systemctl enable fail2ban
    systemctl restart fail2ban
}

setup_docker() {
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

    echo_info "Docker version: $(docker --version)"
    echo_info "Docker Compose version: $(docker-compose --version)"
}

setup_user() {
    echo_info "Creating deploy user..."

    # Create deploy user
    useradd -m -s /bin/bash $DEPLOY_USER
    usermod -aG docker $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER

    # Configure passwordless sudo for deploy user
    echo_info "Configuring passwordless sudo for deploy user..."
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
    chmod 0440 /etc/sudoers.d/$DEPLOY_USER

    # Set up SSH key for deploy user (you'll need to add your public key)
    mkdir -p /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh

    echo_warn "Please add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
    echo_warn "Run: echo 'your-ssh-public-key' >> /home/$DEPLOY_USER/.ssh/authorized_keys"

    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys

    echo_info "✓ Deploy user configured with passwordless sudo"
}

setup_node() {
    echo_info "Installing Node.js $NODE_VERSION..."

    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs

    # Install Yarn
    npm install -g yarn

    echo_info "Node.js version: $(node --version)"
    echo_info "Yarn version: $(yarn --version)"
}

setup_ssl() {
    echo_info "Installing Certbot for SSL certificates..."

    # Install Certbot
    apt install -y certbot python3-certbot-nginx

    echo_warn "After deployment, run:"
    echo_warn "certbot --nginx -d your-domain.com -d www.your-domain.com"
}

setup_monitoring() {
    echo_info "Setting up basic monitoring..."

    # Install htop, iotop, netstat
    apt install -y htop iotop net-tools

    # Set up log rotation for Docker
    cat > /etc/logrotate.d/docker-container << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
}

setup_project_directory() {
    echo_info "Setting up project directory..."

    # Create project directory
    mkdir -p /opt/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /opt/$PROJECT_NAME

    # Create logs directory
    mkdir -p /var/log/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /var/log/$PROJECT_NAME
}

setup_systemd_service() {
    echo_info "Setting up systemd service..."

    cat > /etc/systemd/system/$PROJECT_NAME.service << EOF
[Unit]
Description=$PROJECT_NAME Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/$PROJECT_NAME
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$DEPLOY_USER
Group=$DEPLOY_USER

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable $PROJECT_NAME.service
}

setup_backup_script() {
    echo_info "Setting up backup script..."

    cat > /opt/$PROJECT_NAME/backup.sh << 'EOF'
#!/bin/bash

# Backup script for cabernai-web
# This script backs up uploaded files and database

BACKUP_DIR="/opt/backups"
PROJECT_NAME="cabernai-web"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Starting backup at $(date)"

# Backup uploaded files (if using local storage)
if [[ -d "/opt/$PROJECT_NAME/uploads" ]]; then
    echo "Backing up uploaded files..."
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /opt/$PROJECT_NAME uploads/
fi

# Note: Supabase handles database backups automatically
echo "Database is backed up automatically by Supabase"

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
EOF

    chmod +x /opt/$PROJECT_NAME/backup.sh
    chown $DEPLOY_USER:$DEPLOY_USER /opt/$PROJECT_NAME/backup.sh

    # Add to crontab for deploy user
    echo "0 2 * * * /opt/$PROJECT_NAME/backup.sh >> /var/log/$PROJECT_NAME/backup.log 2>&1" | crontab -u $DEPLOY_USER -
}

optimize_system() {
    echo_info "Optimizing system for production..."

    # Increase file limits
    cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
EOF

    # Optimize sysctl
    cat >> /etc/sysctl.conf << EOF
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 5000
EOF

    sysctl -p
}

# Main setup sequence
main() {
    echo_info "Starting DigitalOcean droplet setup..."

    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        echo_error "This script must be run as root"
        exit 1
    fi

    setup_system
    setup_firewall
    setup_fail2ban
    setup_docker
    setup_node
    setup_ssl
    setup_monitoring
    setup_user
    setup_project_directory
    setup_systemd_service
    setup_backup_script
    optimize_system

    echo_info "Droplet setup completed!"
    echo_warn "Next steps:"
    echo_warn "1. Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
    echo_warn "2. Copy your project files to /opt/$PROJECT_NAME/"
    echo_warn "3. Copy .env.production to /opt/$PROJECT_NAME/.env and configure it"
    echo_warn "4. Run deployment: ./scripts/deploy/deploy.sh production"
    echo_warn "5. Set up SSL: certbot --nginx -d your-domain.com"
    echo ""
    echo_info "✅ Deploy user has passwordless sudo configured for GitHub Actions"
}

main "$@"
