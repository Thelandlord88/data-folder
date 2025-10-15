#!/bin/bash
###############################################################################
# NEXUS-4.5 Enhanced Startup Script
# Adapted from nexus-update package for Nexus-4.5 structure
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

# Configuration - Adapted for Nexus-5.0
NEXUS_PORT=8080
NEXUS_RUNTIME="../runtime/nexus-runtime.v2.ts"  # Relative to tools/ directory
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
║            NEXUS-4.5 Intelligence Runtime v2.0                  ║
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
        echo -e "  ${CHECK} Runtime: ${GREEN}${NEXUS_RUNTIME}${NC}"
    else
        echo -e "  ${CROSS} Runtime: ${RED}File not found${NC}"
        echo -e "  ${INFO} Expected: $NEXUS_RUNTIME"
        echo -e "  ${INFO} Available runtime files:"
        ls -1 *runtime*.ts 2>/dev/null || echo "    No runtime files found"
        exit 1
    fi
    
    # Check if port is available
    if lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${WARN} Port $NEXUS_PORT: ${YELLOW}In use${NC}"
        EXISTING_PID=$(lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t)
        echo -e "  ${INFO} Existing process PID: ${EXISTING_PID}"
        echo -e "  ${INFO} Will attempt to stop it..."
    else
        echo -e "  ${CHECK} Port $NEXUS_PORT: ${GREEN}Available${NC}"
    fi
    
    # Check for consciousness directory
    if [ -d "consciousness" ]; then
        PATTERN_COUNT=$(ls -1 consciousness/*.json 2>/dev/null | wc -l)
        echo -e "  ${CHECK} Consciousness: ${GREEN}${PATTERN_COUNT} files${NC}"
    else
        echo -e "  ${WARN} Consciousness: ${YELLOW}No consciousness directory${NC}"
    fi
    
    # Check for TypeScript/tsx
    if command -v tsx &> /dev/null; then
        echo -e "  ${CHECK} TypeScript: ${GREEN}tsx available${NC}"
    elif command -v npx &> /dev/null; then
        echo -e "  ${CHECK} TypeScript: ${GREEN}npx available${NC}"
    else
        echo -e "  ${CROSS} TypeScript: ${RED}Neither tsx nor npx found${NC}"
        exit 1
    fi
}

###############################################################################
# Kill existing NEXUS process
###############################################################################
kill_existing() {
    echo -e "\n${GEAR} ${BOLD}Checking for existing NEXUS process...${NC}\n"
    
    # Check for process by runtime file name
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
    
    # Also check port and kill if occupied
    if lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t)
        echo -e "  ${WARN} Port $NEXUS_PORT occupied by PID: $PID"
        echo -e "  ${GEAR} Killing process on port..."
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null || true
        sleep 1
        echo -e "  ${CHECK} ${GREEN}Port freed${NC}"
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
    sleep 2
    
    # Check if process is still running
    if ps -p $NEXUS_PID > /dev/null; then
        echo -e "  ${CHECK} ${GREEN}Process running${NC}"
    else
        echo -e "  ${CROSS} ${RED}Process died immediately${NC}"
        echo -e "\n${WARN} ${BOLD}Startup Log (last 20 lines):${NC}\n"
        tail -20 "$LOG_FILE"
        exit 1
    fi
    
    # Show startup log excerpt
    echo -e "\n${BRAIN} ${BOLD}Startup Log:${NC}\n"
    
    # Wait for more log output
    sleep 1
    
    # Show interesting parts of the log
    if [ -f "$LOG_FILE" ]; then
        tail -30 "$LOG_FILE" | head -20 | while read line; do
            # Color code based on content
            if [[ "$line" =~ "error"|"Error"|"ERROR" ]]; then
                echo -e "  ${RED}$line${NC}"
            elif [[ "$line" =~ "warning"|"Warning"|"WARN" ]]; then
                echo -e "  ${YELLOW}$line${NC}"
            elif [[ "$line" =~ "success"|"Success"|"✅"|"✓" ]]; then
                echo -e "  ${GREEN}$line${NC}"
            elif [[ "$line" =~ "NEXUS"|"🧠"|"🚀" ]]; then
                echo -e "  ${CYAN}$line${NC}"
            else
                echo -e "  ${line}"
            fi
        done
    fi
    
    echo ""
}

###############################################################################
# Health check
###############################################################################
health_check() {
    echo -e "\n${GEAR} ${BOLD}Health Check${NC}\n"
    
    # Wait a bit for server to be ready
    echo -e "  ${INFO} Waiting ${STATUS_CHECK_DELAY}s for startup..."
    sleep $STATUS_CHECK_DELAY
    
    # Try to connect to status endpoint
    if curl -sf "http://127.0.0.1:${NEXUS_PORT}/status" > /dev/null 2>&1; then
        echo -e "  ${CHECK} ${GREEN}NEXUS is responding!${NC}"
        return 0
    else
        echo -e "  ${WARN} ${YELLOW}Status endpoint not responding yet${NC}"
        echo -e "  ${INFO} Trying basic connection..."
        
        # Try just connecting to port
        if timeout 2 bash -c "</dev/tcp/127.0.0.1/${NEXUS_PORT}" 2>/dev/null; then
            echo -e "  ${CHECK} ${GREEN}Port is open${NC}"
            return 0
        else
            echo -e "  ${CROSS} ${RED}Cannot connect to port${NC}"
            return 1
        fi
    fi
}

###############################################################################
# Status report
###############################################################################
status_report() {
    echo -e "\n${BRAIN} ${BOLD}Status Report:${NC}\n"
    
    # Try to get status from API
    if STATUS_JSON=$(curl -sf "http://127.0.0.1:${NEXUS_PORT}/status" 2>/dev/null); then
        # Parse JSON if jq is available
        if command -v jq &> /dev/null; then
            VERSION=$(echo "$STATUS_JSON" | jq -r '.version // "unknown"')
            UPTIME=$(echo "$STATUS_JSON" | jq -r '.uptime // "unknown"')
            PERSONALITIES=$(echo "$STATUS_JSON" | jq -r '.personalities.count // "unknown"')
            PATTERNS=$(echo "$STATUS_JSON" | jq -r '.patterns.loaded // "unknown"')
            CONSCIOUSNESS=$(echo "$STATUS_JSON" | jq -r '.consciousness.health // "unknown"')
            
            echo -e "  ${BRAIN} Version:          ${GREEN}${VERSION}${NC}"
            echo -e "  ${CHECK} Uptime:           ${GREEN}${UPTIME}${NC}"
            echo -e "  ${ROCKET} Personalities:    ${GREEN}${PERSONALITIES}${NC}"
            echo -e "  ${BRAIN} Patterns Loaded:  ${GREEN}${PATTERNS}${NC}"
            echo -e "  ${CHECK} Consciousness:    ${GREEN}${CONSCIOUSNESS}${NC}"
        else
            # Just show we got a response
            echo -e "  ${CHECK} ${GREEN}Status API responded${NC}"
            echo -e "  ${INFO} Install jq for detailed status: ${CYAN}apt-get install jq${NC}"
        fi
    else
        # No API response, just show process info
        if pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
            PID=$(pgrep -f "nexus-runtime.v2.ts")
            echo -e "  ${CHECK} Process: ${GREEN}Running (PID: ${PID})${NC}"
            echo -e "  ${WARN} API: ${YELLOW}Not responding yet${NC}"
        else
            echo -e "  ${CROSS} Process: ${RED}Not found${NC}"
        fi
    fi
}

###############################################################################
# Endpoints
###############################################################################
show_endpoints() {
    echo -e "\n${CYAN}🎯 Available Endpoints:${NC}\n"
    echo -e "  ${INFO} Status:    ${CYAN}http://127.0.0.1:${NEXUS_PORT}/status${NC}"
    echo -e "  ${INFO} Analytics: ${CYAN}http://127.0.0.1:${NEXUS_PORT}/analytics${NC}"
    echo -e "  ${INFO} History:   ${CYAN}http://127.0.0.1:${NEXUS_PORT}/history${NC}"
    echo ""
}

###############################################################################
# Troubleshooting
###############################################################################
show_troubleshooting() {
    echo -e "\n${WARN} ${BOLD}Troubleshooting:${NC}\n"
    echo -e "  ${INFO} View logs:"
    echo -e "    ${CYAN}tail -f nexus-startup-*.log${NC}"
    echo ""
    echo -e "  ${INFO} Check if running:"
    echo -e "    ${CYAN}ps aux | grep nexus-runtime${NC}"
    echo ""
    echo -e "  ${INFO} Check port:"
    echo -e "    ${CYAN}lsof -i :${NEXUS_PORT}${NC}"
    echo ""
    echo -e "  ${INFO} Manual stop:"
    echo -e "    ${CYAN}pkill -f nexus-runtime.v2.ts${NC}"
    echo ""
}

###############################################################################
# Main execution
###############################################################################
main() {
    print_banner
    preflight_checks
    kill_existing
    start_nexus
    
    if health_check; then
        status_report
        show_endpoints
        echo -e "${CHECK} ${GREEN}${BOLD}NEXUS IS READY!${NC}\n"
    else
        echo -e "${CROSS} ${RED}${BOLD}Startup may have issues${NC}\n"
        show_troubleshooting
        echo -e "${INFO} Check log file for details: ${CYAN}nexus-startup-$(date +%Y%m%d)-*.log${NC}\n"
        exit 1
    fi
}

# Run main
main
