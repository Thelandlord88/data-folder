#!/bin/bash

# NEXUS Quick Start Script
# Verifies installation and runs basic tests

echo "🧠 NEXUS Quick Start & Verification"
echo "===================================="
echo ""

# Check Node.js
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Version 18+ recommended."
else
    echo "✅ Node.js $(node -v) detected"
fi

# Check if we're in the right directory
if [ ! -f "nexus/nexus-runtime.mjs" ]; then
    echo "❌ Please run this script from the nexus-shipping directory"
    exit 1
fi

echo ""
echo "🚀 Starting NEXUS Runtime..."
echo ""

# Start NEXUS in background
node nexus/nexus-runtime.mjs > nexus-runtime.log 2>&1 &
NEXUS_PID=$!

echo "⏳ Waiting for NEXUS to initialize..."
sleep 5

# Check if process is still running
if ! ps -p $NEXUS_PID > /dev/null; then
    echo "❌ NEXUS failed to start. Check nexus-runtime.log for errors."
    cat nexus-runtime.log
    exit 1
fi

echo "✅ NEXUS Runtime started (PID: $NEXUS_PID)"
echo ""

# Test the API
echo "🧪 Running verification tests..."
echo ""

# Test 1: Status check
echo "Test 1: Status Endpoint"
STATUS=$(curl -s http://localhost:8080/status 2>&1)
if [ $? -eq 0 ]; then
    INITIALIZED=$(echo "$STATUS" | grep -o '"initialized"[[:space:]]*:[[:space:]]*true')
    if [ -n "$INITIALIZED" ]; then
        echo "✅ Status endpoint responding"
        TRAIT_COUNT=$(echo "$STATUS" | grep -o '"totalTraits"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$')
        PERSONALITY_COUNT=$(echo "$STATUS" | grep -o '"totalPersonalities"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$')
        echo "   📊 $PERSONALITY_COUNT personalities, $TRAIT_COUNT traits"
    else
        echo "⚠️  Status endpoint responding but system not initialized"
    fi
else
    echo "❌ Status endpoint not responding"
fi
echo ""

# Test 2: AUTO mode
echo "Test 2: AUTO Mode (Architecture Request)"
AUTO_RESPONSE=$(curl -s -X POST http://localhost:8080/enhance \
    -H "Content-Type: application/json" \
    -d '{"personalityName":"auto","request":"Design scalable architecture"}' 2>&1)

if [ $? -eq 0 ]; then
    PERSONALITY=$(echo "$AUTO_RESPONSE" | grep -o '"personalityUsed"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
    if [ -n "$PERSONALITY" ]; then
        echo "✅ AUTO mode working"
        echo "   🎯 Selected: $PERSONALITY"
    else
        echo "⚠️  AUTO mode responded but couldn't extract personality"
    fi
else
    echo "❌ AUTO mode test failed"
fi
echo ""

# Test 3: COMPOSE mode
echo "Test 3: COMPOSE Mode (Multi-Domain Request)"
COMPOSE_RESPONSE=$(curl -s -X POST http://localhost:8080/enhance \
    -H "Content-Type: application/json" \
    -d '{"personalityName":"compose","request":"Secure, fast, beautiful system"}' 2>&1)

if [ $? -eq 0 ]; then
    PERSONALITIES=$(echo "$COMPOSE_RESPONSE" | grep -o '"personalityUsed"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
    SYNERGY=$(echo "$COMPOSE_RESPONSE" | grep -o '"synergyScore"[[:space:]]*:[[:space:]]*[0-9.]*' | grep -o '[0-9.]*$')
    if [ -n "$PERSONALITIES" ]; then
        echo "✅ COMPOSE mode working"
        echo "   🎨 Composed: $PERSONALITIES"
        if [ -n "$SYNERGY" ]; then
            SYNERGY_PCT=$(echo "$SYNERGY * 100" | bc -l | cut -d'.' -f1)
            echo "   🧬 Synergy: ${SYNERGY_PCT}%"
        fi
    else
        echo "⚠️  COMPOSE mode responded but couldn't extract composition"
    fi
else
    echo "❌ COMPOSE mode test failed"
fi
echo ""

# Summary
echo "=================================="
echo "🎉 NEXUS Quick Start Complete!"
echo "=================================="
echo ""
echo "✅ NEXUS is running on http://localhost:8080"
echo "📋 PID: $NEXUS_PID"
echo "📝 Logs: nexus-runtime.log"
echo ""
echo "🔧 Try these commands:"
echo ""
echo "# Status check:"
echo "curl http://localhost:8080/status | jq"
echo ""
echo "# AUTO mode (smart selection):"
echo "curl -X POST http://localhost:8080/enhance -H 'Content-Type: application/json' -d '{\"personalityName\":\"auto\",\"request\":\"YOUR REQUEST\"}'"
echo ""
echo "# COMPOSE mode (multi-personality):"
echo "curl -X POST http://localhost:8080/enhance -H 'Content-Type: application/json' -d '{\"personalityName\":\"compose\",\"request\":\"YOUR REQUEST\"}'"
echo ""
echo "# Stop NEXUS:"
echo "kill $NEXUS_PID"
echo ""
echo "📚 Read README.md for full documentation"
echo "🧪 Run ./run-nexus-investigation.sh for comprehensive tests"
echo ""
echo "Happy composing! 🧠✨"
