#!/bin/bash

# SSH Connection Testing Script
# Usage: ./scripts/utils/test-ssh-connection.sh [host] [user]

set -e

# Default values
DEFAULT_HOST=""
DEFAULT_USER="deploy"

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

show_usage() {
    echo "SSH Connection Testing Script"
    echo "Usage: $0 [host] [user]"
    echo ""
    echo "Examples:"
    echo "  $0 159.203.146.14 deploy"
    echo "  $0 your-server.com root"
    echo ""
    echo "This script will test:"
    echo "  - Basic network connectivity"
    echo "  - SSH port accessibility"
    echo "  - SSH key authentication"
    echo "  - Server configuration"
}

test_basic_connectivity() {
    local host=$1
    echo_step "Testing basic network connectivity to $host..."

    # Test ping
    if timeout 10 ping -c 3 "$host" >/dev/null 2>&1; then
        echo_info "✓ Host is reachable (ping successful)"
    else
        echo_warn "✗ Host ping failed (may be normal if ICMP is blocked)"
    fi

    # Test port 22
    echo_step "Testing SSH port (22) accessibility..."
    if timeout 10 nc -zv "$host" 22 2>/dev/null; then
        echo_info "✓ Port 22 is open and accessible"
    else
        echo_error "✗ Port 22 is not accessible"
        echo_error "Possible causes:"
        echo_error "  - SSH service is not running"
        echo_error "  - Firewall is blocking port 22"
        echo_error "  - Server is down"
        return 1
    fi
}

test_ssh_keyscan() {
    local host=$1
    echo_step "Testing SSH host key retrieval..."

    if timeout 30 ssh-keyscan -H "$host" >/dev/null 2>&1; then
        echo_info "✓ SSH host key retrieved successfully"
        echo_info "Host key fingerprint:"
        ssh-keyscan "$host" 2>/dev/null | ssh-keygen -lf - || true
    else
        echo_error "✗ Failed to retrieve SSH host key"
        echo_error "This indicates SSH service issues on the server"
        return 1
    fi
}

test_ssh_connection() {
    local host=$1
    local user=$2
    echo_step "Testing SSH authentication for $user@$host..."

    # Test with batch mode (no password prompts)
    if timeout 30 ssh -o ConnectTimeout=10 -o BatchMode=yes -o StrictHostKeyChecking=no "$user@$host" "echo 'SSH connection successful'" 2>/dev/null; then
        echo_info "✓ SSH authentication successful"
        return 0
    else
        echo_error "✗ SSH authentication failed"
        echo_error "Possible causes:"
        echo_error "  - SSH private key not loaded or incorrect"
        echo_error "  - Public key not in ~/.ssh/authorized_keys on server"
        echo_error "  - User '$user' doesn't exist on server"
        echo_error "  - SSH service configuration issues"
        return 1
    fi
}

test_server_requirements() {
    local host=$1
    local user=$2
    echo_step "Testing server requirements for deployment..."

    if ! timeout 30 ssh -o ConnectTimeout=10 -o BatchMode=yes "$user@$host" "echo 'Connected'" >/dev/null 2>&1; then
        echo_error "✗ Cannot connect to test server requirements"
        return 1
    fi

    echo_info "Testing server configuration..."

    # Test sudo access
    if ssh "$user@$host" "sudo -n echo 'Sudo access OK'" >/dev/null 2>&1; then
        echo_info "✓ User has passwordless sudo access"
    else
        echo_warn "✗ User lacks passwordless sudo access"
        echo_warn "Run: echo '$user ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/$user"
    fi

    # Test Docker
    if ssh "$user@$host" "docker --version" >/dev/null 2>&1; then
        echo_info "✓ Docker is installed"
        DOCKER_VERSION=$(ssh "$user@$host" "docker --version")
        echo_info "  $DOCKER_VERSION"
    else
        echo_warn "✗ Docker not found"
    fi

    # Test Docker Compose
    if ssh "$user@$host" "docker-compose --version" >/dev/null 2>&1; then
        echo_info "✓ Docker Compose is installed"
        COMPOSE_VERSION=$(ssh "$user@$host" "docker-compose --version")
        echo_info "  $COMPOSE_VERSION"
    else
        echo_warn "✗ Docker Compose not found"
    fi

    # Test nginx
    if ssh "$user@$host" "systemctl is-active nginx" >/dev/null 2>&1; then
        echo_info "✓ Nginx is running"
    else
        echo_warn "✗ Nginx not running (required for multi-site deployment)"
    fi

    # Test port availability
    echo_step "Checking port availability..."
    if ssh "$user@$host" "! netstat -tulpn | grep :3000" >/dev/null 2>&1; then
        echo_info "✓ Port 3000 is available"
    else
        echo_warn "✗ Port 3000 is in use"
    fi

    if ssh "$user@$host" "! netstat -tulpn | grep :1337" >/dev/null 2>&1; then
        echo_info "✓ Port 1337 is available"
    else
        echo_warn "✗ Port 1337 is in use"
    fi

    # Test disk space
    DISK_USAGE=$(ssh "$user@$host" "df -h /opt | tail -1 | awk '{print \$5}' | sed 's/%//'" 2>/dev/null || echo "unknown")
    if [[ "$DISK_USAGE" != "unknown" ]] && [[ "$DISK_USAGE" -lt 80 ]]; then
        echo_info "✓ Sufficient disk space available ($DISK_USAGE% used)"
    else
        echo_warn "✗ Disk space may be low ($DISK_USAGE% used)"
    fi
}

show_github_actions_debug() {
    local host=$1
    local user=$2
    echo_step "GitHub Actions debugging information..."
    echo ""
    echo "If this is for GitHub Actions deployment, ensure these secrets are set:"
    echo ""
    echo "Repository Secrets:"
    echo "  DROPLET_HOST = $host"
    echo "  SSH_PRIVATE_KEY = [your private key content]"
    echo ""
    echo "Repository Variables:"
    echo "  DOMAIN_NAME = [your domain]"
    echo ""
    echo "The SSH_PRIVATE_KEY should be the PRIVATE key (not .pub file)"
    echo "Example: contents of ~/.ssh/id_ed25519 or ~/.ssh/id_rsa"
    echo ""
    echo "To get your private key:"
    echo "  cat ~/.ssh/id_ed25519"
    echo "  # or"
    echo "  cat ~/.ssh/id_rsa"
    echo ""
    echo "Make sure the corresponding public key is in:"
    echo "  /home/$user/.ssh/authorized_keys on the server"
}

main() {
    local host=${1:-$DEFAULT_HOST}
    local user=${2:-$DEFAULT_USER}

    if [[ -z "$host" ]]; then
        show_usage
        exit 1
    fi

    echo_info "SSH Connection Test for $user@$host"
    echo_info "========================================"
    echo ""

    # Run tests
    if test_basic_connectivity "$host"; then
        echo ""
        if test_ssh_keyscan "$host"; then
            echo ""
            if test_ssh_connection "$host" "$user"; then
                echo ""
                test_server_requirements "$host" "$user"
                echo ""
                echo_info "🎉 All tests passed! The server is ready for deployment."
            else
                echo ""
                echo_error "❌ SSH authentication failed"
                show_github_actions_debug "$host" "$user"
            fi
        else
            echo ""
            echo_error "❌ SSH service issues detected"
        fi
    else
        echo ""
        echo_error "❌ Basic connectivity failed"
        echo_error "Check if the host is correct and accessible"
    fi

    echo ""
    echo_info "Test completed at $(date)"
}

main "$@"
