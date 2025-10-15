#!/bin/bash
###############################################################################
# NEXUS 5.0 Integrity Check Script
# Validates file integrity, counts, and structure
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

success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; ((ISSUES++)); }
info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

echo "🔍 NEXUS 5.0 Integrity Check"
echo "============================"
echo "Time: $(date)"
echo ""

cd /workspaces/data-folder/Nexus-5.0 || { error "Cannot find Nexus-5.0"; exit 1; }

# 1. File Counts
section "1. File Count Validation"

check_file_count() {
    local dir=$1
    local pattern=$2
    local expected=$3
    local desc=$4
    
    if [ -d "$dir" ]; then
        COUNT=$(find "$dir" -name "$pattern" 2>/dev/null | wc -l)
        if [ "$COUNT" -eq "$expected" ]; then
            success "$desc: $COUNT files (expected: $expected)"
        else
            error "$desc: $COUNT files (expected: $expected)"
        fi
    else
        error "Directory not found: $dir"
    fi
}

check_file_count "runtime" "*.ts" "8" "Runtime TypeScript files"
check_file_count "personalities/registry" "*.json" "45" "Personality definitions"
check_file_count "consciousness" "*.json" "6" "Consciousness patterns"

# 2. Critical File Sizes
section "2. Critical File Size Validation"

check_file_size() {
    local file=$1
    local min_size=$2
    local desc=$3
    
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$SIZE" -gt "$min_size" ]; then
            success "$desc: ${SIZE} bytes"
        else
            error "$desc: ${SIZE} bytes (too small, min: $min_size)"
        fi
    else
        error "$desc: File not found"
    fi
}

check_file_size "runtime/nexus-runtime.v2.ts" "40000" "Main runtime"
check_file_size "runtime/NEXUS.engine.v2.ts" "15000" "Engine"
check_file_size "runtime/nexus-bridge.ts" "10000" "Consciousness bridge"
check_file_size "package.json" "200" "Package config"

# 3. Symlink Validation
section "3. Symlink Integrity"

check_symlink() {
    local link=$1
    local desc=$2
    
    if [ -L "$link" ]; then
        TARGET=$(readlink "$link")
        if [ -e "$link" ]; then
            success "$desc → $TARGET"
        else
            error "$desc: Broken symlink → $TARGET"
        fi
    else
        error "$desc: Not a symlink or doesn't exist"
    fi
}

check_symlink "runtime/profiles" "Personalities link"
check_symlink "runtime/consciousness" "Consciousness link"
check_symlink "profiles" "Root profiles link"

# 4. Personality Validation
section "4. Personality File Validation"

