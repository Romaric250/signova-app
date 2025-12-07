@echo off
REM Script to set up Android development environment variables

set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM Set JDK 17 for React Native
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot

REM Add Android SDK tools to PATH
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

echo Android SDK configured:
echo ANDROID_HOME=%ANDROID_HOME%
echo.
echo To make these changes permanent, add them to your system environment variables:
echo 1. Open System Properties ^> Environment Variables
echo 2. Add ANDROID_HOME=%ANDROID_HOME%
echo 3. Add ANDROID_SDK_ROOT=%ANDROID_HOME%
echo 4. Add to PATH: %%ANDROID_HOME%%\platform-tools;%%ANDROID_HOME%%\tools;%%ANDROID_HOME%%\tools\bin
echo.

REM Verify setup
echo Verifying setup...
where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] ADB found
    adb --version | findstr "version"
) else (
    echo [ERROR] ADB not found in PATH
)

if exist "%ANDROID_HOME%\platforms" (
    echo [OK] Android SDK platforms directory found
) else (
    echo [WARNING] Android SDK platforms directory not found
)

echo.
echo Environment variables are set for this session.
echo Run your React Native commands in this terminal.

