#!/bin/bash
# Script to test Android build locally before submitting to EAS

echo "🧪 Testing Android build locally..."
echo "This will help identify build issues before waiting in EAS queue."
echo ""

# Set up environment
export ANDROID_HOME="$USERPROFILE/AppData/Local/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export JAVA_HOME="/c/Program Files/Microsoft/jdk-17.0.17.10-hotspot"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

echo "Environment configured:"
echo "  ANDROID_HOME: $ANDROID_HOME"
echo "  JAVA_HOME: $JAVA_HOME"
echo ""

# Check if Android SDK is accessible
if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ Android SDK not found at $ANDROID_HOME"
    echo "   Please install Android SDK or update ANDROID_HOME"
    exit 1
fi

# Check if Java is accessible
if ! command -v java &> /dev/null; then
    echo "❌ Java not found in PATH"
    echo "   Please install JDK 17 and set JAVA_HOME"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Run pre-build check first
echo "1️⃣ Running pre-build validation..."
npm run pre-build

if [ $? -ne 0 ]; then
    echo "❌ Pre-build check failed. Fix errors before building."
    exit 1
fi

echo ""
echo "2️⃣ Testing Gradle build locally..."
echo "   This may take 5-10 minutes..."
echo ""

cd android

# Clean build
./gradlew clean

# Try building debug APK
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Local build successful!"
    echo "   Debug APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "You can now try building with EAS:"
    echo "  npm run build:android"
else
    echo ""
    echo "❌ Local build failed"
    echo "   Check the error messages above"
    echo "   Fix these issues before submitting to EAS"
    exit 1
fi

