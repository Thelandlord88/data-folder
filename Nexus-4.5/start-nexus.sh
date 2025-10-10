#!/bin/bash
# NEXUS-4.5 Startup Script
# Keeps Nexus running with automatic restart on failure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 NEXUS-4.5 Startup Manager"
echo "================================"
echo ""
echo "📁 Working Directory: $SCRIPT_DIR"
echo "🧠 Runtime: nexus-runtime.v2.ts"
echo "📦 Port: 8080"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if dependencies are installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

# Kill any existing Nexus processes on port 8080
echo "🔍 Checking for existing Nexus processes..."
EXISTING_PID=$(lsof -ti:8080 2>/dev/null || true)
if [ ! -z "$EXISTING_PID" ]; then
    echo "⚠️  Found existing process on port 8080 (PID: $EXISTING_PID)"
    echo "🛑 Stopping existing process..."
    kill -9 $EXISTING_PID 2>/dev/null || true
    sleep 2
fi

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down Nexus..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Nexus with auto-restart
RESTART_COUNT=0
MAX_RESTARTS=5

while true; do
    echo "✨ Starting NEXUS... (Attempt $((RESTART_COUNT + 1)))"
    echo "================================"
    
    # Run Nexus
    npx tsx nexus-runtime.v2.ts
    
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo "✅ Nexus exited cleanly"
        break
    fi
    
    RESTART_COUNT=$((RESTART_COUNT + 1))
    
    if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
        echo "❌ Maximum restart attempts ($MAX_RESTARTS) reached"
        echo "💡 Check logs for errors"
        exit 1
    fi
    
    echo "⚠️  Nexus crashed (exit code: $EXIT_CODE)"
    echo "🔄 Restarting in 3 seconds..."
    sleep 3
done

echo ""
echo "👋 Nexus stopped"