PERSONALITY_ERRORS=0
for profile in personalities/registry/*.json; do
    if [ -f "$profile" ]; then
        # Check if valid JSON
        if ! jq empty "$profile" 2>/dev/null; then
            error "Invalid JSON: $profile"
            ((PERSONALITY_ERRORS++))
        fi
    fi
done

if [ "$PERSONALITY_ERRORS" -eq 0 ]; then
    success "All personality files valid JSON"
else
    error "Found $PERSONALITY_ERRORS invalid personality files"
fi

# 5. Consciousness Pattern Validation
section "5. Consciousness Pattern Validation"

CONSCIOUSNESS_ERRORS=0
for pattern in consciousness/*.json; do
    if [ -f "$pattern" ]; then
        if ! jq empty "$pattern" 2>/dev/null; then
            error "Invalid JSON: $pattern"
            ((CONSCIOUSNESS_ERRORS++))
        fi
    fi
done

if [ "$CONSCIOUSNESS_ERRORS" -eq 0 ]; then
    success "All consciousness patterns valid JSON"
else
    error "Found $CONSCIOUSNESS_ERRORS invalid consciousness files"
fi

# 6. Directory Structure
section "6. Directory Structure"

EXPECTED_DIRS=(
    "runtime"
    "runtime/src"
    "runtime/loaders"
    "runtime/types"
    "runtime/dist"
    "personalities"
    "personalities/registry"
    "personalities/ventriloquist"
    "consciousness"
    "docs"
    "docs/architecture"
    "docs/sessions"
    "docs/meetings"
    "tools"
    "tools/nuxee"
    "tools/python"
    "config"
    "logs"
    "analytics"
    "tests"
    "lib"
)

MISSING_DIRS=0
for dir in "${EXPECTED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        : # Directory exists
    else
        error "Missing directory: $dir"
        ((MISSING_DIRS++))
    fi
done

if [ "$MISSING_DIRS" -eq 0 ]; then
    success "All expected directories present"
fi

# 7. Package Dependencies
section "7. Package Dependencies"

if [ -d "node_modules" ]; then
    CRITICAL_DEPS=("ws" "lru-cache" "zod")
    MISSING_DEPS=0
    
    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            success "Dependency installed: $dep"
        else
            error "Missing dependency: $dep"
            ((MISSING_DEPS++))
        fi
    done
    
    if [ "$MISSING_DEPS" -gt 0 ]; then
        warning "Run: npm install"
    fi
else
    error "node_modules directory missing"
    warning "Run: npm install"
fi

# 8. Documentation
section "8. Documentation Integrity"

DOC_FILES=(
    "README.md"
    "REORGANIZATION_COMPLETE.md"
    "REORGANIZATION_PLAN.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        SIZE=$(stat -f%z "$doc" 2>/dev/null || stat -c%s "$doc" 2>/dev/null)
        if [ "$SIZE" -gt 1000 ]; then
            success "Documentation: $doc (${SIZE} bytes)"
        else
            warning "Documentation may be incomplete: $doc (${SIZE} bytes)"
        fi
    else
        warning "Documentation missing: $doc"
    fi
done

# 9. Tools
section "9. Tools & Scripts"

TOOL_SCRIPTS=(
    "tools/start-nexus-enhanced.sh"
    "tools/troubleshoot.sh"
    "tools/check-integrity.sh"
)

for script in "${TOOL_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            success "Script: $script (executable)"
        else
            warning "Script not executable: $script"
            info "  Run: chmod +x $script"
        fi
    else
        warning "Script missing: $script"
    fi
done

# 10. NUXEE Integrity
section "10. NUXEE UX Engine"

if [ -d "tools/nuxee" ]; then
    NUXEE_SCRIPTS=(
        "tools/nuxee/enhance-ux.sh"
        "tools/nuxee/detect-ux-opportunities.sh"
        "tools/nuxee/nexus-ux-analyzer.py"
        "tools/nuxee/nexus-ux-applier.py"
    )
    
    NUXEE_MISSING=0
    for nuxee_file in "${NUXEE_SCRIPTS[@]}"; do
        if [ -f "$nuxee_file" ]; then
            success "NUXEE file: $(basename $nuxee_file)"
        else
            error "NUXEE file missing: $nuxee_file"
            ((NUXEE_MISSING++))
        fi
    done
    
    if [ "$NUXEE_MISSING" -eq 0 ]; then
        success "NUXEE complete"
    fi
else
    warning "NUXEE directory not found"
fi

# 11. Total Statistics
section "11. Installation Statistics"

TOTAL_FILES=$(find . -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
TS_FILES=$(find . -name "*.ts" 2>/dev/null | wc -l)
JSON_FILES=$(find . -name "*.json" 2>/dev/null | wc -l)
MD_FILES=$(find . -name "*.md" 2>/dev/null | wc -l)

info "Total files: $TOTAL_FILES"
info "Total size: $TOTAL_SIZE"
info "TypeScript files: $TS_FILES"
info "JSON files: $JSON_FILES"
info "Documentation files: $MD_FILES"

# Final Summary
section "Summary"

echo ""
if [ $ISSUES -eq 0 ]; then
    success "✨ All integrity checks passed!"
    success "NEXUS 5.0 installation is complete and valid"
else
    error "Found $ISSUES integrity issues"
    warning "Review errors above and fix before running NEXUS"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Integrity check complete!"
echo "Issues found: $ISSUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit with appropriate code
exit $ISSUES
