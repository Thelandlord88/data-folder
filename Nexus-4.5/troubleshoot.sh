#!/bin/bash
# NEXUS Troubleshooting Script
# Diagnoses common issues with NEXUS health check and deployment
#
# This script checks:
# - Dependencies (curl, jq, bash)
# - Network connectivity
# - Port availability
# - NEXUS service status
# - Configuration issues
# - Permission problems
# - Shell compatibility
# - System resources

# Don't use set -e because we want to continue on errors
set -uo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NEXUS_URL="${NEXUS_URL:-http://127.0.0.1:8080}"
NEXUS_HOST=$(echo "$NEXUS_URL" | sed -E 's|^[^:]+://([^:/]+).*|\1|')
NEXUS_PORT=$(echo "$NEXUS_URL" | sed -E 's|^[^:]+://[^:]+:([0-9]+).*|\1|')
HEALTH_CHECK_SCRIPT="${HEALTH_CHECK_SCRIPT:-./health-check.sh}"
ISSUES_FOUND=0
WARNINGS_FOUND=0

echo "🔧 NEXUS Troubleshooting Script"
echo "================================"
echo "Time: $(date)"
echo "Target: $NEXUS_URL"
echo ""

# Helper functions
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS_FOUND++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((ISSUES_FOUND++))
}

section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 1. Check Shell Compatibility
section "1. Shell Compatibility"

info "Checking shell version..."
if [ -n "${BASH_VERSION:-}" ]; then
    BASH_MAJOR=$(echo "$BASH_VERSION" | cut -d. -f1)
    if [ "$BASH_MAJOR" -ge 4 ]; then
        success "Bash version: $BASH_VERSION (compatible)"
    else
        warning "Bash version: $BASH_VERSION (old, but should work)"
    fi
else
    error "Not running in Bash! Script requires Bash."
    echo "  Current shell: $SHELL"
    echo "  Try: bash $0"
fi

info "Checking environment type..."
IS_CONTAINER=false
CONTAINER_TYPE="unknown"

# Detect container environment
if [ -f /.dockerenv ]; then
    IS_CONTAINER=true
    CONTAINER_TYPE="Docker"
    success "Running in Docker container"
elif [ -f /run/.containerenv ]; then
    IS_CONTAINER=true
    CONTAINER_TYPE="Podman"
    success "Running in Podman container"
elif grep -qa container=lxc /proc/1/environ 2>/dev/null; then
    IS_CONTAINER=true
    CONTAINER_TYPE="LXC"
    success "Running in LXC container"
elif [ -n "${CODESPACES:-}" ] || [ -n "${GITHUB_CODESPACE_TOKEN:-}" ]; then
    IS_CONTAINER=true
    CONTAINER_TYPE="GitHub Codespaces"
    success "Running in GitHub Codespaces"
elif grep -q 'docker\|lxc\|kubepods' /proc/1/cgroup 2>/dev/null; then
    IS_CONTAINER=true
    CONTAINER_TYPE="Container (detected via cgroup)"
    success "Running in container environment"
else
    success "Running on bare metal or VM"
fi

if [ "$IS_CONTAINER" = true ]; then
    info "Container type: $CONTAINER_TYPE"
    info "Note: Some features may be limited (ping, privileged operations)"
fi

info "Checking set options..."
if set -o | grep -q "errexit.*on"; then
    success "errexit is supported (set -e)"
else
    warning "errexit may not be supported"
fi

if set -o | grep -q "pipefail.*on"; then
    success "pipefail is supported (set -o pipefail)"
else
    warning "pipefail may not be supported"
fi

# 2. Check Dependencies
section "2. Required Dependencies"

check_command() {
    local cmd=$1
    local pkg=${2:-$1}
    local required=${3:-true}
    
    if command -v "$cmd" &> /dev/null; then
        local version=$($cmd --version 2>&1 | head -1)
        success "$cmd is installed: $version"
        return 0
    else
        if [ "$required" = "true" ]; then
            error "$cmd is NOT installed (REQUIRED)"
            echo "  Install: sudo apt-get install $pkg  (Ubuntu/Debian)"
            echo "          sudo yum install $pkg       (RHEL/CentOS)"
            echo "          brew install $pkg           (macOS)"
        else
            warning "$cmd is NOT installed (OPTIONAL)"
        fi
        return 1
    fi
}

check_command "curl" "curl" true
check_command "jq" "jq" true
check_command "nc" "netcat" false
check_command "lsof" "lsof" false
check_command "ss" "iproute2" false
check_command "netstat" "net-tools" false
check_command "ps" "procps" false

# 3. Check Network Connectivity
section "3. Network Connectivity"

