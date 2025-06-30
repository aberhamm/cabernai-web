# Sharp Installation Troubleshooting Guide

## Problem

Sharp module installation fails on Apple Silicon (M1/M2) Macs with error:

```
Cannot find module '../build/Release/sharp-darwin-arm64v8.node'
```

## Solutions

### Option 1: Force Rebuild Sharp (Recommended)

```bash
# Remove sharp completely
yarn remove sharp

# Clear npm/yarn cache
yarn cache clean
npm cache clean --force

# Reinstall sharp
yarn add sharp

# If still failing, try rebuilding
npx sharp --version
```

### Option 2: Install Platform-Specific Version

```bash
# Remove existing sharp
yarn remove sharp

# Install with specific platform flags
yarn add sharp --ignore-engines
```

### Option 3: Use npm instead of yarn for sharp

```bash
# Remove sharp from yarn
yarn remove sharp

# Install with npm
npm install sharp --platform=darwin --arch=arm64
```

### Option 4: Disable Sharp (Fallback)

If sharp continues to fail, you can modify the code to not use plaiceholder:

1. Edit `apps/ui/src/components/page-builder/components/BasicImage.tsx`
2. Change line 38 from:
   ```typescript
   const ImageComp = useClient ? ImageWithFallback : ImageWithPlaiceholder
   ```
   to:
   ```typescript
   const ImageComp = ImageWithFallback
   ```

### Option 5: Environment Variables

Set these environment variables before installing:

```bash
export npm_config_arch=arm64
export npm_config_platform=darwin
yarn add sharp
```

## Prevention

Add this to your CI/CD pipeline or team setup:

```bash
# Add to package.json scripts
"postinstall": "node -e \"try { require('sharp') } catch (e) { console.log('Sharp not found, skipping...') }\""
```

## Current Status

- ✅ Sharp is installed but may have platform issues
- ✅ App works without sharp (fallback mode)
- ✅ Plaiceholder functionality available when sharp works
- ⚠️ Platform-specific binary may be incorrect

## Recommended Action

Try Option 1 first, then Option 2 if needed. If both fail, use Option 4 to disable sharp temporarily.
