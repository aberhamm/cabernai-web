#!/bin/bash

# Fix common GitHub Actions deployment issues
# Run this script on your DigitalOcean droplet as root

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

check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo_error "This script must be run as root"
        echo "Usage: sudo ./scripts/deploy/fix-github-actions.sh"
        exit 1
    fi
}

fix_passwordless_sudo() {
    echo_step "Fixing passwordless sudo for deploy user..."

    # Check if deploy user exists
    if ! id "$DEPLOY_USER" &>/dev/null; then
        echo_error "Deploy user '$DEPLOY_USER' does not exist!"
        echo "Please run the setup script first:"
        echo "- For single-site: ./scripts/deploy/setup-droplet.sh"
        echo "- For multi-site: ./scripts/deploy/setup-existing-droplet.sh"
        exit 1
    fi

    # Configure passwordless sudo
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
    chmod 0440 /etc/sudoers.d/$DEPLOY_USER

    echo_info "✓ Passwordless sudo configured for $DEPLOY_USER"
}

fix_docker_permissions() {
    echo_step "Fixing Docker permissions for deploy user..."

    # Add deploy user to docker group
    usermod -aG docker $DEPLOY_USER

    echo_info "✓ Deploy user added to docker group"
    echo_warn "Note: User may need to logout/login for group changes to take effect"
}

fix_project_directory() {
    echo_step "Fixing project directory permissions..."

    # Create project directory if it doesn't exist
    mkdir -p /opt/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /opt/$PROJECT_NAME

    # Create logs directory
    mkdir -p /var/log/$PROJECT_NAME
    chown $DEPLOY_USER:$DEPLOY_USER /var/log/$PROJECT_NAME

    echo_info "✓ Project directories configured"
}

test_configuration() {
    echo_step "Testing configuration..."

    # Test passwordless sudo
    if sudo -u $DEPLOY_USER sudo -n true 2>/dev/null; then
        echo_info "✓ Passwordless sudo working"
    else
        echo_error "✗ Passwordless sudo not working"
        return 1
    fi

    # Test docker access
    if sudo -u $DEPLOY_USER docker ps >/dev/null 2>&1; then
        echo_info "✓ Docker access working"
    else
        echo_warn "⚠ Docker access may require logout/login"
    fi

    # Test project directory access
    if sudo -u $DEPLOY_USER test -w /opt/$PROJECT_NAME; then
        echo_info "✓ Project directory writable"
    else
        echo_error "✗ Project directory not writable"
        return 1
    fi
}

main() {
    echo_info "GitHub Actions Deployment Fix Script"
    echo_info "===================================="
    echo ""

    check_root
    fix_passwordless_sudo
    fix_docker_permissions
    fix_project_directory

    echo ""
    echo_step "Testing configuration..."
    if test_configuration; then
        echo ""
        echo_info "🎉 All fixes applied successfully!"
        echo_info "Your GitHub Actions deployment should now work."
        echo ""
        echo_warn "Next steps:"
        echo_warn "1. Trigger your GitHub Actions workflow again"
        echo_warn "2. If using manual SSH, logout and login to refresh group membership"
    else
        echo ""
        echo_error "Some issues remain. Please check the errors above."
        exit 1
    fi
}

main "$@"
