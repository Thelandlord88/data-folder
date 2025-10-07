#!/bin/bash
# NEXUS Startup Script
# Version: 1.0.0

echo "🚀 Starting NEXUS Runtime v1.0"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install ws
fi

echo "🧠 Initializing NEXUS consciousness..."
echo ""

# Start NEXUS
node nexus/nexus-runtime.mjs
