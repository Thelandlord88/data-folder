#!/bin/bash
# NEXUS File Integrity Check
# Verifies all critical NEXUS files exist and are valid
#
# Exit Codes:
#   0 - All files OK
#   1 - Critical files missing
#   2 - File corruption detected
#   3 - Permission issues

# Don't use set -e because we want to handle errors ourselves
set -uo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NEXUS_ROOT="${NEXUS_ROOT:-/workspaces/data-folder/Nexus-4.5}"
ISSUES_FOUND=0
WARNINGS_FOUND=0
FILES_CHECKED=0

echo "🔍 NEXUS File Integrity Check"
echo "=============================="
echo "Root: $NEXUS_ROOT"
echo "Time: $(date)"
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
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_file() {
    local file=$1
    local critical=${2:-true}
    local full_path="$NEXUS_ROOT/$file"
    
    FILES_CHECKED=$((FILES_CHECKED + 1))
    
    if [ -f "$full_path" ]; then
        # Check file size
        local size=0
        if stat -c%s "$full_path" >/dev/null 2>&1; then
            size=$(stat -c%s "$full_path")
        else
            size=$(wc -c < "$full_path" | tr -d ' ')
        fi
        
        if [ "$size" -eq 0 ]; then
            if [ "$critical" = "true" ]; then
                error "$file exists but is EMPTY"
                return 1
            else
                warning "$file exists but is EMPTY"
                return 1
            fi
        fi
        
        # Check readability
        if [ -r "$full_path" ]; then
            success "$file (${size} bytes)"
            return 0
        else
            error "$file is NOT readable (permission issue)"
            return 1
        fi
    else
        if [ "$critical" = "true" ]; then
            error "$file is MISSING"
            return 1
        else
            warning "$file is MISSING (optional)"
            return 1
        fi
    fi
}

check_executable() {
    local file=$1
    local full_path="$NEXUS_ROOT/$file"
    
    FILES_CHECKED=$((FILES_CHECKED + 1))
    
    if [ -f "$full_path" ]; then
        if [ -x "$full_path" ]; then
            success "$file (executable)"
            return 0
        else
            error "$file is NOT executable"
            echo "  Fix: chmod +x $full_path"
            return 1
        fi
    else
        error "$file is MISSING"
        return 1
    fi
}

check_directory() {
    local dir=$1
    local critical=${2:-true}
    local full_path="$NEXUS_ROOT/$dir"
    
    if [ -d "$full_path" ]; then
        local count=$(find "$full_path" -type f 2>/dev/null | wc -l | xargs)
        success "$dir/ ($count files)"
        return 0
    else
        if [ "$critical" = "true" ]; then
            error "$dir/ directory is MISSING"
            return 1
        else
            warning "$dir/ directory is MISSING (optional)"
            return 1
        fi
    fi
}

check_json_syntax() {
    local file=$1
    local full_path="$NEXUS_ROOT/$file"
    
    if [ ! -f "$full_path" ]; then
        return 1
    fi
    
    if command -v jq &> /dev/null; then
        if jq empty "$full_path" 2>/dev/null; then
            success "$file (valid JSON)"
            return 0
        else
            error "$file has INVALID JSON syntax"
            return 1
        fi
    else
        info "$file (JSON syntax not checked - jq not available)"
        return 0
    fi
}

check_typescript_syntax() {
    local file=$1
    local full_path="$NEXUS_ROOT/$file"
    
    if [ ! -f "$full_path" ]; then
        return 1
    fi
    
    # Basic syntax check - look for common issues
    if grep -q "syntax error" "$full_path" 2>/dev/null; then
        error "$file contains syntax errors"
        return 1
    fi
    
    # Check if npx tsc is available for real check
    if command -v npx &> /dev/null && npx -y typescript --version &> /dev/null; then
        if npx tsc --noEmit "$full_path" 2>/dev/null; then
            success "$file (valid TypeScript)"
            return 0
        else
            warning "$file may have TypeScript errors"
            return 1
        fi
    else
        info "$file (TypeScript syntax not fully checked)"
        return 0
    fi
}

# 1. Core Runtime Files
section "1. Core Runtime Files"

info "Checking main runtime files..."
check_file "nexus-runtime.v2.ts" true
check_file "NEXUS.engine.v2.ts" true
check_file "nexus-bridge.ts" true
check_file "nexus-bridge.types.ts" true

# 2. Configuration Files
section "2. Configuration Files"

info "Checking configuration files..."
check_json_syntax "package.json"
check_json_syntax "tsconfig.json"
check_file "package.json" true
check_file "tsconfig.json" true

# 3. Personality Files
section "3. Personality Files"

info "Checking personality directory..."
check_directory "profiles" true

