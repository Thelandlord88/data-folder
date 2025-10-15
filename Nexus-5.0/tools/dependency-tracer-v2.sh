#!/bin/bash

################################################################################
# DEPENDENCY TRACER v2.0 - Systematic File Relationship Analysis
# 
# FIXED ISSUES (v2.0):
# - ✅ Fixed braced glob in grep (portability issue)
# - ✅ Added proper option parsing (--deep, --format, --no-color)
# - ✅ Enhanced import pattern detection (require, import(), export from)
# - ✅ Added de-duplication for all dependency types
# - ✅ Added --no-color flag for CI environments
# - ✅ Improved path resolution with alias support
# - ✅ Added validation and error handling
#
# Usage:
#   ./dependency-tracer.sh <target-file> [options]
#
# Options:
#   --format=markdown|json|both  Output format (default: markdown)
#   --no-color                   Disable colored output
#   --deep                       Analyze transitive dependencies (not yet implemented)
#   --help                       Show this help message
#
# Examples:
#   ./dependency-tracer.sh src/components/FactsCarousel.astro
#   ./dependency-tracer.sh src/lib/suburbProvider.ts --format=both
#   ./dependency-tracer.sh src/pages/index.astro --no-color
#
# Created by: NEXUS System Architecture Team
# Date: October 12, 2025
# Version: 2.0.0
################################################################################

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_VERSION="2.0.0"
WORKSPACE_ROOT="$(pwd)"
OUTPUT_DIR="${WORKSPACE_ROOT}/__reports/dependency-traces"
TEMP_DIR="/tmp/dependency-tracer-$$"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Options (with defaults)
OPT_FORMAT="markdown"
OPT_NO_COLOR=false
OPT_DEEP=false

# Colors (can be disabled)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters
FORWARD_DEPS_COUNT=0
REVERSE_DEPS_COUNT=0
DATA_DEPS_COUNT=0
TYPE_DEPS_COUNT=0
TOTAL_LINES=0

# Arrays to store dependencies
declare -A FORWARD_DEPS_MAP
declare -A REVERSE_DEPS_MAP
declare -A DATA_DEPS_MAP
declare -A TYPE_DEPS_MAP
declare -a MISSING_DEPS

# ============================================================================
# OPTION PARSING
# ============================================================================

show_help() {
    cat << EOF
NEXUS Dependency Tracer v${SCRIPT_VERSION}

Usage:
    $0 <target-file> [options]

Arguments:
    <target-file>           File to analyze (required)

Options:
    --format=FORMAT         Output format: markdown, json, both (default: markdown)
    --no-color              Disable colored output (useful for CI)
    --deep                  Analyze transitive dependencies (planned)
    --help                  Show this help message

Examples:
    $0 src/components/FactsCarousel.astro
    $0 src/lib/suburbProvider.ts --format=both
    $0 src/pages/index.astro --no-color

Output:
    Reports are saved to: $OUTPUT_DIR

EOF
    exit 0
}

parse_options() {
    TARGET_FILE=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --format=*)
                OPT_FORMAT="${1#*=}"
                if [[ ! "$OPT_FORMAT" =~ ^(markdown|json|both)$ ]]; then
                    echo "Error: Invalid format. Use: markdown, json, or both"
                    exit 1
                fi
                shift
                ;;
            --no-color)
                OPT_NO_COLOR=true
                shift
                ;;
            --deep)
                OPT_DEEP=true
                shift
                ;;
            --help|-h)
                show_help
                ;;
            -*)
                echo "Error: Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
            *)
                if [[ -z "$TARGET_FILE" ]]; then
                    TARGET_FILE="$1"
                else
                    echo "Error: Multiple target files specified"
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    if [[ -z "$TARGET_FILE" ]]; then
        echo "Error: No target file specified"
        echo "Use --help for usage information"
        exit 1
    fi
}

# ============================================================================
# COLOR MANAGEMENT
# ============================================================================

setup_colors() {
    if [[ "$OPT_NO_COLOR" == true ]] || [[ ! -t 1 ]]; then
        # Disable colors for non-TTY or when requested
        RED=''
        GREEN=''
        YELLOW=''
        BLUE=''
        MAGENTA=''
        CYAN=''
        NC=''
    fi
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
}

