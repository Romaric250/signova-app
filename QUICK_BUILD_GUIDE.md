# ⚡ Quick Build Guide - Catch Errors Before Waiting Hours!



# important 

npx expo install --check 



## The Problem
EAS Build takes **2+ hours** in the queue, and if there's an error, you have to wait all over again! 😫

## The Solution
Run **pre-build checks locally** first (takes ~2 minutes) to catch errors before submitting to EAS.

## 🚀 Quick Start

### Step 1: Run Pre-Build Check
```bash
cd signova-app
npm run pre-build
```

This will:
- ✅ Check for `@/` path alias imports (common failure)
- ✅ Validate TypeScript
- ✅ Test bundling (catches module resolution errors)

**Takes ~2 minutes** instead of 2+ hours!

### Step 2: If Pre-Build Passes, Build APK
```bash
npm run build:android
```

The build command **automatically runs pre-build first**, so you can skip Step 1 if you want.

## 📋 What Gets Checked

### 1. Path Alias Imports
- Scans all files for `@/` imports
- These fail in EAS Build if not configured
- **Fix**: Convert to relative paths

### 2. TypeScript Validation
- Runs `tsc --noEmit`
- Catches type errors early
- **Fix**: Resolve TypeScript errors

### 3. Bundle Test
- Runs `expo export --platform android`
- Tests actual bundling process
- **Catches**: Module resolution errors, missing files, import issues
- **This is the most important check!**

## ⏱️ Time Comparison

| Method | Time | Catches Errors? |
|--------|------|----------------|
| **Pre-build check** | ~2 min | ✅ Yes |
| **EAS Build (if error)** | 2+ hours | ❌ After waiting |
| **EAS Build (if success)** | 2+ hours | N/A |

## 🎯 Usage Tips

1. **Always run pre-build before committing** to catch issues early
2. **Run pre-build in CI/CD** to prevent broken builds
3. **Use `npm run build:android`** - it runs pre-build automatically
4. **Check the output** - it tells you exactly what's wrong

## 🔧 Manual Pre-Build Check

If you want to run just the check without building:

```bash
npm run pre-build
```

## 📝 Example Output

### ✅ Success
```
✅ No @/ path alias imports found
✅ TypeScript validation passed
✅ Bundle test passed

✅ All pre-build checks passed!
   You can now safely run: npm run build:android
```

### ❌ Failure
```
❌ Found @/ path alias imports:
   src/screens/auth/OnboardingScreen.tsx
     - import('@/services/storage/localStorage')

❌ Pre-build validation FAILED
⚠️  Please fix these errors before building with EAS.
```

## 💡 Pro Tips

- **Run pre-build after major changes** to catch issues early
- **Fix errors immediately** - don't wait for EAS Build
- **Share pre-build output** when asking for help - it shows exactly what's wrong

---

**Remember**: 2 minutes now saves 2+ hours later! ⏰