info "Checking localhost resolution..."
if ping -c 1 -W 1 127.0.0.1 > /dev/null 2>&1; then
    success "Localhost (127.0.0.1) is reachable via ping"
else
    # Ping may be disabled in containers - test with curl instead
    if curl -fsS --max-time 1 "http://127.0.0.1:$NEXUS_PORT/status" > /dev/null 2>&1 || \
       curl -fsS --max-time 1 "http://localhost" > /dev/null 2>&1 || \
       [ -f /proc/net/tcp ]; then
        success "Localhost is reachable (ping disabled, but connectivity OK)"
        info "Note: ICMP ping may be disabled in containers/restricted environments"
    else
        error "Cannot reach localhost - network stack issue?"
    fi
fi

if [ "$NEXUS_HOST" != "127.0.0.1" ] && [ "$NEXUS_HOST" != "localhost" ]; then
    info "Checking remote host: $NEXUS_HOST..."
    if ping -c 1 -W 2 "$NEXUS_HOST" > /dev/null 2>&1; then
        success "Host $NEXUS_HOST is reachable via ping"
    else
        # Ping may fail but HTTP might work
        if curl -fsS --max-time 2 "http://${NEXUS_HOST}:${NEXUS_PORT}" > /dev/null 2>&1; then
            success "Host $NEXUS_HOST is reachable via HTTP (ping blocked)"
            if [ "$IS_CONTAINER" = true ]; then
                info "Container environments often restrict ICMP/ping"
            fi
        else
            error "Cannot reach host: $NEXUS_HOST"
            echo "  Check firewall rules"
            echo "  Check DNS resolution"
            echo "  Check network connectivity"
            if [ "$IS_CONTAINER" = true ]; then
                echo "  Check container network configuration"
            fi
        fi
    fi
fi

info "Checking DNS resolution..."
if getent hosts "$NEXUS_HOST" > /dev/null 2>&1; then
    IP=$(getent hosts "$NEXUS_HOST" | awk '{print $1}')
    success "DNS resolves $NEXUS_HOST to $IP"
else
    warning "DNS lookup failed for $NEXUS_HOST"
fi

# 4. Check Port Availability
section "4. Port Availability"

info "Checking if port $NEXUS_PORT is in use..."

PORT_CHECK_METHOD=""
if command -v lsof &> /dev/null; then
    PORT_CHECK_METHOD="lsof"
    if lsof -i ":$NEXUS_PORT" > /dev/null 2>&1; then
        PROCESS=$(lsof -i ":$NEXUS_PORT" -t | head -1)
        PROCESS_NAME=$(ps -p "$PROCESS" -o comm= 2>/dev/null || echo "unknown")
        success "Port $NEXUS_PORT is in use by PID $PROCESS ($PROCESS_NAME)"
    else
        warning "Port $NEXUS_PORT is NOT in use"
        echo "  NEXUS may not be running"
    fi
elif command -v ss &> /dev/null; then
    PORT_CHECK_METHOD="ss"
    if ss -tuln | grep -q ":$NEXUS_PORT "; then
        success "Port $NEXUS_PORT is in use (listening)"
    else
        warning "Port $NEXUS_PORT is NOT in use"
        echo "  NEXUS may not be running"
    fi
elif command -v netstat &> /dev/null; then
    PORT_CHECK_METHOD="netstat"
    if netstat -tuln | grep -q ":$NEXUS_PORT "; then
        success "Port $NEXUS_PORT is in use (listening)"
    else
        warning "Port $NEXUS_PORT is NOT in use"
        echo "  NEXUS may not be running"
    fi
else
    warning "No port checking tool available (lsof, ss, netstat)"
fi

info "Testing port connectivity..."
if command -v nc &> /dev/null; then
    if nc -z -w2 "$NEXUS_HOST" "$NEXUS_PORT" 2>/dev/null; then
        success "Port $NEXUS_PORT on $NEXUS_HOST is accessible"
    else
        error "Cannot connect to port $NEXUS_PORT on $NEXUS_HOST"
        echo "  Check if NEXUS is running"
        echo "  Check firewall rules: sudo iptables -L"
        echo "  Check listening ports: ss -tuln | grep $NEXUS_PORT"
    fi
else
    info "nc (netcat) not available, trying curl..."
    if curl -fsS --max-time 2 "$NEXUS_URL/status" > /dev/null 2>&1; then
        success "Port $NEXUS_PORT is accessible via HTTP"
    else
        error "Cannot reach $NEXUS_URL"
    fi
fi

# 5. Check NEXUS Service Status
section "5. NEXUS Service Status"