if [ -d "$NEXUS_ROOT/profiles" ]; then
    info "Checking personality JSON files..."
    PERSONALITY_COUNT=$(find "$NEXUS_ROOT/profiles" -name "*.json" -type f 2>/dev/null | wc -l | xargs)
    
    if [ "$PERSONALITY_COUNT" -ge 45 ]; then
        success "Found $PERSONALITY_COUNT personality files (expected ≥45)"
    elif [ "$PERSONALITY_COUNT" -ge 1 ]; then
        warning "Found only $PERSONALITY_COUNT personality files (expected 45)"
    else
        error "No personality files found in profiles/"
    fi
    
    # Check a few key personalities
    info "Checking key personalities..."
    check_file "profiles/pythonista.json" false
    check_file "profiles/hunter.json" false
    check_file "profiles/daedalus.json" false
    check_file "profiles/guardian.json" false
    
    # Validate JSON syntax of personality files
    info "Validating personality JSON syntax..."
    INVALID_JSON=0
    for json_file in "$NEXUS_ROOT/profiles"/*.json; do
        if [ -f "$json_file" ]; then
            if command -v jq &> /dev/null; then
                if ! jq empty "$json_file" 2>/dev/null; then
                    error "$(basename "$json_file") has invalid JSON"
                    ((INVALID_JSON++))
                fi
            fi
        fi
    done
    
    if [ $INVALID_JSON -eq 0 ]; then
        success "All personality files have valid JSON syntax"
    fi
fi

# 4. Consciousness Patterns
section "4. Consciousness Patterns"

info "Checking consciousness directory..."
check_directory "consciousness" true

if [ -d "$NEXUS_ROOT/consciousness" ]; then
    info "Checking consciousness pattern files..."
    
    # Check for key patterns
    check_file "consciousness/problem-decomposition.json" false
    check_file "consciousness/systems-thinking.json" false
    check_file "consciousness/workflow-efficiency.json" false
    check_file "consciousness/breakthrough-moments.json" false
    
    PATTERN_COUNT=$(find "$NEXUS_ROOT/consciousness" -name "*.json" -type f 2>/dev/null | wc -l | xargs)
    if [ "$PATTERN_COUNT" -ge 4 ]; then
        success "Found $PATTERN_COUNT consciousness patterns"
    else
        warning "Found only $PATTERN_COUNT consciousness patterns (expected ≥4)"
    fi
fi

# 5. Source Files
section "5. Source Files"

info "Checking src directory..."
check_directory "src" true

if [ -d "$NEXUS_ROOT/src" ]; then
    info "Checking key source files..."
    TS_COUNT=$(find "$NEXUS_ROOT/src" -name "*.ts" -type f 2>/dev/null | wc -l | xargs)
    JS_COUNT=$(find "$NEXUS_ROOT/src" -name "*.js" -type f 2>/dev/null | wc -l | xargs)
    MJS_COUNT=$(find "$NEXUS_ROOT/src" -name "*.mjs" -type f 2>/dev/null | wc -l | xargs)
    
    TOTAL_SRC=$((TS_COUNT + JS_COUNT + MJS_COUNT))
    
    if [ $TOTAL_SRC -gt 0 ]; then
        success "Found $TOTAL_SRC source files (TS: $TS_COUNT, JS: $JS_COUNT, MJS: $MJS_COUNT)"
    else
        warning "No source files found in src/"
    fi
fi

# 6. Validation Files
section "6. Validation Files"

info "Checking validation directory..."
check_directory "validation" false

if [ -d "$NEXUS_ROOT/validation" ]; then
    VAL_COUNT=$(find "$NEXUS_ROOT/validation" -name "*.ts" -o -name "*.js" 2>/dev/null | wc -l | xargs)
    if [ $VAL_COUNT -gt 0 ]; then
        success "Found $VAL_COUNT validation files"
    fi
fi

# 7. Loader Files
section "7. Loader Files"

info "Checking loaders directory..."
check_directory "loaders" false

if [ -d "$NEXUS_ROOT/loaders" ]; then
    LOADER_COUNT=$(find "$NEXUS_ROOT/loaders" -name "*.ts" -o -name "*.js" -o -name "*.mjs" 2>/dev/null | wc -l | xargs)
    if [ $LOADER_COUNT -gt 0 ]; then
        success "Found $LOADER_COUNT loader files"
    fi
fi

# 8. CSS Engine Files
section "8. CSS Engine Files"

info "Checking css-engine directory..."
check_directory "css-engine" false

if [ -d "$NEXUS_ROOT/css-engine" ]; then
    CSS_COUNT=$(find "$NEXUS_ROOT/css-engine" -type f 2>/dev/null | wc -l | xargs)
    if [ $CSS_COUNT -gt 0 ]; then
        success "Found $CSS_COUNT CSS engine files"
    fi
fi

# 9. Type Definition Files
section "9. Type Definition Files"

info "Checking types directory..."
check_directory "types" false

if [ -d "$NEXUS_ROOT/types" ]; then
    TYPE_COUNT=$(find "$NEXUS_ROOT/types" -name "*.ts" -o -name "*.d.ts" 2>/dev/null | wc -l | xargs)
    if [ $TYPE_COUNT -gt 0 ]; then
        success "Found $TYPE_COUNT type definition files"
    fi
fi

# 10. Executable Scripts
section "10. Executable Scripts"

info "Checking executable scripts..."
check_executable "health-check.sh"
check_executable "troubleshoot.sh"
check_executable "deploy-health-check.sh"
check_executable "start-nexus.sh" || info "start-nexus.sh not found (optional)"

# 11. Documentation Files
section "11. Documentation Files"

info "Checking documentation..."
check_file "README.md" true
check_file "DEPLOYMENT_GUIDE.md" false
check_file "HEALTH_CHECK_GUIDE.md" false
check_file "API_GUIDE.md" false
check_file "TROUBLESHOOTING.md" false

DOC_COUNT=$(find "$NEXUS_ROOT" -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l | xargs)
if [ $DOC_COUNT -gt 0 ]; then
    success "Found $DOC_COUNT documentation files"
fi

# 12. Log Directory
section "12. Log Directory"

info "Checking logs directory..."
if [ -d "$NEXUS_ROOT/logs" ]; then
    LOG_COUNT=$(find "$NEXUS_ROOT/logs" -name "*.log" 2>/dev/null | wc -l | xargs)
    success "logs/ directory exists ($LOG_COUNT log files)"
else
    info "logs/ directory not found (will be created at runtime)"
fi

# 13. Node Modules
section "13. Dependencies"

info "Checking node_modules..."
if [ -d "$NEXUS_ROOT/node_modules" ]; then
    MODULE_COUNT=$(find "$NEXUS_ROOT/node_modules" -maxdepth 1 -type d 2>/dev/null | wc -l | xargs)
    success "node_modules/ exists ($MODULE_COUNT packages)"
    
    # Check for critical dependencies
    info "Checking critical dependencies..."
    [ -d "$NEXUS_ROOT/node_modules/tsx" ] && success "tsx installed" || warning "tsx not installed"
    [ -d "$NEXUS_ROOT/node_modules/typescript" ] && success "typescript installed" || warning "typescript not installed"
else
    warning "node_modules/ not found"
    echo "  Run: npm install"
fi

# 14. File Permissions Summary
section "14. File Permissions Summary"

info "Checking critical file permissions..."
PERM_ISSUES=0

for script in health-check.sh troubleshoot.sh deploy-health-check.sh start-nexus.sh; do
    if [ -f "$NEXUS_ROOT/$script" ]; then
        if [ ! -x "$NEXUS_ROOT/$script" ]; then
            error "$script is not executable"
            PERM_ISSUES=$((PERM_ISSUES + 1))
        fi
    fi
done

if [ $PERM_ISSUES -eq 0 ]; then
    success "All scripts have correct permissions"
else
    echo "  Fix all: chmod +x $NEXUS_ROOT/*.sh"
fi

# 15. Package Lock Files
section "15. Package Lock Files"

info "Checking package lock files..."
if [ -f "$NEXUS_ROOT/package-lock.json" ]; then
    success "package-lock.json exists"
elif [ -f "$NEXUS_ROOT/yarn.lock" ]; then
    success "yarn.lock exists"
elif [ -f "$NEXUS_ROOT/pnpm-lock.yaml" ]; then
    success "pnpm-lock.yaml exists"
else
    warning "No package lock file found"
    echo "  Consider running: npm install"
fi

# 16. Summary
section "16. Summary & Recommendations"

echo ""
echo "Files checked: $FILES_CHECKED"
echo "Issues found: $ISSUES_FOUND"
echo "Warnings: $WARNINGS_FOUND"
echo ""

if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
    success "All files OK! NEXUS file structure is intact. ✨"
elif [ $ISSUES_FOUND -eq 0 ]; then
    warning "Found $WARNINGS_FOUND warning(s), but no critical issues."
    echo ""
    echo "Recommendations:"
    echo "  - Review warnings above"
    echo "  - Install missing optional files if needed"
    echo "  - Run: npm install (if node_modules missing)"
else
    error "Found $ISSUES_FOUND critical issue(s)."
    echo ""
    echo "Action Required:"
    echo "  1. Review errors above (marked with ❌)"
    echo "  2. Restore missing files from backup or repository"
    echo "  3. Fix permissions: chmod +x *.sh"
    echo "  4. Run: npm install (if dependencies missing)"
    echo "  5. Validate JSON files if corrupted"
    echo ""
    echo "To restore from git:"
    echo "  git checkout $NEXUS_ROOT"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File integrity check complete!"
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
