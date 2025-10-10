#!/bin/bash
# NEXUS-4 Startup Script

echo "🚀 Starting NEXUS-4 Runtime"
echo "================================"
echo ""
echo "📁 Working Directory: $(pwd)"
echo "🧠 Runtime: src/nexus-runtime.mjs"
echo "📦 Personalities: profiles/"
echo "🔮 Consciousness: consciousness/"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the runtime
echo "✨ Launching NEXUS..."
node src/nexus-runtime.mjs "$@"
