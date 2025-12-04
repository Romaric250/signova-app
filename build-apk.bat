@echo off
REM Script to build Android APK using EAS Build (Windows)

echo 🚀 Starting Android APK build process...
echo.

REM Check if EAS CLI is installed
where eas >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ EAS CLI is not installed. Installing...
    npm install -g eas-cli
)

REM Login check
echo 📋 Checking EAS login status...
eas whoami
if %errorlevel% neq 0 (
    echo 🔐 Please login to EAS:
    eas login
)

REM Build APK
echo.
echo 🔨 Building Android APK (this may take 10-20 minutes)...
echo 📱 Profile: preview (APK format)
echo.

eas build --platform android --profile preview

echo.
echo ✅ Build process completed!
echo 📥 Download your APK from the EAS dashboard: https://expo.dev/accounts/romaric250/projects/signova-app/builds
echo.

pause

