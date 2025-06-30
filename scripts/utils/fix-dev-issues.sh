#!/bin/bash

# Fix common development issues
# Run this script from the project root

set -e

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

check_root_directory() {
    if [[ ! -f "package.json" ]] || [[ ! -f "turbo.json" ]]; then
        echo_error "This script must be run from the project root directory"
        echo "Please cd to the root of your cabernai-web project"
        exit 1
    fi
}

fix_file_permissions() {
    echo_step "Fixing file permissions..."

    # Fix Strapi build directory permissions
    if [[ -d "apps/strapi/dist" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sudo chown -R $USER:staff apps/strapi/dist/ 2>/dev/null || true
            sudo chown -R $USER:staff apps/strapi/.strapi/ 2>/dev/null || true
        else
            # Linux
            sudo chown -R $USER:$USER apps/strapi/dist/ 2>/dev/null || true
            sudo chown -R $USER:$USER apps/strapi/.strapi/ 2>/dev/null || true
        fi
        echo_info "✓ Fixed Strapi build directory permissions"
    fi

    # Fix Turbo cache permissions
    if [[ -d ".turbo" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sudo chown -R $USER:staff .turbo/ 2>/dev/null || true
        else
            sudo chown -R $USER:$USER .turbo/ 2>/dev/null || true
        fi
        echo_info "✓ Fixed Turbo cache permissions"
    fi
}

check_environment_setup() {
    echo_step "Checking environment setup..."

    # Check if root .env exists
    if [[ ! -f ".env" ]]; then
        echo_warn "Root .env file not found"
        if [[ -f ".env.example" ]]; then
            echo_info "Copying .env.example to .env"
            cp .env.example .env
            echo_warn "Please edit .env with your configuration"
        else
            echo_warn ".env.example not found. Creating minimal .env for development..."
            cat > .env << 'EOF'
# Minimal development environment configuration
# For full configuration options, see ENVIRONMENT.md

# Domain (leave empty for localhost development)
DOMAIN_NAME=

# URLs (auto-generated for development)
NEXT_PUBLIC_APP_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXTAUTH_URL=http://localhost:3000

# Database (adjust for your local setup)
DATABASE_URL=postgresql://admin:mFm8z7z8@localhost:5432/strapi-db
DATABASE_SSL=false

# Security secrets (generate proper ones for production)
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=dev-admin-jwt-secret
API_TOKEN_SALT=dev-api-token-salt
TRANSFER_TOKEN_SALT=dev-transfer-token-salt
JWT_SECRET=dev-jwt-secret
NEXTAUTH_SECRET=dev-nextauth-secret

# System
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

# Disable Sentry in development (prevents warnings)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Client URLs
CLIENT_URL=http://localhost:3000
CLIENT_ACCOUNT_ACTIVATION_URL=http://localhost:3000/auth/activate
EOF
            echo_info "✓ Created minimal .env file for development"
            echo_warn "Configure database and other services as needed"
        fi
    else
        echo_info "✓ Root .env file exists"
    fi

    # Check/create symlinks for app compatibility
    if [[ ! -L "apps/strapi/.env" ]]; then
        echo_info "Creating Strapi .env symlink"
        ln -sf ../../.env apps/strapi/.env
    else
        echo_info "✓ Strapi .env symlink exists"
    fi

    if [[ ! -L "apps/ui/.env.local" ]]; then
        echo_info "Creating UI .env.local symlink"
        ln -sf ../../.env apps/ui/.env.local
    else
        echo_info "✓ UI .env.local symlink exists"
    fi
}

fix_sharp_module() {
    echo_step "Checking Sharp module (macOS ARM64)..."

    if [[ "$OSTYPE" == "darwin"* ]] && [[ "$(uname -m)" == "arm64" ]]; then
        echo_info "Detected macOS ARM64, checking Sharp module"
        cd apps/ui
        if yarn list sharp >/dev/null 2>&1; then
            echo_info "Reinstalling Sharp with correct binaries"
            yarn add sharp --ignore-engines
            echo_info "✓ Sharp module fixed for ARM64"
        else
            echo_info "Sharp not installed, skipping"
        fi
        cd ../..
    else
        echo_info "✓ Not macOS ARM64, Sharp fix not needed"
    fi
}

clean_and_reinstall() {
    echo_step "Cleaning build artifacts and node_modules..."

    # Use existing cleanup script
    if [[ -f "scripts/utils/rm-all.sh" ]]; then
        bash scripts/utils/rm-all.sh
        echo_info "✓ Cleaned all build artifacts and node_modules"
    else
        echo_warn "Cleanup script not found, manual cleanup recommended"
    fi

    echo_step "Reinstalling dependencies..."
    yarn install
    echo_info "✓ Dependencies reinstalled"
}

test_development_setup() {
    echo_step "Testing development setup..."

    # Test if turbo commands work
    if yarn turbo --version >/dev/null 2>&1; then
        echo_info "✓ Turbo is working"
    else
        echo_error "✗ Turbo not working properly"
        return 1
    fi

    # Test if environment variables are accessible
    if [[ -f ".env" ]]; then
        # Source the .env file to check if it's valid
        set -a
        source .env 2>/dev/null || {
            echo_error "✗ .env file has syntax errors"
            return 1
        }
        set +a
        echo_info "✓ .env file is valid"
    fi

    # Check if symlinks are working
    if [[ -L "apps/strapi/.env" ]] && [[ -L "apps/ui/.env.local" ]]; then
        echo_info "✓ Environment symlinks are working"
    else
        echo_error "✗ Environment symlinks not working"
        return 1
    fi
}

show_next_steps() {
    echo ""
    echo_info "🎉 Development environment fixes applied!"
    echo ""
    echo_warn "Next steps:"
    echo_warn "1. Configure your .env file with proper values"
    echo_warn "2. Start development server: yarn dev:unified (recommended) or yarn dev"
    echo_warn "3. If issues persist, check the troubleshooting section in README.md"
    echo ""
    echo_info "Available development commands:"
    echo_info "- yarn dev:unified    # Unified Docker development (recommended)"
    echo_info "- yarn dev           # Traditional development"
    echo_info "- yarn build         # Build all apps"
    echo_info "- yarn lint          # Lint all apps"
}

main() {
    echo_info "Development Issues Fix Script"
    echo_info "============================"
    echo ""

    check_root_directory

    # Prompt user for what to fix
    echo "What would you like to fix?"
    echo "1. File permissions only"
    echo "2. Environment setup only"
    echo "3. Sharp module only (macOS ARM64)"
    echo "4. Clean and reinstall everything"
    echo "5. Fix all issues (recommended)"
    echo ""
    read -p "Enter your choice (1-5): " choice

    case $choice in
        1)
            fix_file_permissions
            ;;
        2)
            check_environment_setup
            ;;
        3)
            fix_sharp_module
            ;;
        4)
            clean_and_reinstall
            ;;
        5)
            fix_file_permissions
            check_environment_setup
            fix_sharp_module
            echo ""
            echo_step "Testing configuration..."
            if test_development_setup; then
                show_next_steps
            else
                echo ""
                echo_error "Some issues remain. You may need to clean and reinstall (option 4)."
                exit 1
            fi
            ;;
        *)
            echo_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac

    if [[ $choice != 5 ]]; then
        echo ""
        echo_info "Selected fix applied. Run with option 5 for comprehensive fixing."
    fi
}

main "$@"
