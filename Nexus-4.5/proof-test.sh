#!/bin/bash
# NEXUS Comprehensive Proof-of-Operation Test
# This will test ALL major functionality and document results

NEXUS_URL="http://127.0.0.1:8080"
TEST_LOG="/tmp/nexus-proof-test.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔬 NEXUS COMPREHENSIVE PROOF-OF-OPERATION TEST" | tee $TEST_LOG
echo "================================================" | tee -a $TEST_LOG
echo "Date: $(date)" | tee -a $TEST_LOG
echo "URL: $NEXUS_URL" | tee -a $TEST_LOG
echo "" | tee -a $TEST_LOG

PASS_COUNT=0
FAIL_COUNT=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -e "${BLUE}🧪 TEST: $test_name${NC}" | tee -a $TEST_LOG
    echo "Command: $test_command" >> $TEST_LOG
    
    result=$(eval "$test_command" 2>&1)
    echo "$result" >> $TEST_LOG
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✅ PASS${NC}" | tee -a $TEST_LOG
        ((PASS_COUNT++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}" | tee -a $TEST_LOG
        echo "Expected pattern: $expected_pattern" | tee -a $TEST_LOG
        echo "Got: $result" | tee -a $TEST_LOG
        ((FAIL_COUNT++))
        return 1
    fi
}

# Check if Nexus is running
echo -e "${YELLOW}Step 1: Checking if Nexus is running...${NC}" | tee -a $TEST_LOG
if curl -s --max-time 2 "$NEXUS_URL/status" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nexus is reachable${NC}" | tee -a $TEST_LOG
else
    echo -e "${RED}❌ Nexus is NOT running!${NC}" | tee -a $TEST_LOG
    echo "Please start Nexus first:" | tee -a $TEST_LOG
    echo "  cd /workspaces/data-folder/Nexus-4.5" | tee -a $TEST_LOG
    echo "  ./start-nexus.sh" | tee -a $TEST_LOG
    exit 1
fi

echo "" | tee -a $TEST_LOG

# Test 1: Status endpoint
run_test "Status Endpoint" \
    "curl -s $NEXUS_URL/status" \
    '"initialized":true'

# Test 2: Verify personalities loaded
run_test "Personalities Loaded (45)" \
    "curl -s $NEXUS_URL/status | jq -r '.personalitySystem.totalPersonalities'" \
    "45"

# Test 3: Verify traits indexed
run_test "Traits Indexed (211)" \
    "curl -s $NEXUS_URL/status | jq -r '.traitComposition.totalTraits'" \
    "211"

# Test 4: Circuit breaker is closed
run_test "Circuit Breaker Status (CLOSED)" \
    "curl -s $NEXUS_URL/status | jq -r '.loaderHealth.circuitBreakerState'" \
    "CLOSED"

# Test 5: Memory usage is reasonable
run_test "Memory Usage (< 50 MB)" \
    "curl -s $NEXUS_URL/status | jq -r '.loaderHealth.memoryUsageMB' | awk '{print (\$1 < 50) ? \"PASS\" : \"FAIL\"}'" \
    "PASS"

# Test 6: Consciousness patterns loaded
run_test "Consciousness Patterns (4)" \
    "curl -s $NEXUS_URL/status | jq -r '.consciousnessBridge.patternsLoaded'" \
    "4"

# Test 7: List personalities endpoint
run_test "List Personalities Endpoint" \
    "curl -s $NEXUS_URL/personalities | jq -r '.total'" \
    "45"

# Test 8: Enhance with specific personality (Pythonista)
run_test "Enhance: Pythonista" \
    "curl -s -X POST $NEXUS_URL/enhance -H 'Content-Type: application/json' -d '{\"personalityName\":\"pythonista\",\"request\":\"test\"}' | jq -r '.personality'" \
    "pythonista"

# Test 9: Enhance with AUTO mode
run_test "Enhance: AUTO mode" \
    "curl -s -X POST $NEXUS_URL/enhance -H 'Content-Type: application/json' -d '{\"mode\":\"AUTO\",\"request\":\"write python code\"}' | jq -r '.mode'" \
    "AUTO"

# Test 10: Enhance with COMPOSE mode
run_test "Enhance: COMPOSE mode" \
    "curl -s -X POST $NEXUS_URL/enhance -H 'Content-Type: application/json' -d '{\"mode\":\"COMPOSE\",\"request\":\"build full stack app\",\"maxTraits\":5}' | jq -r '.mode'" \
    "COMPOSE"

# Test 11: Verify traits are returned in response
run_test "Traits in Response" \
    "curl -s -X POST $NEXUS_URL/enhance -H 'Content-Type: application/json' -d '{\"personalityName\":\"hunter\",\"request\":\"audit code\"}' | jq -r '.traitsUsed | length > 0'" \
    "true"

# Test 12: History endpoint
run_test "History Endpoint" \
    "curl -s $NEXUS_URL/history | jq -r 'has(\"events\")'" \
    "true"

# Test 13: Consciousness endpoint
run_test "Consciousness Endpoint" \
    "curl -s $NEXUS_URL/consciousness | jq -r '.initialized'" \
    "true"

# Test 14: System health status
run_test "System Health Status" \
    "curl -s $NEXUS_URL/status | jq -r '.systemHealth.status'" \
    "healthy"

# Test 15: Verify no errors in error rate
run_test "Error Rate (0%)" \
    "curl -s $NEXUS_URL/status | jq -r '.systemHealth.metrics.errorRate'" \
    "0"

echo "" | tee -a $TEST_LOG
echo "================================================" | tee -a $TEST_LOG
echo -e "${BLUE}📊 TEST RESULTS SUMMARY${NC}" | tee -a $TEST_LOG
echo "================================================" | tee -a $TEST_LOG
echo -e "✅ Passed: ${GREEN}$PASS_COUNT${NC}" | tee -a $TEST_LOG
echo -e "❌ Failed: ${RED}$FAIL_COUNT${NC}" | tee -a $TEST_LOG
echo "Total Tests: $((PASS_COUNT + FAIL_COUNT))" | tee -a $TEST_LOG

if [ $FAIL_COUNT -eq 0 ]; then
    echo "" | tee -a $TEST_LOG
    echo -e "${GREEN}🎉 ALL TESTS PASSED! NEXUS IS FULLY OPERATIONAL!${NC}" | tee -a $TEST_LOG
    echo "" | tee -a $TEST_LOG
    echo "Full log saved to: $TEST_LOG"
    exit 0
else
    echo "" | tee -a $TEST_LOG
    echo -e "${RED}⚠️  SOME TESTS FAILED - CHECK LOG FOR DETAILS${NC}" | tee -a $TEST_LOG
    echo "" | tee -a $TEST_LOG
    echo "Full log saved to: $TEST_LOG"
    exit 1
fi
