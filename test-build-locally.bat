@echo off
REM Script to test Android build locally before submitting to EAS

echo 🧪 Testing Android build locally...
echo This will help identify build issues before waiting in EAS queue.
echo.

REM Set up environment
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo Environment configured:
echo   ANDROID_HOME=%ANDROID_HOME%
echo   JAVA_HOME=%JAVA_HOME%
echo.

REM Check if Android SDK is accessible
if not exist "%ANDROID_HOME%" (
    echo ❌ Android SDK not found at %ANDROID_HOME%
    echo    Please install Android SDK or update ANDROID_HOME
    exit /b 1
)

REM Check if Java is accessible
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found in PATH
    echo    Please install JDK 17 and set JAVA_HOME
    exit /b 1
)

echo ✅ Environment check passed
echo.

REM Run pre-build check first
echo 1️⃣ Running pre-build validation...
call npm run pre-build

if %errorlevel% neq 0 (
    echo ❌ Pre-build check failed. Fix errors before building.
    exit /b 1
)

echo.
echo 2️⃣ Testing Gradle build locally...
echo    This may take 5-10 minutes...
echo.

cd android

REM Clean build
call gradlew.bat clean

REM Try building debug APK
call gradlew.bat assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ✅ Local build successful!
    echo    Debug APK location: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo You can now try building with EAS:
    echo   npm run build:android
) else (
    echo.
    echo ❌ Local build failed
    echo    Check the error messages above
    echo    Fix these issues before submitting to EAS
    exit /b 1
)

