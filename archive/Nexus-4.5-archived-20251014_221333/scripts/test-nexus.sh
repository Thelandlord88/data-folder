#!/bin/bash
# NEXUS-4.5 Test Suite
# Interactive testing of all Nexus endpoints

set -e

NEXUS_URL="http://127.0.0.1:8080"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 NEXUS-4.5 Test Suite${NC}"
echo "================================"
echo ""

# Function to check if Nexus is running
check_nexus() {
    echo -e "${YELLOW}🔍 Checking if Nexus is running...${NC}"
    if curl -s --max-time 2 "$NEXUS_URL/status" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nexus is running on $NEXUS_URL${NC}"
        return 0
    else
        echo -e "${RED}❌ Nexus is not running${NC}"
        echo ""
        echo "To start Nexus, run:"
        echo "  ./start-nexus.sh"
        echo ""
        return 1
    fi
}

# Test 1: Status Endpoint
test_status() {
    echo ""
    echo -e "${BLUE}📊 Test 1: GET /status${NC}"
    echo "================================"
    
    RESPONSE=$(curl -s "$NEXUS_URL/status")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Status endpoint responding${NC}"
        echo ""
        echo "Response:"
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}❌ Failed to get status${NC}"
    fi
}

# Test 2: List Personalities
test_personalities() {
    echo ""
    echo -e "${BLUE}👥 Test 2: GET /personalities${NC}"
    echo "================================"
    
    RESPONSE=$(curl -s "$NEXUS_URL/personalities")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Personalities endpoint responding${NC}"
        echo ""
        echo "Total Personalities:"
        echo "$RESPONSE" | jq '.total' 2>/dev/null || echo "Could not parse response"
        echo ""
        echo "Sample personalities:"
        echo "$RESPONSE" | jq '.personalities[:5] | .[] | {name, tagline, traitCount}' 2>/dev/null || echo "$RESPONSE" | head -20
    else
        echo -e "${RED}❌ Failed to get personalities${NC}"
    fi
}

# Test 3: Single Personality Enhancement
test_enhance() {
    echo ""
    echo -e "${BLUE}🎯 Test 3: POST /enhance (Single Personality)${NC}"
    echo "================================"
    
    REQUEST='{
      "personalityName": "pythonista",
      "request": "Write a Python function to calculate fibonacci numbers"
    }'
    
    echo "Request:"
    echo "$REQUEST" | jq '.'
    echo ""
    
    RESPONSE=$(curl -s -X POST "$NEXUS_URL/enhance" \
        -H "Content-Type: application/json" \
        -d "$REQUEST")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Enhance endpoint responding${NC}"
        echo ""
        echo "Response summary:"
        echo "$RESPONSE" | jq '{personality, mode, traitsUsed: .traitsUsed | length}' 2>/dev/null || echo "$RESPONSE" | head -30
    else
        echo -e "${RED}❌ Failed to enhance${NC}"
    fi
}

# Test 4: Multi-Personality Composition
test_compose() {
    echo ""
    echo -e "${BLUE}🎨 Test 4: POST /enhance (COMPOSE Mode)${NC}"
    echo "================================"
    
    REQUEST='{
      "mode": "COMPOSE",
      "request": "Design a REST API with Python backend and React frontend",
      "maxTraits": 8
    }'
    
    echo "Request:"
    echo "$REQUEST" | jq '.'
    echo ""
    
    RESPONSE=$(curl -s -X POST "$NEXUS_URL/enhance" \
        -H "Content-Type: application/json" \
        -d "$REQUEST")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Compose mode responding${NC}"
        echo ""
        echo "Response summary:"
        echo "$RESPONSE" | jq '{mode, personalitiesUsed: .personalitiesUsed | length, traitsUsed: .traitsUsed | length, synergy}' 2>/dev/null || echo "$RESPONSE" | head -30
    else
        echo -e "${RED}❌ Failed to compose${NC}"
    fi
}

# Test 5: AUTO Mode
test_auto() {
    echo ""
    echo -e "${BLUE}🤖 Test 5: POST /enhance (AUTO Mode)${NC}"
    echo "================================"
    
    REQUEST='{
      "mode": "AUTO",
      "request": "Create a beautiful landing page with modern CSS animations"
    }'
    
    echo "Request:"
    echo "$REQUEST" | jq '.'
    echo ""
    
    RESPONSE=$(curl -s -X POST "$NEXUS_URL/enhance" \
        -H "Content-Type: application/json" \
        -d "$REQUEST")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ AUTO mode responding${NC}"
        echo ""
        echo "Response summary:"
        echo "$RESPONSE" | jq '{mode, selectedPersonality: .personality, confidence, traitsUsed: .traitsUsed | length}' 2>/dev/null || echo "$RESPONSE" | head -30
    else
        echo -e "${RED}❌ Failed AUTO mode${NC}"
    fi
}

# Test 6: Consciousness Patterns
test_consciousness() {
    echo ""
    echo -e "${BLUE}🧠 Test 6: GET /consciousness${NC}"
    echo "================================"
    
    RESPONSE=$(curl -s "$NEXUS_URL/consciousness")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Consciousness endpoint responding${NC}"
        echo ""
        echo "Response:"
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE" | head -30
    else
        echo -e "${RED}❌ Failed to get consciousness${NC}"
    fi
}

# Test 7: History
test_history() {
    echo ""
    echo -e "${BLUE}📜 Test 7: GET /history${NC}"
    echo "================================"
    
    RESPONSE=$(curl -s "$NEXUS_URL/history?limit=5")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ History endpoint responding${NC}"
        echo ""
        echo "Recent history (last 5):"
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE" | head -30
    else
        echo -e "${RED}❌ Failed to get history${NC}"
    fi
}

# Main test execution
main() {
    # Check if Nexus is running
    if ! check_nexus; then
        exit 1
    fi
    
    # Run all tests
    test_status
    test_personalities
    test_enhance
    test_compose
    test_auto
    test_consciousness
    test_history
    
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✅ All tests completed!${NC}"
    echo -e "${GREEN}================================${NC}"
}

# Run main
main