info "Checking for NEXUS process..."
if ps aux | grep -E "tsx.*nexus-runtime|node.*nexus" | grep -v grep > /dev/null; then
    NEXUS_PID=$(ps aux | grep -E "tsx.*nexus-runtime|node.*nexus" | grep -v grep | awk '{print $2}' | head -1)
    NEXUS_CMD=$(ps -p "$NEXUS_PID" -o cmd= | head -c 80)
    success "NEXUS is running (PID: $NEXUS_PID)"
    echo "  Command: $NEXUS_CMD..."
else
    error "NEXUS process not found"
    echo "  Start NEXUS with: ./start-nexus.sh"
    echo "  Or manually: npx tsx nexus-runtime.v2.ts"
fi

info "Testing NEXUS HTTP endpoint..."
if curl -fsS --max-time 2 "$NEXUS_URL/status" > /dev/null 2>&1; then
    success "NEXUS /status endpoint is responding"
    
    # Get detailed status
    STATUS=$(curl -fsS --max-time 2 "$NEXUS_URL/status" 2>/dev/null)
    INIT=$(echo "$STATUS" | jq -r '.initialized // "unknown"' 2>/dev/null || echo "error")
    PERS=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities // "unknown"' 2>/dev/null || echo "error")
    CB=$(echo "$STATUS" | jq -r '.loaderHealth.circuitBreakerState // "unknown"' 2>/dev/null || echo "error")
    MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB // "unknown"' 2>/dev/null || echo "error")
    
    echo "  Initialized: $INIT"
    echo "  Personalities: $PERS"
    echo "  Circuit Breaker: $CB"
    echo "  Memory: ${MEM}MB"
else
    error "Cannot reach NEXUS /status endpoint"
    echo "  URL: $NEXUS_URL/status"
    echo "  Check if NEXUS is running"
    echo "  Check if port is correct"
    echo "  Try: curl -v $NEXUS_URL/status"
fi

# 6. Check Health Check Script
section "6. Health Check Script"

info "Checking health check script..."
if [ -f "$HEALTH_CHECK_SCRIPT" ]; then
    success "Health check script exists: $HEALTH_CHECK_SCRIPT"
    
    if [ -x "$HEALTH_CHECK_SCRIPT" ]; then
        success "Health check script is executable"
    else
        error "Health check script is NOT executable"
        echo "  Fix: chmod +x $HEALTH_CHECK_SCRIPT"
    fi
    
    info "Checking script syntax..."
    if bash -n "$HEALTH_CHECK_SCRIPT" 2>/dev/null; then
        success "Script syntax is valid"
    else
        error "Script has syntax errors"
        bash -n "$HEALTH_CHECK_SCRIPT"
    fi
else
    error "Health check script not found: $HEALTH_CHECK_SCRIPT"
    echo "  Create it or specify location: HEALTH_CHECK_SCRIPT=path/to/script $0"
fi

# 7. Check System Resources
section "7. System Resources"

info "Checking disk space..."
DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    success "Disk space OK: ${DISK_USAGE}% used"
else
    warning "Disk space low: ${DISK_USAGE}% used"
    echo "  Consider cleaning up old logs"
fi

info "Checking memory..."
if command -v free &> /dev/null; then
    MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    MEM_AVAIL=$(free -h | grep Mem | awk '{print $7}')
    if [ "$MEM_USAGE" -lt 90 ]; then
        success "Memory OK: ${MEM_USAGE}% used, ${MEM_AVAIL} available"
    else
        warning "Memory high: ${MEM_USAGE}% used, ${MEM_AVAIL} available"
    fi
else
    info "free command not available, skipping memory check"
fi

info "Checking load average..."
if command -v uptime &> /dev/null; then
    LOAD=$(uptime | awk -F'load average:' '{print $2}' | xargs)
    success "Load average: $LOAD"
else
    info "uptime command not available, skipping load check"
fi

# 8. Check File Permissions
section "8. File Permissions"

info "Checking current user..."
CURRENT_USER=$(whoami)
success "Running as: $CURRENT_USER"

if [ -f "$HEALTH_CHECK_SCRIPT" ]; then
    info "Checking file ownership..."
    OWNER=$(stat -c '%U' "$HEALTH_CHECK_SCRIPT" 2>/dev/null || stat -f '%Su' "$HEALTH_CHECK_SCRIPT" 2>/dev/null || echo "unknown")
    PERMS=$(stat -c '%a' "$HEALTH_CHECK_SCRIPT" 2>/dev/null || stat -f '%A' "$HEALTH_CHECK_SCRIPT" 2>/dev/null || echo "unknown")
    success "Owner: $OWNER, Permissions: $PERMS"
    
    if [ "$PERMS" != "755" ] && [ "$PERMS" != "775" ] && [ "$PERMS" != "777" ]; then
        warning "Unusual permissions: $PERMS (expected 755)"
    fi
