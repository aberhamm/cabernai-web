# 🌍 Unified Environment Variable System

This project uses a **unified environment variable approach** that ensures consistency between development and production environments.

## 🎯 **Core Concept**

**One `.env` file rules them all!**

Both development and production use the same root `.env` file structure, eliminating environment inconsistencies and simplifying configuration management.

## 📁 **File Structure**

### ✅ **Current (Unified)**

```
cabernai-web/
├── .env                    # 🎯 Single source of truth
├── .env.example           # Template for all environments
├── docker-compose.dev.yml # Development with unified .env
├── docker-compose.prod.yml # Production with unified .env
└── apps/
    ├── strapi/
    │   └── .env.example   # Legacy (deprecated)
    └── ui/
        └── (removed) # App-specific files no longer needed
```

### ❌ **Old (Multiple Files)**

```
cabernai-web/
├── .env                    # Production only
├── apps/
│   ├── strapi/
│   │   └── .env           # Development Strapi
│   └── ui/
│       └── (removed)     # No longer needed
```

## 🔧 **How It Works**

### **Development Mode**

```bash
# 1. Copy the example
cp .env.example .env

# 2. Configure for development (leave DOMAIN_NAME empty)
DOMAIN_NAME=                    # Empty = localhost URLs
NODE_ENV=development
DATABASE_URL=postgresql://...   # Local PostgreSQL or Supabase

# 3. Run with unified environment
yarn dev:unified               # Uses docker-compose.dev.yml + root .env
```

### **Production Mode**

```bash
# 1. Generate production environment
./scripts/deploy/env-generator.sh

# 2. Configure for production (set DOMAIN_NAME)
DOMAIN_NAME=your-domain.com     # Set = production URLs
NODE_ENV=production
DATABASE_URL=postgresql://...   # Supabase production

# 3. Deploy with unified environment
./scripts/deploy/deploy.sh     # Uses docker-compose.prod.yml + root .env
```

## 🌟 **Benefits**

| Aspect          | Before (Multiple Files)           | After (Unified)                |
| --------------- | --------------------------------- | ------------------------------ |
| **Consistency** | ❌ Different configs for dev/prod | ✅ Same structure everywhere   |
| **Complexity**  | ❌ 3+ environment files           | ✅ 1 environment file          |
| **Maintenance** | ❌ Sync variables across files    | ✅ Single source of truth      |
| **Debugging**   | ❌ Hard to track variable sources | ✅ All variables in one place  |
| **Onboarding**  | ❌ Multiple setup steps           | ✅ Copy one file and configure |
| **Docker**      | ❌ Multiple env_file directives   | ✅ Single env_file directive   |

## 📋 **Environment Variables**

### **URL Configuration**

All URLs are derived from `DOMAIN_NAME`:

```bash
# Development (DOMAIN_NAME empty)
NEXT_PUBLIC_APP_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXTAUTH_URL=http://localhost:3000

# Production (DOMAIN_NAME set)
NEXT_PUBLIC_APP_PUBLIC_URL=https://your-domain.com
NEXT_PUBLIC_STRAPI_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
```

### **Database Configuration**

Supports both local and cloud databases:

```bash
# Development (Local PostgreSQL)
DATABASE_URL=postgresql://admin:mFm8z7z8@localhost:5432/strapi-db
DATABASE_SSL=false

# Production (Supabase)
DATABASE_URL=postgresql://postgres.xxx:password@xxx.pooler.supabase.com:6543/postgres
DATABASE_SSL=true
```

### **Complete Variable List**

All variables from app-specific `.env` files are now consolidated in the unified [.env.example](./.env.example):

**From Strapi** (previously `apps/strapi/.env.example`):

- ✅ Database configuration (all `DATABASE_*` variables)
- ✅ Strapi secrets (`APP_KEYS`, `JWT_SECRET`, etc.)
- ✅ File upload (AWS S3, Cloudinary)
- ✅ Email service (Mailgun)
- ✅ Frontend URLs (`CLIENT_URL`, `CLIENT_ACCOUNT_ACTIVATION_URL`)

**From UI** (previously `apps/ui/.env.local.example`):

- ✅ NextJS URLs (`NEXT_PUBLIC_*` variables)
- ✅ NextAuth configuration
- ✅ System settings (`NODE_ENV`, `NEXT_OUTPUT`)

**Smart database configuration** - `DATABASE_URL` is the primary connection method, with individual parameters auto-derived for maximum Strapi compatibility.

## 🚀 **Migration Guide**

### **From App-Specific to Unified**

1. **Backup existing files:**

   ```bash
   # No backup needed - app-specific files are no longer used
   ```

2. **Create unified environment:**

   ```bash
   cp .env.example .env
   # Copy values from your backup files to the new .env
   ```

3. **Update development workflow:**

   ```bash
   # Old way
   yarn dev

   # New way (recommended)
   yarn dev:unified
   ```

4. **Remove old files (optional):**
   ```bash
   # App-specific environment files have been removed
   ```

## 🔍 **Troubleshooting**

### **Environment Variables Not Loading**

1. **Check file location:**

   ```bash
   ls -la .env  # Should be in root directory
   ```

2. **Verify Docker Compose:**

   ```bash
   # Development
   docker-compose -f docker-compose.dev.yml config

   # Production
   docker-compose -f docker-compose.prod.yml config
   ```

3. **Check variable names:**
   ```bash
   grep -E '^[^#]' .env | sort  # List all non-comment variables
   ```

### **Development vs Production Issues**

1. **Check NODE_ENV:**

   ```bash
   # Development should be
   NODE_ENV=development

   # Production should be
   NODE_ENV=production
   ```

2. **Check DOMAIN_NAME:**

   ```bash
   # Development should be empty
   DOMAIN_NAME=

   # Production should be set
   DOMAIN_NAME=your-domain.com
   ```

## 📚 **Related Documentation**

- [Deployment Guide](./README-DEPLOYMENT.md) - Production deployment
- [Main README](./README.md) - Project overview
- [Strapi README](./apps/strapi/README.md) - Strapi-specific information
- [UI README](./apps/ui/README.md) - Next.js UI information

## 🎯 **Best Practices**

1. **Always use the unified approach** for new development
2. **Keep .env.example updated** when adding new variables
3. **Never commit .env files** to version control
4. **Use the env-generator script** for production deployments
5. **Test both development and production** configurations locally
6. **Document any new environment variables** in this file

---

**🎉 The unified environment system makes Cabernai Web development and deployment consistent, reliable, and maintainable!**
