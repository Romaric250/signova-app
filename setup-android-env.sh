#!/bin/bash
# Script to set up Android development environment variables

export ANDROID_HOME="$USERPROFILE/AppData/Local/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

# Set JDK 17 for React Native
export JAVA_HOME="/c/Program Files/Microsoft/jdk-17.0.17.10-hotspot"

export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH"

echo "Android SDK configured:"
echo "ANDROID_HOME=$ANDROID_HOME"
echo ""
echo "To make these changes permanent, add to your ~/.bashrc or ~/.zshrc:"
echo "export ANDROID_HOME=\"\$USERPROFILE/AppData/Local/Android/Sdk\""
echo "export ANDROID_SDK_ROOT=\"\$ANDROID_HOME\""
echo "export PATH=\"\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/tools:\$ANDROID_HOME/tools/bin:\$PATH\""
echo ""

# Verify setup
echo "Verifying setup..."
if command -v adb &> /dev/null; then
    echo "[OK] ADB found"
    adb --version | head -1
else
    echo "[ERROR] ADB not found in PATH"
fi

if [ -d "$ANDROID_HOME/platforms" ]; then
    echo "[OK] Android SDK platforms directory found"
else
    echo "[WARNING] Android SDK platforms directory not found"
fi

echo ""
echo "Environment variables are set for this session."
echo "Run your React Native commands in this terminal."

