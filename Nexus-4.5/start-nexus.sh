#!/bin/bash
# NEXUS-4.5 Startup Script
# Keeps Nexus running with automatic restart on failure
# Supports foreground (dev) and background (production) modes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Parse command line arguments
BACKGROUND=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --background|-b)
            BACKGROUND=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--background]"
            echo ""
            echo "Options:"
            echo "  --background, -b    Run in background mode (production)"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                  # Foreground mode (development)"
            echo "  $0 --background     # Background mode (production)"
            exit 0
            ;;
        *)
            # Invalid option - will be caught below
            ;;
    esac
done

# Kill any existing Nexus processes on port 8080
echo "🔍 Checking for existing Nexus processes..."

# Check PID file first (for background processes)
if [ -f "$SCRIPT_DIR/logs/nexus.pid" ]; then
    OLD_PID=$(cat "$SCRIPT_DIR/logs/nexus.pid")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "⚠️  Found existing NEXUS process (PID: $OLD_PID)"
        echo "🛑 Stopping existing process..."
        kill "$OLD_PID" 2>/dev/null || true
        sleep 2
    fi
    rm -f "$SCRIPT_DIR/logs/nexus.pid"
fi

# Double-check port (catches orphaned processes)
EXISTING_PID=$(lsof -ti:8080 2>/dev/null || true)
trap cleanup SIGINT SIGTERM

# Background mode - run with nohup
if [ "$BACKGROUND" = true ]; then
    # Ensure logs directory exists
    mkdir -p "$SCRIPT_DIR/logs"
    
    echo "✨ Starting NEXUS in background..."
    echo "================================"
    
    # Start with nohup, redirect output to log file
    nohup npx tsx nexus-runtime.v2.ts >> "$SCRIPT_DIR/logs/nexus.log" 2>&1 &
    NEXUS_PID=$!
    
    # Save PID to file
    echo $NEXUS_PID > "$SCRIPT_DIR/logs/nexus.pid"
    
    echo "🚀 NEXUS running in background"
    echo "   PID: $NEXUS_PID"
    echo "   Logs: $SCRIPT_DIR/logs/nexus.log"
    echo "   PID File: $SCRIPT_DIR/logs/nexus.pid"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:     tail -f $SCRIPT_DIR/logs/nexus.log"
    echo "   Check status:  curl http://127.0.0.1:8080/status"
    echo "   Stop process:  kill $NEXUS_PID"
    echo ""
    
    # Wait a moment and verify it started
    sleep 2
    if ps -p $NEXUS_PID > /dev/null; then
        echo "✅ NEXUS started successfully"
    else
        echo "❌ NEXUS failed to start. Check logs:"
        tail -n 20 "$SCRIPT_DIR/logs/nexus.log"
        rm -f "$SCRIPT_DIR/logs/nexus.pid"
        exit 1
    fi
    
    exit 0
fi

# Foreground mode - start with auto-restart
echo "✨ Starting NEXUS in foreground..."
echo "================================"
echo ""

# Start Nexus with auto-restart
RESTART_COUNT=0
MAX_RESTARTS=5
fiho "🚀 NEXUS-4.5 Startup Manager"
echo "================================"
echo ""
echo "📁 Working Directory: $SCRIPT_DIR"
echo "🧠 Runtime: nexus-runtime.v2.ts"
echo "📦 Port: 8080"
echo "🎯 Mode: $([ "$BACKGROUND" = true ] && echo "Background" || echo "Foreground")"
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