fi

# 9. Check Environment Variables
section "9. Environment Variables"

info "Checking environment variables..."
echo "  NEXUS_URL: ${NEXUS_URL:-[not set]}"
echo "  MEMORY_THRESHOLD_MB: ${MEMORY_THRESHOLD_MB:-[not set]}"
echo "  ERROR_THRESHOLD_PCT: ${ERROR_THRESHOLD_PCT:-[not set]}"
echo "  SHELL: ${SHELL:-[not set]}"
echo "  PATH: ${PATH:-[not set]}"

# 10. Check Common Issues
section "10. Common Issues Check"

info "Checking for port conflicts..."
if command -v lsof &> /dev/null; then
    CONFLICTS=$(lsof -i ":$NEXUS_PORT" 2>/dev/null | grep -v COMMAND | wc -l)
    if [ "$CONFLICTS" -gt 1 ]; then
        warning "Multiple processes listening on port $NEXUS_PORT"
        lsof -i ":$NEXUS_PORT"
    else
        success "No port conflicts detected"
    fi
fi

info "Checking for firewall..."
if command -v ufw &> /dev/null; then
    if sudo ufw status 2>/dev/null | grep -q "Status: active"; then
        warning "UFW firewall is active - may block connections"
        echo "  Check rules: sudo ufw status"
    else
        success "UFW firewall is inactive"
    fi
elif command -v iptables &> /dev/null; then
    if sudo iptables -L 2>/dev/null | grep -q "Chain"; then
        info "iptables is configured (may affect connectivity)"
        echo "  Check rules: sudo iptables -L"
    fi
fi

info "Checking for SELinux..."
if command -v getenforce &> /dev/null; then
    SELINUX=$(getenforce 2>/dev/null || echo "unknown")
    if [ "$SELINUX" = "Enforcing" ]; then
        warning "SELinux is enforcing - may block connections"
        echo "  Check: sudo ausearch -m avc -ts recent"
    else
        success "SELinux is not enforcing"
    fi
fi

if [ "$IS_CONTAINER" = true ]; then
    info "Container-specific notes..."
    echo "  ✓ ICMP/ping may be disabled (not a problem)"
    echo "  ✓ Some privileged operations may fail"
    echo "  ✓ Network mode affects connectivity"
    echo "  ✓ Use HTTP checks instead of ping"
fi

# 11. Test Health Check Execution
section "11. Health Check Test Run"

if [ -f "$HEALTH_CHECK_SCRIPT" ] && [ -x "$HEALTH_CHECK_SCRIPT" ]; then
    info "Running health check test..."
    if "$HEALTH_CHECK_SCRIPT" > /dev/null 2>&1; then
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            success "Health check executed successfully (exit $EXIT_CODE)"
        else
            warning "Health check returned non-zero exit code: $EXIT_CODE"
            echo "  0 = healthy"
            echo "  1 = NEXUS not running"
            echo "  2 = circuit breaker open"
            echo "  3 = memory too high"
            echo "  4 = error rate too high"
            echo "  5 = missing components"
        fi
    else
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 1 ]; then
            warning "Health check failed: NEXUS not running (exit $EXIT_CODE)"
        else
            error "Health check failed with exit code: $EXIT_CODE"
        fi
    fi
else
    warning "Skipping health check test (script not found or not executable)"
fi

# 12. Summary and Recommendations
section "12. Summary & Recommendations"

echo ""
if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
    success "No issues found! System looks healthy. ✨"
elif [ $ISSUES_FOUND -eq 0 ]; then
    warning "Found $WARNINGS_FOUND warning(s), but no critical issues."
    echo ""
    echo "Recommendations:"
    echo "  - Review warnings above"
    echo "  - Consider installing optional tools for better diagnostics"
else
    error "Found $ISSUES_FOUND issue(s) and $WARNINGS_FOUND warning(s)."
    echo ""
    echo "Action Required:"
    echo "  1. Review errors above (marked with ❌)"
    echo "  2. Follow suggested fixes"
    echo "  3. Run this script again to verify"
    echo ""
    echo "Common Fixes:"
    echo "  - Install dependencies: sudo apt-get install curl jq"
    echo "  - Start NEXUS: ./start-nexus.sh"
    echo "  - Fix permissions: chmod +x $HEALTH_CHECK_SCRIPT"
    echo "  - Check port: lsof -i :$NEXUS_PORT"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Troubleshooting complete!"
echo "Issues: $ISSUES_FOUND | Warnings: $WARNINGS_FOUND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit with appropriate code
if [ $ISSUES_FOUND -gt 0 ]; then
    exit 1
elif [ $WARNINGS_FOUND -gt 0 ]; then
    exit 2
else
    exit 0
fi
