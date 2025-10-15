#!/bin/bash
###############################################################################
# NEXUS 5.0 Troubleshooting Script
# Diagnoses common issues and validates installation
###############################################################################

set -uo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
NEXUS_URL="${NEXUS_URL:-http://127.0.0.1:8080}"
NEXUS_PORT=8080
ISSUES_FOUND=0
WARNINGS_FOUND=0

# Helper functions
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; ((WARNINGS_FOUND++)); }
error() { echo -e "${RED}❌ $1${NC}"; ((ISSUES_FOUND++)); }
section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

echo "🔧 NEXUS 5.0 Troubleshooting & Diagnostic Tool"
echo "=============================================="
echo "Time: $(date)"
echo ""

# 1. Check Directory Structure
section "1. Directory Structure Validation"

REQUIRED_DIRS=(
    "runtime"
    "personalities/registry"
    "consciousness"
    "docs"
    "tools"
    "config"
)

cd /workspaces/data-folder/Nexus-5.0 || { error "Cannot navigate to Nexus-5.0"; exit 1; }

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Directory exists: $dir"
    else
        error "Missing directory: $dir"
    fi
done

# 2. Check Critical Files
section "2. Critical Files Check"

CRITICAL_FILES=(
    "runtime/nexus-runtime.v2.ts"
    "runtime/NEXUS.engine.v2.ts"
    "runtime/nexus-bridge.ts"
    "package.json"
    "tsconfig.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        success "File exists: $file (${SIZE} bytes)"
    else
        error "Missing file: $file"
    fi
done

# 3. Check Personalities
section "3. Personality System"

if [ -d "personalities/registry" ]; then
    PERSONALITY_COUNT=$(ls -1 personalities/registry/*.json 2>/dev/null | wc -l)
    if [ "$PERSONALITY_COUNT" -eq 45 ]; then
        success "All 45 personalities present"
    else
        warning "Only $PERSONALITY_COUNT personalities found (expected 45)"
    fi
else
    error "Personalities directory missing"
fi

# Check symlink in runtime
if [ -L "runtime/profiles" ]; then
    success "Runtime profiles symlink exists"
else
    warning "Runtime profiles symlink missing (may cause issues)"
    info "  Create with: cd runtime && ln -s ../profiles profiles"
fi

# 4. Check Consciousness Patterns
section "4. Consciousness Patterns"

if [ -d "consciousness" ]; then
    PATTERN_COUNT=$(ls -1 consciousness/*.json 2>/dev/null | wc -l)
    success "Found $PATTERN_COUNT consciousness patterns"
    
    # Check symlink in runtime
    if [ -L "runtime/consciousness" ]; then
        success "Runtime consciousness symlink exists"
    else
        warning "Runtime consciousness symlink missing"
        info "  Create with: cd runtime && ln -s ../consciousness consciousness"
    fi
else
    error "Consciousness directory missing"
fi

# 5. Check Node Dependencies
section "5. Node.js Environment"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installed: $NODE_VERSION"
else
    error "Node.js not found"
fi

if command -v npx &> /dev/null; then
    success "npx available"
else
    error "npx not available"
fi

if [ -d "node_modules" ]; then
    MODULE_COUNT=$(ls -1 node_modules 2>/dev/null | wc -l)
    if [ "$MODULE_COUNT" -gt 0 ]; then
        success "Node modules installed ($MODULE_COUNT packages)"
    else
        error "Node modules directory empty"
        info "  Run: npm install"
    fi
else
    error "Node modules not installed"
    info "  Run: npm install"
fi

# Check specific dependencies
for pkg in "ws" "lru-cache" "zod"; do
    if [ -d "node_modules/$pkg" ]; then
        success "Package installed: $pkg"
    else
        error "Missing package: $pkg"
    fi
done

# 6. Check Port Availability
section "6. Port & Process Check"

info "Checking port $NEXUS_PORT..."
if command -v lsof &> /dev/null; then
    if lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -Pi :$NEXUS_PORT -sTCP:LISTEN -t)
        PROCESS=$(ps -p $PID -o comm= 2>/dev/null)
        success "Port $NEXUS_PORT in use by PID $PID ($PROCESS)"
    else
        warning "Port $NEXUS_PORT not in use (NEXUS not running?)"
    fi
else
    info "lsof not available, skipping port check"
fi

info "Checking for NEXUS process..."
if pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
    NEXUS_PID=$(pgrep -f "nexus-runtime.v2.ts")
    success "NEXUS process running (PID: $NEXUS_PID)"
else
    warning "NEXUS process not found"
    info "  Start with: cd tools && bash start-nexus-enhanced.sh"
fi

# 7. Check API Endpoints
section "7. API Connectivity"

info "Testing NEXUS API..."
if curl -fsS --max-time 3 "$NEXUS_URL/status" > /dev/null 2>&1; then
    success "NEXUS API responding at $NEXUS_URL"
    
    # Get status details
    if command -v jq &> /dev/null; then
        STATUS=$(curl -fsS --max-time 3 "$NEXUS_URL/status" 2>/dev/null)
        VERSION=$(echo "$STATUS" | jq -r '.version // "unknown"')
        UPTIME=$(echo "$STATUS" | jq -r '.uptime // "unknown"')
        PERSONALITIES=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities // 0')
        PATTERNS=$(echo "$STATUS" | jq -r '.consciousnessBridge.patternsLoaded // 0')
        
        info "  Version: $VERSION"
        info "  Uptime: $UPTIME"
        info "  Personalities: $PERSONALITIES"
        info "  Patterns: $PATTERNS"
    fi
else
    error "Cannot reach NEXUS API at $NEXUS_URL"
    info "  Check if NEXUS is running"
    info "  Check firewall/network settings"
fi

# 8. Check Logs
section "8. Log Files"

if [ -d "tools" ]; then
    LOG_COUNT=$(ls -1 tools/nexus-startup-*.log 2>/dev/null | wc -l)
    if [ "$LOG_COUNT" -gt 0 ]; then
        success "Found $LOG_COUNT log files"
        LATEST_LOG=$(ls -t tools/nexus-startup-*.log 2>/dev/null | head -1)
        info "  Latest: $LATEST_LOG"
        
        # Check for errors in latest log
        if [ -f "$LATEST_LOG" ]; then
            ERROR_COUNT=$(grep -i "error" "$LATEST_LOG" 2>/dev/null | wc -l)
            if [ "$ERROR_COUNT" -gt 0 ]; then
                warning "Found $ERROR_COUNT error lines in latest log"
                info "  View with: tail -20 $LATEST_LOG"
            else
                success "No errors in latest log"
            fi
        fi
    else
        info "No log files found (NEXUS hasn't been started yet)"
    fi
fi

# 9. Check NUXEE
section "9. NUXEE UX Engine"

if [ -d "tools/nuxee" ]; then
    NUXEE_FILES=$(ls -1 tools/nuxee/*.{py,sh,json} 2>/dev/null | wc -l)
    success "NUXEE installed ($NUXEE_FILES files)"
else
    warning "NUXEE not found in tools/nuxee"
fi

# 10. System Resources
section "10. System Resources"

info "Checking disk space..."
DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    success "Disk space OK: ${DISK_USAGE}% used"
else
    warning "Disk space high: ${DISK_USAGE}% used"
fi

info "Checking memory..."
if command -v free &> /dev/null; then
    MEM_USED=$(free -m | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEM_USED" -lt 90 ]; then
        success "Memory usage OK: ${MEM_USED}%"
    else
        warning "Memory usage high: ${MEM_USED}%"
    fi
fi

# Summary
section "Summary & Recommendations"

echo ""
if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
    success "✨ All checks passed! NEXUS 5.0 is healthy."
elif [ $ISSUES_FOUND -eq 0 ]; then
    success "System operational with $WARNINGS_FOUND warnings"
    echo ""
    echo "  Review warnings above for optimization opportunities"
else
    error "Found $ISSUES_FOUND critical issues and $WARNINGS_FOUND warnings"
    echo ""
    echo "  Critical Actions:"
    echo "  1. Fix missing files/directories"
    echo "  2. Run: npm install"
    echo "  3. Create symlinks: cd runtime && ln -s ../profiles profiles && ln -s ../consciousness consciousness"
    echo "  4. Start NEXUS: cd tools && bash start-nexus-enhanced.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Diagnostic complete!"
echo "Issues: $ISSUES_FOUND | Warnings: $WARNINGS_FOUND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit codes
if [ $ISSUES_FOUND -gt 0 ]; then
    exit 1
elif [ $WARNINGS_FOUND -gt 0 ]; then
    exit 2
else
    exit 0
fi
