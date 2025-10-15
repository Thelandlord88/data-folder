#!/bin/bash
###############################################################################
# NEXUS 5.0 Complete Validation & Dependency Check
# Uses dependency tracers to validate all file linkages
###############################################################################

set -uo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ISSUES=0
WARNINGS=0

success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; ((WARNINGS++)); }
error() { echo -e "${RED}❌ $1${NC}"; ((ISSUES++)); }
info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

echo "🔍 NEXUS 5.0 Complete Validation & Dependency Check"
echo "===================================================="
echo "Time: $(date)"
echo ""

cd /workspaces/data-folder/Nexus-5.0 || exit 1

# 1. Validate Core Runtime Files
section "1. Core Runtime File Dependencies"

info "Analyzing nexus-runtime.v2.ts dependencies..."
if [ -f "runtime/nexus-runtime.v2.ts" ]; then
    # Extract imports from runtime
    RUNTIME_IMPORTS=$(grep -E "^import.*from" runtime/nexus-runtime.v2.ts | wc -l)
    info "  Found $RUNTIME_IMPORTS import statements"
    
    # Check critical imports
    if grep -q "PersonalityRegistryLoader" runtime/nexus-runtime.v2.ts; then
        success "  PersonalityRegistryLoader import found"
    else
        error "  Missing PersonalityRegistryLoader import"
    fi
    
    if grep -q "NEXUS.engine.v2" runtime/nexus-runtime.v2.ts; then
        success "  NEXUS.engine.v2 import found"
    else
        error "  Missing NEXUS.engine.v2 import"
    fi
    
    if grep -q "nexus-bridge" runtime/nexus-runtime.v2.ts; then
        success "  nexus-bridge import found"
    else
        warning "  nexus-bridge import not found"
    fi
else
    error "Runtime file not found"
fi

# 2. Validate Loader Dependencies
section "2. Personality Loader Dependencies"

if [ -f "runtime/loaders/PersonalityRegistryLoader.ts" ]; then
    success "PersonalityRegistryLoader.ts exists"
    
    # Check if it can access profiles
    if [ -L "runtime/profiles" ] || [ -d "runtime/profiles" ]; then
        TARGET=$(readlink runtime/profiles 2>/dev/null || echo "direct")
        if [ "$TARGET" = "direct" ]; then
            info "  profiles is a direct directory"
        else
            success "  profiles symlink → $TARGET"
        fi
    else
        error "  No profiles directory/symlink in runtime"
    fi
else
    error "PersonalityRegistryLoader.ts not found"
fi

# 3. Validate Consciousness Bridge
section "3. Consciousness Bridge Dependencies"

if [ -f "runtime/nexus-bridge.ts" ]; then
    success "nexus-bridge.ts exists"
    
    # Check consciousness access
    if [ -L "runtime/consciousness" ] || [ -d "runtime/consciousness" ]; then
        TARGET=$(readlink runtime/consciousness 2>/dev/null || echo "direct")
        if [ "$TARGET" = "direct" ]; then
            info "  consciousness is a direct directory"
        else
            success "  consciousness symlink → $TARGET"
        fi
    else
        warning "  No consciousness directory/symlink in runtime"
    fi
else
    error "nexus-bridge.ts not found"
fi

# 4. Check Engine Dependencies
section "4. NEXUS Engine Dependencies"

if [ -f "runtime/NEXUS.engine.v2.ts" ]; then
    success "NEXUS.engine.v2.ts exists"
    
    # Check for ventriloquist imports
    if grep -q "PersonalityVentriloquist" runtime/NEXUS.engine.v2.ts; then
        success "  PersonalityVentriloquist import found"
        
        if [ -f "runtime/PersonalityVentriloquist.ts" ]; then
            success "  PersonalityVentriloquist.ts exists in runtime"
        else
            error "  PersonalityVentriloquist.ts missing from runtime"
        fi
    fi
    
    if grep -q "StreamingVentriloquist" runtime/NEXUS.engine.v2.ts; then
        info "  StreamingVentriloquist import found"
        
        if [ -f "runtime/StreamingVentriloquist.ts" ]; then
            success "  StreamingVentriloquist.ts exists in runtime"
        else
            warning "  StreamingVentriloquist.ts missing from runtime"
        fi
    fi
else
    error "NEXUS.engine.v2.ts not found"
fi

# 5. Validate Source Dependencies
section "5. Source File Dependencies"

if [ -d "runtime/src" ]; then
    SRC_FILES=$(find runtime/src -name "*.ts" -o -name "*.js" | wc -l)
    success "runtime/src exists with $SRC_FILES files"
    
    # Check performance cache
    if [ -f "runtime/src/performance-cache.ts" ] || [ -f "runtime/src/performance-cache.js" ]; then
        success "  performance-cache found"
    else
        warning "  performance-cache not found"
    fi
else
    warning "runtime/src directory not found"
fi

# 6. Validate Type Definitions
section "6. Type Definition Dependencies"

