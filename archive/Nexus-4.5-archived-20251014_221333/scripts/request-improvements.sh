#!/bin/bash
# Request improvements from all NEXUS personalities

echo "🚀 NEXUS Power Upgrade Consultation"
echo "===================================="
echo ""
echo "Starting NEXUS if not running..."
if ! curl -s http://localhost:8080/status > /dev/null 2>&1; then
    echo "Starting NEXUS runtime..."
    npx tsx nexus-runtime.v2.ts > /tmp/nexus.log 2>&1 &
    NEXUS_PID=$!
    echo "Waiting for NEXUS to initialize..."
    sleep 5
fi

echo ""
echo "Checking NEXUS status..."
curl -s http://localhost:8080/status | jq '.'

echo ""
echo "🧠 Requesting strategic improvements from ALL personalities..."
echo "Mode: COMPOSE (up to 15 traits)"
echo ""

curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d @nexus-power-upgrade-request.json \
  | jq '.' | tee nexus-improvement-suggestions.json

echo ""
echo "✅ Response saved to: nexus-improvement-suggestions.json"
echo ""
echo "📊 Analyzing response..."
jq '.selectedPersonalities[]?, .composedTraits[]?, .enhancement' nexus-improvement-suggestions.json 2>/dev/null || echo "Response format may vary"

