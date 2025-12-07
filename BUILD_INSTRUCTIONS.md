# Building Android APK - Instructions

## ⚡ Quick Start (Recommended)

**Always run the pre-build check first** to catch errors locally (takes ~2 minutes instead of 2+ hours):

```bash
cd signova-app
npm run pre-build
```

If the pre-build check passes, then build:

```bash
npm run build:android
```

## 🔍 Pre-Build Validation

The `pre-build` script automatically:
1. ✅ Checks for `@/` path alias imports (common build failure)
2. ✅ Validates TypeScript types
3. ✅ Tests bundling with `expo export` (catches module resolution errors)

**This saves you hours of waiting time!** Always run this before building.

## 📱 Building the APK

### Option 1: Using npm script (includes pre-build check)
```bash
npm run build:android
```

### Option 2: Manual build (skip pre-build check)
```bash
eas build --platform android --profile preview
```

### Option 3: Production build
```bash
npm run build:android:production
```

## ⏱️ Build Process

1. **Pre-build check**: ~2 minutes (runs automatically)
2. **EAS Build queue**: Varies (Free tier can be 1-3 hours)
3. **Actual build**: ~10-20 minutes
4. **Total**: ~2-4 hours (but errors caught in first 2 minutes!)

## 📥 Download APK

After build completes:
- **Terminal**: Download link will be shown
- **Dashboard**: https://expo.dev/accounts/romaric250/projects/signova-app/builds

## 🐛 Troubleshooting

### Pre-build check fails?
- Fix the errors shown
- Common issues:
  - `@/` path aliases → Convert to relative paths
  - Module not found → Check import paths
  - TypeScript errors → Fix type issues

### Build still fails after pre-build passes?
- Check EAS build logs for specific errors
- Share the error message for help

## 💡 Tips

- **Always run `npm run pre-build` first** - it catches 90% of build errors
- Build during off-peak hours for faster queue times
- Use `--local` flag if you have Android SDK installed (much faster)
