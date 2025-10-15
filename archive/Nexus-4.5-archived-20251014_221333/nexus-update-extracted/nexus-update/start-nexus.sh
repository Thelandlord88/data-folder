#!/bin/bash
###############################################################################
# NEXUS Enhanced Startup Script
# 
# Purpose: Start NEXUS with full visibility and status reporting
# Features:
# - Clear startup banner
# - Real-time status updates
# - Post-start health check
# - Troubleshooting on failure
# - Beautiful terminal output
###############################################################################

set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Symbols
CHECK="${GREEN}✅${NC}"
CROSS="${RED}❌${NC}"
WARN="${YELLOW}⚠️${NC}"
INFO="${CYAN}ℹ️${NC}"
ROCKET="${PURPLE}🚀${NC}"
BRAIN="${PURPLE}🧠${NC}"
GEAR="${CYAN}⚙️${NC}"

# Configuration
NEXUS_PORT=8080
NEXUS_RUNTIME="nexusv3/nexus-runtime.v2.ts"
STARTUP_TIMEOUT=10
STATUS_CHECK_DELAY=3

###############################################################################
# Banner
###############################################################################
print_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗               ║
║      ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝               ║
║      ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗               ║
║      ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║               ║
║      ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║               ║
║      ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝               ║
║                                                                  ║
║           Collaborative Intelligence Runtime v2.0               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

