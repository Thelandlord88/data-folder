#!/bin/bash
# Quick Nexus Test - Simple endpoint check

NEXUS_URL="http://127.0.0.1:8080"

echo "🧪 Quick Nexus Test"
echo "==================="
echo ""

# Test 1: Status
echo "1️⃣  Testing /status..."
curl -s "$NEXUS_URL/status" | jq '.' 2>/dev/null || echo "Failed"
echo ""

# Test 2: Simple enhancement
echo "2️⃣  Testing /enhance (pythonista)..."
curl -s -X POST "$NEXUS_URL/enhance" \
  -H "Content-Type: application/json" \
  -d '{"personalityName":"pythonista","request":"Hello"}' \
  | jq '{mode, personality, traitsUsed: (.traitsUsed | length)}' 2>/dev/null || echo "Failed"
echo ""

echo "✅ Tests complete!"
