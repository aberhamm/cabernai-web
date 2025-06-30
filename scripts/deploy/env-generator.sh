#!/bin/bash

# Environment Variable Generator for Cabernai Web
# This script helps generate secure environment variables

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

generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

generate_uuid() {
    if command -v uuidgen >/dev/null 2>&1; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    else
        cat /proc/sys/kernel/random/uuid
    fi
}

# Cross-platform sed function
sed_inplace() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i "" "$@"
    else
        # Linux
        sed -i "$@"
    fi
}

main() {
    echo_info "Cabernai Web Environment Generator"
    echo_info "=================================="
    echo ""

    # Check if .env already exists
    if [[ -f .env ]]; then
        echo_warn ".env file already exists!"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo_info "Exiting without changes."
            exit 0
        fi
    fi

    # Start with the example file
    if [[ -f .env.example ]]; then
        cp .env.example .env
        echo_info "Created .env from .env.example"
    else
        echo_error ".env.example not found!"
        exit 1
    fi

    # Generate secure secrets
    echo_step "Generating secure secrets..."

    APP_KEY_1=$(generate_secret)
    APP_KEY_2=$(generate_secret)
    APP_KEY_3=$(generate_secret)
    APP_KEY_4=$(generate_secret)
    ADMIN_JWT_SECRET=$(generate_secret)
    API_TOKEN_SALT=$(generate_secret)
    TRANSFER_TOKEN_SALT=$(generate_secret)
    JWT_SECRET=$(generate_secret)
    NEXTAUTH_SECRET=$(generate_secret)

    # Replace secrets in .env file
    sed_inplace "s/your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4/$APP_KEY_1,$APP_KEY_2,$APP_KEY_3,$APP_KEY_4/g" .env
    sed_inplace "s/your-admin-jwt-secret/$ADMIN_JWT_SECRET/g" .env
    sed_inplace "s/your-api-token-salt/$API_TOKEN_SALT/g" .env
    sed_inplace "s/your-transfer-token-salt/$TRANSFER_TOKEN_SALT/g" .env
    sed_inplace "s/your-jwt-secret/$JWT_SECRET/g" .env
    sed_inplace "s/your-nextauth-secret/$NEXTAUTH_SECRET/g" .env

    echo_info "✓ Generated secure secrets"

    # Prompt for domain
    echo_step "Domain Configuration"
    read -p "Enter your domain (e.g., example.com): " DOMAIN
    if [[ -n "$DOMAIN" ]]; then
        sed_inplace "s/your-domain.com/$DOMAIN/g" .env
        echo_info "✓ Set domain to $DOMAIN"
    fi

    # Prompt for Supabase database URL
    echo_step "Supabase Database Configuration"
    echo_info "Go to your Supabase project:"
    echo_info "Dashboard > Settings > Database > Connection string (URI)"
    echo_info "Copy the connection string and replace 'your-password' with your actual password"
    echo ""
    read -p "Enter your Supabase database URL: " SUPABASE_URL
    if [[ -n "$SUPABASE_URL" ]]; then
        # Escape special characters for sed
        ESCAPED_URL=$(echo "$SUPABASE_URL" | sed 's/[[\.*^$()+?{|]/\\&/g')
        sed_inplace "s|postgresql://postgres.your-project-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres|$ESCAPED_URL|g" .env
        echo_info "✓ Set Supabase database URL"
    fi

    # File upload configuration
    echo_step "File Upload Configuration"
    echo_info "Choose your file upload provider:"
    echo_info "1) Cloudinary (Recommended)"
    echo_info "2) AWS S3"
    echo_info "3) Skip for now"
    read -p "Choose option (1-3): " UPLOAD_CHOICE

    case $UPLOAD_CHOICE in
        1)
            echo_info "Cloudinary Configuration:"
            read -p "Cloudinary name: " CLOUDINARY_NAME
            read -p "Cloudinary API key: " CLOUDINARY_API_KEY
            read -p "Cloudinary API secret: " CLOUDINARY_API_SECRET

            if [[ -n "$CLOUDINARY_NAME" && -n "$CLOUDINARY_API_KEY" && -n "$CLOUDINARY_API_SECRET" ]]; then
                sed_inplace "s/your-cloudinary-name/$CLOUDINARY_NAME/g" .env
                sed_inplace "s/your-cloudinary-api-key/$CLOUDINARY_API_KEY/g" .env
                sed_inplace "s/your-cloudinary-api-secret/$CLOUDINARY_API_SECRET/g" .env
                echo_info "✓ Configured Cloudinary"
            fi
            ;;
        2)
            echo_info "AWS S3 Configuration:"
            # Comment out Cloudinary and uncomment AWS
            sed_inplace 's/^CLOUDINARY_/# CLOUDINARY_/g' .env
            sed_inplace 's/^# AWS_/AWS_/g' .env

            read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
            read -p "AWS Secret Access Key: " AWS_ACCESS_SECRET
            read -p "AWS Region: " AWS_REGION
            read -p "S3 Bucket Name: " AWS_BUCKET

            if [[ -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_ACCESS_SECRET" && -n "$AWS_REGION" && -n "$AWS_BUCKET" ]]; then
                sed_inplace "s/your-aws-access-key/$AWS_ACCESS_KEY_ID/g" .env
                sed_inplace "s/your-aws-secret-key/$AWS_ACCESS_SECRET/g" .env
                sed_inplace "s/your-aws-region/$AWS_REGION/g" .env
                sed_inplace "s/your-s3-bucket-name/$AWS_BUCKET/g" .env
                echo_info "✓ Configured AWS S3"
            fi
            ;;
        3)
            echo_info "Skipping file upload configuration"
            ;;
    esac

    # Optional services
    echo_step "Optional Services"

    # Mailgun
    read -p "Configure Mailgun for email? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Mailgun API key: " MAILGUN_API_KEY
        read -p "Mailgun domain: " MAILGUN_DOMAIN
        read -p "Mailgun email: " MAILGUN_EMAIL

        if [[ -n "$MAILGUN_API_KEY" && -n "$MAILGUN_DOMAIN" && -n "$MAILGUN_EMAIL" ]]; then
            sed_inplace "s/your-mailgun-api-key/$MAILGUN_API_KEY/g" .env
            sed_inplace "s/your-mailgun-domain/$MAILGUN_DOMAIN/g" .env
            sed_inplace "s/your-mailgun-email/$MAILGUN_EMAIL/g" .env
            echo_info "✓ Configured Mailgun"
        fi
    fi

    # Sentry
    read -p "Configure Sentry for monitoring? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Sentry DSN: " SENTRY_DSN

        if [[ -n "$SENTRY_DSN" ]]; then
            sed_inplace "s/your-sentry-dsn/$SENTRY_DSN/g" .env
            echo_info "✓ Configured Sentry"
        fi
    fi

    echo ""
    echo_info "Environment file generated successfully!"
    echo_warn "Remember to:"
    echo_warn "1. Review the .env file for any missing values"
    echo_warn "2. Never commit the .env file to version control"
    echo_warn "3. Keep your secrets secure"
    echo ""
    echo_info "Next steps:"
    echo_info "1. Set up your DigitalOcean droplet: ./scripts/deploy/setup-droplet.sh"
    echo_info "2. Deploy your application: ./scripts/deploy/deploy.sh production"
}

main "$@"
