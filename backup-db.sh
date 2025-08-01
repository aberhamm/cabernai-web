#!/bin/bash

# Database backup script for production PostgreSQL
# This script creates automated backups with rotation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cabernai-web-v2"
DEPLOY_DIR="/opt/apps/$PROJECT_NAME"
BACKUP_DIR="/opt/backups/$PROJECT_NAME/database"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"
KEEP_DAYS=30  # Keep backups for 30 days
KEEP_WEEKLY=12  # Keep 12 weekly backups (3 months)
KEEP_MONTHLY=12  # Keep 12 monthly backups (1 year)

# Database configuration (from Docker Compose)
DB_NAME="strapi"
DB_USER="strapi"
DB_CONTAINER="${PROJECT_NAME//-/_}_db_1"  # Docker Compose container name

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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/daily"
mkdir -p "$BACKUP_DIR/weekly"
mkdir -p "$BACKUP_DIR/monthly"

print_status "Starting database backup..."

# Check if database container is running
if ! docker ps | grep -q "$DB_CONTAINER"; then
    print_error "Database container $DB_CONTAINER is not running!"
    exit 1
fi

# Create backup
print_status "Creating database backup: $BACKUP_FILE"
cd "$DEPLOY_DIR"

if docker-compose -f docker-compose.production.yml exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/daily/$BACKUP_FILE"; then
    print_status "Backup created successfully: $BACKUP_DIR/daily/$BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_DIR/daily/$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    print_status "Backup compressed: $BACKUP_DIR/daily/$BACKUP_FILE"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/daily/$BACKUP_FILE" | cut -f1)
    print_status "Backup size: $BACKUP_SIZE"
    
else
    print_error "Failed to create database backup!"
    exit 1
fi

# Weekly backup (copy to weekly folder if it's Sunday)
if [ "$(date +%u)" -eq 7 ]; then
    print_status "Creating weekly backup..."
    cp "$BACKUP_DIR/daily/$BACKUP_FILE" "$BACKUP_DIR/weekly/weekly_$BACKUP_FILE"
fi

# Monthly backup (copy to monthly folder if it's the 1st of the month)
if [ "$(date +%d)" -eq 1 ]; then
    print_status "Creating monthly backup..."
    cp "$BACKUP_DIR/daily/$BACKUP_FILE" "$BACKUP_DIR/monthly/monthly_$BACKUP_FILE"
fi

# Cleanup old backups
print_status "Cleaning up old backups..."

# Remove daily backups older than KEEP_DAYS
find "$BACKUP_DIR/daily" -name "backup_*.sql.gz" -mtime +$KEEP_DAYS -delete
DAILY_COUNT=$(find "$BACKUP_DIR/daily" -name "backup_*.sql.gz" | wc -l)

# Keep only the most recent weekly backups
if [ -d "$BACKUP_DIR/weekly" ]; then
    cd "$BACKUP_DIR/weekly"
    ls -t weekly_backup_*.sql.gz 2>/dev/null | tail -n +$((KEEP_WEEKLY + 1)) | xargs -r rm
    WEEKLY_COUNT=$(find "$BACKUP_DIR/weekly" -name "weekly_backup_*.sql.gz" 2>/dev/null | wc -l)
else
    WEEKLY_COUNT=0
fi

# Keep only the most recent monthly backups
if [ -d "$BACKUP_DIR/monthly" ]; then
    cd "$BACKUP_DIR/monthly"
    ls -t monthly_backup_*.sql.gz 2>/dev/null | tail -n +$((KEEP_MONTHLY + 1)) | xargs -r rm
    MONTHLY_COUNT=$(find "$BACKUP_DIR/monthly" -name "monthly_backup_*.sql.gz" 2>/dev/null | wc -l)
else
    MONTHLY_COUNT=0
fi

# Show backup statistics
print_status "Backup completed successfully!"
echo ""
print_status "Backup Statistics:"
print_status "- Daily backups: $DAILY_COUNT (kept for $KEEP_DAYS days)"
print_status "- Weekly backups: $WEEKLY_COUNT (kept for $KEEP_WEEKLY weeks)"
print_status "- Monthly backups: $MONTHLY_COUNT (kept for $KEEP_MONTHLY months)"
echo ""

# Calculate total backup space
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
print_status "Total backup space used: $TOTAL_SIZE"

# Optional: Upload to remote storage (uncomment and configure as needed)
# print_status "Uploading to remote storage..."
# aws s3 cp "$BACKUP_DIR/daily/$BACKUP_FILE" s3://your-backup-bucket/database/
# print_status "Backup uploaded to S3"

print_status "Database backup process completed!"
echo ""
print_status "Backup location: $BACKUP_DIR"
print_status "Latest backup: $BACKUP_DIR/daily/$BACKUP_FILE"
echo ""
print_status "To restore from this backup:"
print_status "  cd $DEPLOY_DIR"
print_status "  gunzip -c $BACKUP_DIR/daily/$BACKUP_FILE | docker-compose -f docker-compose.production.yml exec -T db psql -U $DB_USER $DB_NAME"