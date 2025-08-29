#!/bin/bash

# Kobebe Komik - Development Launcher Script

echo "🚀 Kobebe Komik - Development Server"
echo "=================================="

# Check if Python is installed
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python tidak ditemukan. Silakan install Python terlebih dahulu."
    exit 1
fi

# Check if we're in the correct directory
if [[ ! -f "index.html" ]]; then
    echo "❌ File index.html tidak ditemukan. Pastikan Anda menjalankan script ini dari folder project."
    exit 1
fi

# Get available port
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

echo "📁 Current directory: $(pwd)"
echo "🌐 Starting server on port: $PORT"
echo ""
echo "📱 Akses aplikasi di:"
echo "   Local:    http://localhost:$PORT"
echo "   Network:  http://$(hostname -I | awk '{print $1}'):$PORT"
echo ""
echo "💡 Tips:"
echo "   - Tekan Ctrl+C untuk menghentikan server"
echo "   - Gunakan Chrome/Firefox untuk testing PWA"
echo "   - Aktifkan Developer Tools untuk debugging"
echo ""
echo "🔧 PWA Testing:"
echo "   1. Buka DevTools (F12)"
echo "   2. Tab Application/Storage"
echo "   3. Check Service Worker & Manifest"
echo "   4. Test offline di Network tab"
echo ""

# Start the server
echo "⏳ Starting Python HTTP Server..."
echo "=================================="

$PYTHON_CMD -m http.server $PORT