if [ -d "runtime/types" ]; then
    TYPE_FILES=$(find runtime/types -name "*.ts" -o -name "*.d.ts" | wc -l)
    success "runtime/types exists with $TYPE_FILES files"
    
    # Check for personality types
    if [ -f "runtime/types/personality.types.ts" ]; then
        success "  personality.types.ts found"
    else
        warning "  personality.types.ts not found"
    fi
else
    warning "runtime/types directory not found"
fi

# 7. Validate Validation Directory
section "7. Validation Dependencies"

if [ -d "runtime/validation" ]; then
    VALIDATION_FILES=$(find runtime/validation -name "*.ts" -o -name "*.js" | wc -l)
    success "runtime/validation exists with $VALIDATION_FILES files"
    
    if [ -f "runtime/validation/personality-schema.ts" ] || [ -f "runtime/validation/personality-schema.js" ]; then
        success "  personality-schema found"
    else
        warning "  personality-schema not found"
    fi
else
    warning "runtime/validation directory not found"
fi

# 8. Check for Missing Files Referenced in Code
section "8. Missing File Detection"

info "Scanning for import statements in runtime files..."

MISSING_COUNT=0

# Scan all TypeScript files in runtime
while IFS= read -r file; do
    # Extract import paths
    grep -Eo "from ['\"]([^'\"]+)['\"]" "$file" 2>/dev/null | \
    sed "s/from ['\"]//;s/['\"]$//" | \
    while read -r import_path; do
        # Skip node_modules
        if [[ "$import_path" =~ ^(ws|lru-cache|zod|node:) ]]; then
            continue
        fi
        
        # Resolve relative paths
        file_dir=$(dirname "$file")
        if [[ "$import_path" =~ ^\. ]]; then
            # Relative import
            resolved="${file_dir}/${import_path}"
        else
            # Absolute-ish import
            resolved="runtime/${import_path}"
        fi
        
        # Try different extensions
        found=false
        for ext in "" ".ts" ".js" ".mjs" ".json"; do
            if [ -f "${resolved}${ext}" ]; then
                found=true
                break
            fi
        done
        
        if [ "$found" = false ]; then
            # Check if it's a directory with index
            if [ -f "${resolved}/index.ts" ] || [ -f "${resolved}/index.js" ]; then
                found=true
            fi
        fi
        
        if [ "$found" = false ]; then
            warning "  Missing: $import_path (from $(basename $file))"
            ((MISSING_COUNT++))
        fi
    done
done < <(find runtime -name "*.ts" -type f)

if [ "$MISSING_COUNT" -eq 0 ]; then
    success "No missing imports detected"
else
    warning "Found $MISSING_COUNT potentially missing imports"
fi

# 9. Test Runtime Can Start
section "9. Runtime Startup Test"

info "Checking if NEXUS is currently running..."
if pgrep -f "nexus-runtime.v2.ts" > /dev/null; then
    PID=$(pgrep -f "nexus-runtime.v2.ts" | head -1)
    success "NEXUS is running (PID: $PID)"
    
    # Test API
    if curl -fsS --max-time 2 "http://127.0.0.1:8080/status" > /dev/null 2>&1; then
        success "API is responding"
        
        # Get personality count
        PERSONALITY_COUNT=$(curl -fsS "http://127.0.0.1:8080/status" 2>/dev/null | \
                           grep -o '"totalPersonalities":[0-9]*' | \
                           grep -o '[0-9]*')
        
        if [ "$PERSONALITY_COUNT" = "45" ]; then
            success "All 45 personalities loaded"
        else
            warning "Only $PERSONALITY_COUNT personalities loaded (expected 45)"
        fi
    else
        warning "API not responding"
    fi
else
    warning "NEXUS not currently running"
    info "  Start with: cd tools && bash start-nexus-enhanced.sh"
fi

# 10. Validate Package Dependencies
section "10. Node Package Dependencies"

if [ -f "package.json" ]; then
    success "package.json exists"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        MODULE_COUNT=$(ls -1 node_modules 2>/dev/null | wc -l)
        success "node_modules exists ($MODULE_COUNT packages)"
        
        # Check critical dependencies
        for pkg in "ws" "lru-cache" "zod"; do
            if [ -d "node_modules/$pkg" ]; then
                success "  $pkg installed"
            else
                error "  $pkg missing"
            fi
        done
    else
        error "node_modules not found - run: npm install"
    fi
else
    error "package.json not found"
fi

# 11. Summary Report
section "Summary"

echo ""
if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    success "✨ All validations passed! NEXUS 5.0 has complete connectivity."
    success "All files are properly linked and dependencies resolved."
elif [ $ISSUES -eq 0 ]; then
    success "Core functionality validated with $WARNINGS warnings"
    info "Warnings don't prevent operation but should be reviewed"
else
    error "Found $ISSUES critical issues and $WARNINGS warnings"
    echo ""
    echo "  Critical issues may prevent NEXUS from operating at full capacity"
    echo "  Review errors above and resolve before production use"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Validation complete!"
echo "Issues: $ISSUES | Warnings: $WARNINGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit codes
if [ $ISSUES -gt 0 ]; then
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    exit 2
else
    exit 0
fi
