#!/bin/bash
# Health Check Script for NEXUS
# Run this daily to ensure NEXUS is healthy
#
# Exit Codes:
#   0 - All healthy
#   1 - NEXUS not running or HTTP error
#   2 - Circuit breaker not CLOSED
#   3 - Memory usage too high
#   4 - Error rate too high
#   5 - Missing personalities or traits
#
# Environment Variables:
#   NEXUS_URL - Override default URL (default: http://127.0.0.1:8080)
#   MEMORY_THRESHOLD_MB - Max memory in MB (default: 100)
#   ERROR_THRESHOLD_PCT - Max error rate % (default: 5)

set -euo pipefail

# Configuration
NEXUS_URL="${NEXUS_URL:-http://127.0.0.1:8080}"
MEMORY_THRESHOLD_MB="${MEMORY_THRESHOLD_MB:-100}"
ERROR_THRESHOLD_PCT="${ERROR_THRESHOLD_PCT:-5}"
EXIT_CODE=0

echo "🏥 NEXUS Health Check"
echo "===================="
echo "Time: $(date)"
echo "URL: $NEXUS_URL"
echo ""

# Check if running and get status
echo "Checking NEXUS status..."
STATUS=$(curl -fsS --max-time 2 "$NEXUS_URL/status") || {
    echo "❌ NEXUS is NOT running or HTTP error"
    exit 1
}

echo "✅ NEXUS is running"
echo ""

# Check initialization
INIT=$(echo "$STATUS" | jq -r '.initialized // empty')
if [ -z "$INIT" ]; then
    echo "❌ Missing 'initialized' field in response"
    exit 1
fi
echo "✅ Initialized: $INIT"

# Check personalities
PERS=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities // empty')
if [ -z "$PERS" ]; then
    echo "❌ Missing 'personalitySystem.totalPersonalities' field"
    exit 1
fi

if [ "$PERS" -lt 45 ]; then
    echo "⚠️  Personalities: $PERS/45 (INCOMPLETE)"
    EXIT_CODE=5
else
    echo "✅ Personalities: $PERS/45"
fi

# Check circuit breaker
CB=$(echo "$STATUS" | jq -r '.loaderHealth.circuitBreakerState // empty')
if [ -z "$CB" ]; then
    echo "❌ Missing 'circuitBreakerState' field"
    exit 1
fi

if [ "$CB" = "CLOSED" ]; then
    echo "✅ Circuit Breaker: $CB (healthy)"
else
    echo "❌ Circuit Breaker: $CB (UNHEALTHY)"
    EXIT_CODE=2
fi

# Check memory
MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB // empty')
if [ -z "$MEM" ]; then
    echo "❌ Missing 'memoryUsageMB' field"
    exit 1
fi

MEM_INT=${MEM%.*}
if (( MEM_INT > MEMORY_THRESHOLD_MB )); then
    echo "❌ Memory: ${MEM} MB (> ${MEMORY_THRESHOLD_MB} MB threshold)"
    EXIT_CODE=3
else
    echo "✅ Memory: ${MEM} MB"
fi

# Check errors
ERRORS=$(echo "$STATUS" | jq -r '.systemHealth.metrics.errorRate // empty')
if [ -z "$ERRORS" ]; then
    echo "❌ Missing 'errorRate' field"
    exit 1
fi

ERRORS_INT=${ERRORS%.*}
if (( ERRORS_INT > ERROR_THRESHOLD_PCT )); then
    echo "❌ Error Rate: ${ERRORS}% (> ${ERROR_THRESHOLD_PCT}% threshold)"
    EXIT_CODE=4
else
    echo "✅ Error Rate: ${ERRORS}%"
fi

# Check traits
TRAITS=$(echo "$STATUS" | jq -r '.traitComposition.totalTraits // empty')
if [ -z "$TRAITS" ]; then
    echo "❌ Missing 'totalTraits' field"
    exit 1
fi

if [ "$TRAITS" -lt 211 ]; then
    echo "⚠️  Traits: $TRAITS/211 (INCOMPLETE)"
    EXIT_CODE=5
else
    echo "✅ Traits: $TRAITS"
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "🎉 Health check complete! All systems healthy."
else
    echo "⚠️  Health check complete with warnings (exit code: $EXIT_CODE)"
fi

exit $EXIT_CODE
