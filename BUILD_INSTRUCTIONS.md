# Building Android APK - Instructions

## Quick Start

Run this command in your terminal (it will prompt you to create an EAS project if needed):

```bash
cd signova-app
npm run build:android
```

When prompted: **Type `y` and press Enter** to create the EAS project automatically.

## What Happens Next

1. **First Time**: EAS will ask if you want to create a project - answer `y`
2. **Build Starts**: The build will start on Expo's servers (takes 10-20 minutes)
3. **Download**: Once complete, you'll get a download link in the terminal

## Alternative: Manual Build Command

If the npm script doesn't work, use:

```bash
cd signova-app
eas build --platform android --profile preview
```

## Build Profiles

- **Preview** (`npm run build:android`): APK for testing/installation
- **Production** (`npm run build:android:production`): Optimized APK for release

## Troubleshooting

- **Not logged in?** Run: `eas login`
- **Check build status**: Visit https://expo.dev/accounts/romaric250/projects/signova-app/builds
- **Download APK**: Check the EAS dashboard or terminal output for download link

