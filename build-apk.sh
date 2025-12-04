#!/bin/bash
# Script to build Android APK using EAS Build

echo "🚀 Starting Android APK build process..."
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Installing..."
    npm install -g eas-cli
fi

# Login check (will prompt if not logged in)
echo "📋 Checking EAS login status..."
eas whoami || {
    echo "🔐 Please login to EAS:"
    eas login
}

# Build APK
echo ""
echo "🔨 Building Android APK (this may take 10-20 minutes)..."
echo "📱 Profile: preview (APK format)"
echo ""

eas build --platform android --profile preview

echo ""
echo "✅ Build process completed!"
echo "📥 Download your APK from the EAS dashboard: https://expo.dev/accounts/romaric250/projects/signova-app/builds"
echo ""