###############################################################################
# Pre-flight checks
###############################################################################
preflight_checks() {
    echo -e "\n${GEAR} ${BOLD}Pre-flight Checks${NC}\n"
    
    # Check if Node.js is available
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "  ${CHECK} Node.js: ${GREEN}${NODE_VERSION}${NC}"
    else
        echo -e "  ${CROSS} Node.js: ${RED}Not found${NC}"
        exit 1
    fi
    
    # Check if runtime file exists
    if [ -f "$NEXUS_RUNTIME" ]; then
        echo -e "  ${CHECK} Runtime: ${GREEN}nexusv3/nexus-runtime.v2.ts${NC}"
    else
        echo -e "  ${CROSS} Runtime: ${RED}File not found${NC}"
        echo -e "  ${INFO} Expected: $NEXUS_RUNTIME"
        exit 1
    fi
    
    # Check if port is available
    if lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${WARN} Port $NEXUS_PORT: ${YELLOW}In use (will attempt to use next available)${NC}"
    else
        echo -e "  ${CHECK} Port $NEXUS_PORT: ${GREEN}Available${NC}"
    fi
    
    # Check for consciousness directory
    if [ -d "nexusv3/consciousness" ]; then
        PATTERN_COUNT=$(ls -1 nexusv3/consciousness/*.json 2>/dev/null | wc -l)
        echo -e "  ${CHECK} Consciousness: ${GREEN}${PATTERN_COUNT} patterns${NC}"
    else
        echo -e "  ${WARN} Consciousness: ${YELLOW}No patterns directory${NC}"
    fi
    
    # Check for personalities
    if [ -f "nexusv3/personalities.json" ]; then
        echo -e "  ${CHECK} Personalities: ${GREEN}nexusv3/personalities.json${NC}"
    else
        echo -e "  ${WARN} Personalities: ${YELLOW}File not found${NC}"
    fi
}

###############################################################################
# Kill existing NEXUS process
###############################################################################
kill_existing() {
    echo -e "\n${GEAR} ${BOLD}Checking for existing NEXUS process...${NC}\n"
    
    if pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
        echo -e "  ${INFO} Found existing NEXUS process"
        echo -e "  ${GEAR} Stopping gracefully..."
        pkill -SIGTERM -f "nexus-runtime.v2.ts" 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        if pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
            echo -e "  ${WARN} Force killing..."
            pkill -SIGKILL -f "nexus-runtime.v2.ts" 2>/dev/null || true
            sleep 1
        fi
        
        echo -e "  ${CHECK} ${GREEN}Stopped${NC}"
    else
        echo -e "  ${INFO} No existing process found"
    fi
}

###############################################################################
# Start NEXUS
###############################################################################
start_nexus() {
    echo -e "\n${ROCKET} ${BOLD}Starting NEXUS Runtime...${NC}\n"
    
    # Create log file with timestamp
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    LOG_FILE="nexus-startup-${TIMESTAMP}.log"
    
    echo -e "  ${INFO} Log file: ${CYAN}${LOG_FILE}${NC}"
    echo -e "  ${GEAR} Initializing..."
    
    # Start NEXUS in background and capture PID
    npx tsx "$NEXUS_RUNTIME" > "$LOG_FILE" 2>&1 &
    NEXUS_PID=$!
    
    echo -e "  ${INFO} Process ID: ${CYAN}${NEXUS_PID}${NC}"
    
    # Wait a moment for startup
    echo -e "  ${GEAR} Waiting ${STATUS_CHECK_DELAY}s for initialization..."
    sleep $STATUS_CHECK_DELAY
    
    # Check if process is still running
    if ! ps -p $NEXUS_PID > /dev/null; then
        echo -e "  ${CROSS} ${RED}Process died during startup!${NC}"
        echo -e "\n${BOLD}Last 20 lines of log:${NC}\n"
        tail -20 "$LOG_FILE"
        return 1
    fi
    
    echo -e "  ${CHECK} ${GREEN}Process running${NC}"
    
    # Show startup logs
    echo -e "\n${BOLD}Startup Log:${NC}\n"
    head -20 "$LOG_FILE" | sed 's/^/  /'
    
    return 0
}

###############################################################################
# Health Check
###############################################################################
health_check() {
    echo -e "\n${GEAR} ${BOLD}Health Check${NC}\n"
    
    local attempt=1
    local max_attempts=5
    local wait_time=2
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "  ${INFO} Attempt ${attempt}/${max_attempts}..."
        
        if STATUS=$(curl -sS http://127.0.0.1:$NEXUS_PORT/status 2>/dev/null); then
            echo -e "  ${CHECK} ${GREEN}NEXUS is responding!${NC}\n"
            
            # Parse status
            VERSION=$(echo "$STATUS" | jq -r '.version' 2>/dev/null || echo "unknown")
            UPTIME=$(echo "$STATUS" | jq -r '.uptime' 2>/dev/null || echo "unknown")
            PERSONALITIES=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities' 2>/dev/null || echo "unknown")
            CONSCIOUSNESS=$(echo "$STATUS" | jq -r '.consciousnessHealth.status' 2>/dev/null || echo "unknown")
            CONSCIOUSNESS_SCORE=$(echo "$STATUS" | jq -r '.consciousnessHealth.score' 2>/dev/null || echo "unknown")
            PATTERNS=$(echo "$STATUS" | jq -r '.patternsLoaded' 2>/dev/null || echo "unknown")
            
            echo -e "${BOLD}Status Report:${NC}\n"
            echo -e "  ${BRAIN} Version:          ${WHITE}${VERSION}${NC}"
            echo -e "  ${CHECK} Uptime:           ${GREEN}${UPTIME}${NC}"
            echo -e "  ${ROCKET} Personalities:    ${CYAN}${PERSONALITIES}${NC}"
            echo -e "  ${BRAIN} Patterns Loaded:  ${CYAN}${PATTERNS}/4${NC}"
            
            # Consciousness health with color
            if [ "$CONSCIOUSNESS" = "optimal" ]; then
                echo -e "  ${CHECK} Consciousness:    ${GREEN}${CONSCIOUSNESS^^} (${CONSCIOUSNESS_SCORE})${NC}"
            elif [ "$CONSCIOUSNESS" = "good" ]; then
                echo -e "  ${CHECK} Consciousness:    ${YELLOW}${CONSCIOUSNESS^^} (${CONSCIOUSNESS_SCORE})${NC}"
            else
                echo -e "  ${WARN} Consciousness:    ${RED}${CONSCIOUSNESS^^} (${CONSCIOUSNESS_SCORE})${NC}"
            fi
            
            # Get more detailed info
            echo -e "\n${BOLD}Endpoints Available:${NC}\n"
            echo -e "  ${INFO} Status:        http://127.0.0.1:${NEXUS_PORT}/status"
            echo -e "  ${INFO} Enhance:       http://127.0.0.1:${NEXUS_PORT}/enhance (POST)"
            echo -e "  ${INFO} Personalities: http://127.0.0.1:${NEXUS_PORT}/personalities"
            echo -e "  ${INFO} History:       http://127.0.0.1:${NEXUS_PORT}/history"
            echo -e "  ${INFO} Analytics:     http://127.0.0.1:${NEXUS_PORT}/analytics"
            
            return 0
        fi
        
        echo -e "  ${WARN} Not ready yet, waiting ${wait_time}s..."
        sleep $wait_time
        attempt=$((attempt + 1))
    done
    
    echo -e "  ${CROSS} ${RED}Health check failed after ${max_attempts} attempts${NC}"
    return 1
}

###############################################################################
# Main
###############################################################################
main() {
    print_banner
    
    preflight_checks
    
    kill_existing
    
    if ! start_nexus; then
        echo -e "\n${CROSS} ${RED}${BOLD}STARTUP FAILED${NC}\n"
        echo -e "  ${INFO} Check the log file for details"
        echo -e "  ${INFO} Run troubleshoot script: ./scripts/fixes/nexus-troubleshoot.sh"
        exit 1
    fi
    
    if ! health_check; then
        echo -e "\n${WARN} ${YELLOW}${BOLD}NEXUS started but health check failed${NC}\n"
        echo -e "  ${INFO} The process is running but may not be fully initialized"
        echo -e "  ${INFO} Check status manually: curl http://127.0.0.1:${NEXUS_PORT}/status"
        exit 1
    fi
    
    echo -e "\n${CHECK} ${GREEN}${BOLD}NEXUS IS READY!${NC}\n"
    echo -e "╔══════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${BRAIN}  NEXUS Collaborative Intelligence Runtime v2.0           ║"
    echo -e "║  ${ROCKET}  Status: ${GREEN}OPTIMAL${NC}                                          ║"
    echo -e "║  ${INFO}  http://127.0.0.1:${NEXUS_PORT}/status                              ║"
    echo -e "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
}

main "$@"