print_section() {
    echo -e "\n${MAGENTA}▶ $1${NC}"
    echo -e "${MAGENTA}───────────────────────────────────────────────────────────${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ============================================================================
# VALIDATION
# ============================================================================

validate_target() {
    local target="$1"
    
    if [[ ! -f "$target" ]]; then
        print_error "Target file does not exist: $target"
        exit 1
    fi
    
    print_success "Target file found: $target"
}

# ============================================================================
# DEPENDENCY ANALYSIS FUNCTIONS
# ============================================================================

# Extract forward dependencies (imports) with enhanced pattern matching
analyze_forward_dependencies() {
    local target="$1"
    local file_type="${target##*.}"
    
    print_section "Analyzing Forward Dependencies (Imports)"
    
    case "$file_type" in
        astro|tsx|jsx|ts|js|mjs|cjs)
            # Enhanced import patterns matching Python version:
            # 1. ES6 imports: import ... from '...'
            # 2. Dynamic imports: import('...')
            # 3. Require: require('...')
            # 4. Export from: export ... from '...'
            # 5. Type imports: import type ... from '...'
            
            while IFS= read -r line; do
                # Match various import patterns
                local import_path=""
                
                # ES6 import or export from
                if [[ "$line" =~ (import|export).*from[[:space:]]+[\'\"](([^\'\"]+))[\'\"]\; ]]; then
                    import_path="${BASH_REMATCH[2]}"
                # Dynamic import
                elif [[ "$line" =~ import\([\'\"](([^\'\"]+))[\'\"]\) ]]; then
                    import_path="${BASH_REMATCH[1]}"
                # Require
                elif [[ "$line" =~ require\([\'\"](([^\'\"]+))[\'\"]\) ]]; then
                    import_path="${BASH_REMATCH[1]}"
                fi
                
                if [[ -n "$import_path" ]]; then
                    # Check if it's a type import
                    local is_type=false
                    if [[ "$line" =~ import[[:space:]]+type ]]; then
                        is_type=true
                    fi
                    
                    # Resolve path
                    local resolved_path
                    resolved_path=$(resolve_import_path "$target" "$import_path")
                    
                    if [[ -n "$resolved_path" ]] && [[ -f "$resolved_path" ]]; then
                        FORWARD_DEPS_MAP["$resolved_path"]=1
                        
                        # Check if it's a data file
                        case "$import_path" in
                            *.json|*.yaml|*.yml|*.toml)
                                DATA_DEPS_MAP["$resolved_path"]=1
                                ;;
                        esac
                        
                        # Check if it's a type import
                        if [[ "$is_type" == true ]]; then
                            TYPE_DEPS_MAP["$resolved_path"]=1
                        fi
                        
                        print_info "  → $import_path"
                    else
                        MISSING_DEPS+=("$import_path (referenced in $target)")
                        print_warning "  → $import_path (NOT FOUND)"
                    fi
                fi
            done < "$target"
            ;;
        *)
            print_warning "Unsupported file type for import analysis: $file_type"
            ;;
    esac
    
    # Count unique dependencies
    FORWARD_DEPS_COUNT=${#FORWARD_DEPS_MAP[@]}
    DATA_DEPS_COUNT=${#DATA_DEPS_MAP[@]}
    TYPE_DEPS_COUNT=${#TYPE_DEPS_MAP[@]}
    
    print_success "Found $FORWARD_DEPS_COUNT forward dependencies"
}

# Find reverse dependencies (consumers) - FIXED version
analyze_reverse_dependencies() {
    local target="$1"
    local target_name
    target_name=$(basename "$target")
    local target_without_ext="${target_name%.*}"
    
    print_section "Analyzing Reverse Dependencies (Consumers)"
    
    # Search patterns to try
    local search_patterns=(
        "$target_without_ext"
        "$(basename "$(dirname "$target")")/$target_without_ext"
    )
    
    for pattern in "${search_patterns[@]}"; do
        # FIXED: Use multiple --include flags instead of braced glob
        while IFS= read -r file; do
            if [[ "$file" != "$target" ]] && [[ -n "$file" ]]; then
                REVERSE_DEPS_MAP["$file"]=1
                print_info "  ← $file"
            fi
        done < <(grep -rl "from ['\"].*$pattern['\"]" \
            --include='*.astro' \
            --include='*.tsx' \
            --include='*.jsx' \
            --include='*.ts' \
            --include='*.js' \
            --include='*.mjs' \
            --include='*.cjs' \
            "$WORKSPACE_ROOT/src" 2>/dev/null || true)
    done
    
    # Count unique reverse dependencies
    REVERSE_DEPS_COUNT=${#REVERSE_DEPS_MAP[@]}
    
    print_success "Found $REVERSE_DEPS_COUNT reverse dependencies"
}

# Resolve import paths with enhanced alias support
resolve_import_path() {
    local source_file="$1"
    local import_path="$2"
    local source_dir
    source_dir=$(dirname "$source_file")
    
    # Skip node_modules and external packages
    if [[ "$import_path" =~ ^[a-z@] ]] && [[ ! "$import_path" =~ ^[.~/] ]]; then
        return 1
    fi
    
    # Handle alias paths
    # ~ → src
    if [[ "$import_path" =~ ^~ ]]; then
        import_path="${import_path/#\~/src}"
    fi
    # @ → src (common alias)
    if [[ "$import_path" =~ ^@ ]]; then
        import_path="${import_path/#@/src}"
    fi
    
    # Handle relative paths
    if [[ "$import_path" =~ ^\./ ]] || [[ "$import_path" =~ ^\.\./ ]]; then
        import_path="$source_dir/$import_path"
    fi
    
    # Normalize path
    import_path=$(realpath -m "$WORKSPACE_ROOT/$import_path" 2>/dev/null || echo "$WORKSPACE_ROOT/$import_path")
    
    # Try different extensions
    local extensions=("" ".ts" ".tsx" ".js" ".jsx" ".astro" ".mjs" ".cjs" ".json")
    
    for ext in "${extensions[@]}"; do
        local test_path="${import_path}${ext}"
        if [[ -f "$test_path" ]]; then
            echo "$test_path"
            return 0
        fi
        
        # Try index files
        if [[ -d "$import_path" ]]; then
            local index_path="${import_path}/index${ext}"
            if [[ -f "$index_path" ]]; then
                echo "$index_path"
                return 0
            fi
        fi
    done
    
    return 1
}

# Count lines of code
count_lines() {
    local file="$1"
    if [[ -f "$file" ]]; then
        wc -l < "$file" | tr -d ' '
    else
        echo "0"
    fi
}

# Get file size
get_file_size() {
    local file="$1"
    if [[ -f "$file" ]]; then
        du -h "$file" | cut -f1
    else
        echo "0"
    fi
}

# ============================================================================
# REPORT GENERATION
# ============================================================================

generate_markdown_report() {
    local target="$1"
    local target_name
    target_name=$(basename "$target")
    local output_file="$OUTPUT_DIR/DEPENDENCY_TRACE_${target_name//./_}_${TIMESTAMP}.md"
    
    mkdir -p "$OUTPUT_DIR"
    
    cat > "$output_file" << EOF
# 🔍 DEPENDENCY TRACE REPORT

**Target File:** \`$target\`  
**Analysis Date:** $(date +"%Y-%m-%d %H:%M:%S")  
**Tracer Version:** $SCRIPT_VERSION  
**Analysis Type:** Complete Dependency Graph  

---

## 📊 EXECUTIVE SUMMARY

| Metric | Count |
|--------|-------|
| **Forward Dependencies** | $FORWARD_DEPS_COUNT |
| **Reverse Dependencies** | $REVERSE_DEPS_COUNT |
| **Data Dependencies** | $DATA_DEPS_COUNT |
| **Type Dependencies** | $TYPE_DEPS_COUNT |
| **Missing Dependencies** | ${#MISSING_DEPS[@]} |
| **Total Related Files** | $((FORWARD_DEPS_COUNT + REVERSE_DEPS_COUNT)) |

**File Info:**
- **Lines of Code:** $(count_lines "$target")
- **File Size:** $(get_file_size "$target")
- **File Type:** ${target##*.}

---

## 🔗 FORWARD DEPENDENCIES (Imports)

**What this file depends on:**

EOF

    if [[ ${#FORWARD_DEPS_MAP[@]} -gt 0 ]]; then
        for dep in "${!FORWARD_DEPS_MAP[@]}"; do
            local rel_path="${dep#$WORKSPACE_ROOT/}"
            local lines
            lines=$(count_lines "$dep")
            local size
            size=$(get_file_size "$dep")
            echo "### \`$rel_path\`" >> "$output_file"
            echo "- **Lines:** $lines" >> "$output_file"
            echo "- **Size:** $size" >> "$output_file"
            echo "" >> "$output_file"
        done
    else
        echo "*No forward dependencies found.*" >> "$output_file"
    fi

    cat >> "$output_file" << EOF

---

## ⬆️ REVERSE DEPENDENCIES (Consumers)

**What depends on this file:**

EOF

    if [[ ${#REVERSE_DEPS_MAP[@]} -gt 0 ]]; then
        for dep in "${!REVERSE_DEPS_MAP[@]}"; do
            local rel_path="${dep#$WORKSPACE_ROOT/}"
            echo "- \`$rel_path\`" >> "$output_file"
        done
    else
        echo "*No reverse dependencies found (not imported by any file).*" >> "$output_file"
    fi

    cat >> "$output_file" << EOF

---

## 📄 DATA DEPENDENCIES

**Static resources used:**

EOF

    if [[ ${#DATA_DEPS_MAP[@]} -gt 0 ]]; then
        for dep in "${!DATA_DEPS_MAP[@]}"; do
            local rel_path="${dep#$WORKSPACE_ROOT/}"
            local size
            size=$(get_file_size "$dep")
            echo "- \`$rel_path\` ($size)" >> "$output_file"
        done
    else
        echo "*No data dependencies found.*" >> "$output_file"
    fi

    cat >> "$output_file" << EOF

---

## 🔷 TYPE DEPENDENCIES

**Type definition sources:**

EOF

    if [[ ${#TYPE_DEPS_MAP[@]} -gt 0 ]]; then
        for dep in "${!TYPE_DEPS_MAP[@]}"; do
            local rel_path="${dep#$WORKSPACE_ROOT/}"
            echo "- \`$rel_path\`" >> "$output_file"
        done
    else
        echo "*No explicit type dependencies found.*" >> "$output_file"
    fi

    cat >> "$output_file" << EOF

---

## ⚠️ MISSING DEPENDENCIES

**References that could not be resolved:**

EOF

    if [[ ${#MISSING_DEPS[@]} -gt 0 ]]; then
        for dep in "${MISSING_DEPS[@]}"; do
            echo "- ❌ \`$dep\`" >> "$output_file"
        done
    else
        echo "*All dependencies resolved successfully! ✅*" >> "$output_file"
    fi

    cat >> "$output_file" << EOF

---

**End of Dependency Trace Report** 🔍✅

Generated by: NEXUS Dependency Tracer v$SCRIPT_VERSION
EOF

    echo "$output_file"
}

# Generate NEXUS analysis prompt
generate_nexus_prompt() {
    local target="$1"
    local report_file="$2"
    local prompt_file="$OUTPUT_DIR/NEXUS_ANALYSIS_PROMPT_${TIMESTAMP}.txt"
    
    cat > "$prompt_file" << EOF
🤖 NEXUS TEAM: DEPENDENCY ANALYSIS REQUEST

Target File: $target
Report Generated: $(date +"%Y-%m-%d %H:%M:%S")
Report Location: $report_file

═══════════════════════════════════════════════════════════

MISSION: Comprehensive Dependency Analysis

The NEXUS team is requested to perform a deep analysis of the dependency
trace report generated for the target file above.

═══════════════════════════════════════════════════════════

DEPENDENCY SUMMARY:

Forward Dependencies:  $FORWARD_DEPS_COUNT
Reverse Dependencies:  $REVERSE_DEPS_COUNT
Data Dependencies:     $DATA_DEPS_COUNT
Type Dependencies:     $TYPE_DEPS_COUNT
Missing Dependencies:  ${#MISSING_DEPS[@]}
Total Related Files:   $((FORWARD_DEPS_COUNT + REVERSE_DEPS_COUNT))

═══════════════════════════════════════════════════════════

NEXUS TEAM: Please provide your comprehensive analysis based on the
dependency trace report. Focus on actionable insights, potential issues,
and optimization opportunities.

Generated by: NEXUS Dependency Tracer v$SCRIPT_VERSION
EOF

    echo "$prompt_file"
}

# Generate JSON report (basic implementation)
generate_json_report() {
    local target="$1"
    local target_name
    target_name=$(basename "$target")
    local output_file="$OUTPUT_DIR/DEPENDENCY_TRACE_${target_name//./_}_${TIMESTAMP}.json"
    
    mkdir -p "$OUTPUT_DIR"
    
    cat > "$output_file" << EOF
{
  "workspace_root": "$WORKSPACE_ROOT",
  "timestamp": "$TIMESTAMP",
  "tracer_version": "$SCRIPT_VERSION",
  "target": "$target",
  "metrics": {
    "forward_dependencies": $FORWARD_DEPS_COUNT,
    "reverse_dependencies": $REVERSE_DEPS_COUNT,
    "data_dependencies": $DATA_DEPS_COUNT,
    "type_dependencies": $TYPE_DEPS_COUNT,
    "missing_dependencies": ${#MISSING_DEPS[@]},
    "total_related_files": $((FORWARD_DEPS_COUNT + REVERSE_DEPS_COUNT)),
    "line_count": $(count_lines "$target"),
    "file_size_bytes": $(stat -f%z "$target" 2>/dev/null || stat -c%s "$target" 2>/dev/null || echo 0)
  },
  "forward_dependencies": [
EOF

    # Add forward dependencies
    local first=true
    for dep in "${!FORWARD_DEPS_MAP[@]}"; do
        if [[ "$first" == false ]]; then
            echo "," >> "$output_file"
        fi
        echo "    \"$dep\"" >> "$output_file"
        first=false
    done

    cat >> "$output_file" << EOF
  ],
  "reverse_dependencies": [
EOF

    # Add reverse dependencies
    first=true
    for dep in "${!REVERSE_DEPS_MAP[@]}"; do
        if [[ "$first" == false ]]; then
            echo "," >> "$output_file"
        fi
        echo "    \"$dep\"" >> "$output_file"
        first=false
    done

    cat >> "$output_file" << EOF
  ],
  "data_dependencies": [
EOF

    # Add data dependencies
    first=true
    for dep in "${!DATA_DEPS_MAP[@]}"; do
        if [[ "$first" == false ]]; then
            echo "," >> "$output_file"
        fi
        echo "    \"$dep\"" >> "$output_file"
        first=false
    done

    cat >> "$output_file" << EOF
  ],
  "missing_dependencies": [
EOF

    # Add missing dependencies
    first=true
    for dep in "${MISSING_DEPS[@]}"; do
        if [[ "$first" == false ]]; then
            echo "," >> "$output_file"
        fi
        echo "    \"$dep\"" >> "$output_file"
        first=false
    done

    cat >> "$output_file" << EOF
  ]
}
EOF

    echo "$output_file"
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    # Parse command line options
    parse_options "$@"
    
    # Setup colors based on options
    setup_colors
    
    # Clear screen and show header
    clear
    print_header "NEXUS DEPENDENCY TRACER v$SCRIPT_VERSION"
    
    # Convert to absolute path
    if [[ ! "$TARGET_FILE" =~ ^/ ]]; then
        TARGET_FILE="$WORKSPACE_ROOT/$TARGET_FILE"
    fi
    
    # Validate target exists
    validate_target "$TARGET_FILE"
    
    print_info "Workspace: $WORKSPACE_ROOT"
    print_info "Output directory: $OUTPUT_DIR"
    print_info "Output format: $OPT_FORMAT"
    if [[ "$OPT_DEEP" == true ]]; then
        print_warning "Deep analysis not yet implemented (planned feature)"
    fi
    echo ""
    
    # Run analyses
    analyze_forward_dependencies "$TARGET_FILE"
    analyze_reverse_dependencies "$TARGET_FILE"
    
    # Generate reports based on format option
    print_section "Generating Reports"
    
    local report_file=""
    local json_file=""
    local prompt_file=""
    
    if [[ "$OPT_FORMAT" == "markdown" ]] || [[ "$OPT_FORMAT" == "both" ]]; then
        report_file=$(generate_markdown_report "$TARGET_FILE")
        print_success "Markdown report: $report_file"
        
        prompt_file=$(generate_nexus_prompt "$TARGET_FILE" "$report_file")
        print_success "NEXUS prompt: $prompt_file"
    fi
    
    if [[ "$OPT_FORMAT" == "json" ]] || [[ "$OPT_FORMAT" == "both" ]]; then
        json_file=$(generate_json_report "$TARGET_FILE")
        print_success "JSON report: $json_file"
    fi
    
    # Summary
    print_section "Analysis Complete"
    
    echo ""
    print_info "📊 Summary:"
    echo "  Forward Dependencies:  $FORWARD_DEPS_COUNT"
    echo "  Reverse Dependencies:  $REVERSE_DEPS_COUNT"
    echo "  Data Dependencies:     $DATA_DEPS_COUNT"
    echo "  Type Dependencies:     $TYPE_DEPS_COUNT"
    if [[ ${#MISSING_DEPS[@]} -gt 0 ]]; then
        echo "  Missing Dependencies:  ${#MISSING_DEPS[@]} ⚠️"
    fi
    echo "  Total Related Files:   $((FORWARD_DEPS_COUNT + REVERSE_DEPS_COUNT))"
    echo ""
    
    print_success "✅ Dependency trace complete!"
    echo ""
    
    if [[ -n "$report_file" ]]; then
        print_info "📄 View report: cat $report_file"
    fi
    if [[ -n "$json_file" ]]; then
        print_info "📊 View JSON: cat $json_file"
    fi
    if [[ -n "$prompt_file" ]]; then
        print_info "🤖 NEXUS prompt: cat $prompt_file"
    fi
    echo ""
}

# Run main function
main "$@"
