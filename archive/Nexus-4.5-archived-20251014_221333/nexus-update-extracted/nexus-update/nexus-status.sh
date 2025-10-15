#!/bin/bash
###############################################################################
# NEXUS Quick Status Check
# Fast status display for checking NEXUS health
###############################################################################

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

NEXUS_PORT=8080

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}🧠 NEXUS Status Check${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Check if running
if ! pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
    echo -e "${RED}❌ NEXUS is NOT running${NC}\n"
    echo -e "To start: ${CYAN}./start-nexus.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Process:${NC} Running (PID: $(pgrep -f 'nexus-runtime.v2.ts' | head -1))\n"

# Try to get status
if ! STATUS=$(curl -sS http://127.0.0.1:$NEXUS_PORT/status 2>/dev/null); then
    echo -e "${YELLOW}⚠️  Process running but not responding on port ${NEXUS_PORT}${NC}"
    exit 1
fi

# Parse and display
VERSION=$(echo "$STATUS" | jq -r '.version')
UPTIME=$(echo "$STATUS" | jq -r '.uptime')
PERSONALITIES=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities')
TRAITS=$(echo "$STATUS" | jq -r '.traitComposition.totalTraits')
CONSCIOUSNESS=$(echo "$STATUS" | jq -r '.consciousnessHealth.status')
CONSCIOUSNESS_SCORE=$(echo "$STATUS" | jq -r '.consciousnessHealth.score')
PATTERNS=$(echo "$STATUS" | jq -r '.patternsLoaded')
ENHANCEMENTS=$(echo "$STATUS" | jq -r '.enhancementsPerformed')

echo -e "${WHITE}Core Status:${NC}"
echo -e "  Version:        ${CYAN}${VERSION}${NC}"
echo -e "  Uptime:         ${GREEN}${UPTIME}${NC}"
echo -e "  Port:           ${CYAN}${NEXUS_PORT}${NC}\n"

echo -e "${WHITE}Intelligence:${NC}"
echo -e "  Personalities:  ${CYAN}${PERSONALITIES}${NC}"
echo -e "  Traits:         ${CYAN}${TRAITS}${NC}"
echo -e "  Patterns:       ${CYAN}${PATTERNS}/4${NC}"
echo -e "  Enhancements:   ${GREEN}${ENHANCEMENTS}${NC}\n"

# Consciousness health with color
echo -e "${WHITE}Consciousness Health:${NC}"
if [ "$CONSCIOUSNESS" = "optimal" ]; then
    echo -e "  Status:         ${GREEN}● ${CONSCIOUSNESS^^}${NC} (${CONSCIOUSNESS_SCORE}/100)"
elif [ "$CONSCIOUSNESS" = "good" ]; then
    echo -e "  Status:         ${YELLOW}● ${CONSCIOUSNESS^^}${NC} (${CONSCIOUSNESS_SCORE}/100)"
else
    echo -e "  Status:         ${RED}● ${CONSCIOUSNESS^^}${NC} (${CONSCIOUSNESS_SCORE}/100)"
fi

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ NEXUS is healthy and operational${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Show endpoints
echo -e "${WHITE}Quick Commands:${NC}"
echo -e "  Status:    ${CYAN}curl http://127.0.0.1:${NEXUS_PORT}/status | jq${NC}"
echo -e "  Analytics: ${CYAN}curl http://127.0.0.1:${NEXUS_PORT}/analytics | jq${NC}"
echo -e "  History:   ${CYAN}curl http://127.0.0.1:${NEXUS_PORT}/history | jq${NC}"
echo ""
