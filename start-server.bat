@echo off
:: Kobebe Komik - Development Launcher Script for Windows

title Kobebe Komik - Development Server

echo.
echo 🚀 Kobebe Komik - Development Server
echo ==================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python tidak ditemukan. Silakan install Python terlebih dahulu.
    echo    Download: https://python.org/downloads
    pause
    exit /b 1
)

:: Check if we're in the correct directory
if not exist "index.html" (
    echo ❌ File index.html tidak ditemukan.
    echo    Pastikan Anda menjalankan script ini dari folder project.
    pause
    exit /b 1
)

:: Set port
set PORT=8000

echo 📁 Current directory: %CD%
echo 🌐 Starting server on port: %PORT%
echo.
echo 📱 Akses aplikasi di:
echo    Local:    http://localhost:%PORT%
echo    Network:  http://192.168.x.x:%PORT%
echo.
echo 💡 Tips:
echo    - Tekan Ctrl+C untuk menghentikan server
echo    - Gunakan Chrome/Firefox untuk testing PWA
echo    - Aktifkan Developer Tools untuk debugging
echo.
echo 🔧 PWA Testing:
echo    1. Buka DevTools (F12)
echo    2. Tab Application/Storage
echo    3. Check Service Worker ^& Manifest
echo    4. Test offline di Network tab
echo.
echo ⏳ Starting Python HTTP Server...
echo ==================================
echo.

:: Start the server
python -m http.server %PORT%

pause
